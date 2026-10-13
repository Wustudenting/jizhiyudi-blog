#!/usr/bin/env node
/**
 * 语雀知识库同步脚本
 *
 * 用浏览器 Cookie 走语雀「网页端接口」，把私密知识库的文档拉成本地数据。
 * 之所以不用官方 Open API：语雀的个人 Token 是会员权益，免费账号申请不了。
 *
 * 用法：
 *   node scripts/sync-yuque.js              # 同步全部配置的知识库
 *   node scripts/sync-yuque.js --list       # 只列出知识库，方便你挑 book_id
 *   node scripts/sync-yuque.js --book=123   # 只同步指定知识库
 *
 * 凭证放在 server/.env（已被 .gitignore 忽略，切勿提交）：
 *   YUQUE_COOKIE=    浏览器里复制的整串 Cookie
 *   YUQUE_BOOK_IDS=  要同步的知识库 id，逗号分隔；留空表示同步全部
 */

const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

const ROOT = path.join(__dirname, '..')
// 产物直接落到前端的 public/ 下：Vite 与 Vercel 都会把它当静态资源原样发布，
// 所以线上不需要任何后端就能读到文章。
const OUT_DIR = path.join(ROOT, '..', 'frontend', 'public', 'yuque')
let BASE = 'https://www.yuque.com' // 可用 YUQUE_BASE 覆盖，便于本地 mock 测试

// ---------------------------------------------------------------- env

function loadEnv() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    // 去掉可能带的引号
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

// ---------------------------------------------------------------- http

/** 从 Cookie 串里取某个 key 的值 */
function readCookie(cookieStr, name) {
  const m = cookieStr.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return m ? m[1] : null
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36'

/**
 * 请求语雀网页端接口。
 * 鉴权靠 Cookie（_yuque_session）；x-csrf-token 实测非必需，带上更稳。
 *
 * 返回 { status, contentType, text } 而不是直接解析 —— 因为语雀有些端点
 * 会「HTTP 200 但返回的是一个 HTML 阅读页」，光看状态码拦不住，必须看 content-type。
 */
async function yuqueRequest(url, { cookie, csrf, retries = 3 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    let res
    try {
      res = await fetch(url, {
        headers: {
          cookie,
          ...(csrf ? { 'x-csrf-token': csrf } : {}),
          'user-agent': UA,
          referer: `${BASE}/`,
          accept: 'application/json, text/plain, text/markdown, */*',
        },
      })
    } catch (err) {
      if (attempt === retries) throw new Error(`请求失败 ${url}：${err.message}`)
      await sleep(1000 * attempt)
      continue
    }

    if (res.status === 429) {
      // 语雀限流：每小时 5000 次、每秒 100 次
      const wait = 2000 * attempt
      console.warn(`  ⏳ 触发限流(429)，${wait}ms 后重试…`)
      await sleep(wait)
      continue
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        `鉴权失败(${res.status})。Cookie 可能已过期。重新获取：浏览器 F12 → Network → ` +
          `点开任意请求 → Headers → Request Headers → 右键 Cookie 的值选「复制值」→ 贴进 server/.env`,
      )
    }

    return {
      status: res.status,
      contentType: res.headers.get('content-type') || '',
      text: await res.text(),
    }
  }
  throw new Error(`重试 ${retries} 次仍失败 — ${url}`)
}

/** 要求返回 JSON 的端点。content-type 不对就报错，避免把 HTML 阅读页当数据解析。 */
async function yuqueJson(url, ctx) {
  const { status, contentType, text } = await yuqueRequest(url, ctx)
  if (status >= 400) throw new Error(`HTTP ${status} — ${url}`)
  if (!contentType.includes('json')) {
    throw new Error(`期望 JSON，实际是 ${contentType || '未知类型'} — ${url}`)
  }
  return JSON.parse(text)
}

// ---------------------------------------------------------------- 拉取

async function listBooks(ctx) {
  const json = await yuqueJson(`${BASE}/api/mine/books`, ctx)
  return json?.data || []
}

async function listDocs(bookId, ctx) {
  const docs = []
  const limit = 100
  // 实测顶层 meta.total 恒为 -1，不能用它判断总数，
  // 只能一直翻到某一页返回的条数少于 limit 为止。
  for (let offset = 0; ; offset += limit) {
    const json = await yuqueJson(
      `${BASE}/api/docs?book_id=${bookId}&limit=${limit}&offset=${offset}`,
      ctx,
    )
    const batch = json?.data || []
    docs.push(...batch)
    if (batch.length < limit) break
    await sleep(200)
  }
  return docs
}

/**
 * 取文档的 Markdown 原文。两条路，任何一条拿到就用：
 *
 * ① `/{login}/{book_slug}/{doc_slug}/markdown` —— 直接返回 text/markdown，最干净。
 *    **必须带 attachment=true**，否则语雀会返回 HTTP 200 + 一个约 245KB 的
 *    HTML 阅读页，状态码拦不住，所以这里强制校验 content-type。
 *
 * ② `/api/docs/{slug}?book_id=&mode=markdown` —— 注意它返回的是 **JSON**，
 *    不是纯文本，Markdown 原文在 data.sourcecode 里。
 *    （不带 mode 的话 data 里只有 Lake XML 的 content，没有可用的 markdown/HTML 正文。）
 *
 * 两条都失败就抛错，让调用方跳过这篇 —— 宁可漏一篇，也不要发一篇正文为空的文章。
 */
async function fetchDocBody(book, doc, ctx) {
  const login = book.user?.login || book.login
  const slug = doc.slug || doc.id

  // 端点通了但正文是空白的（语雀里只建了标题没写内容）也要单独识别出来，
  // 否则会和"接口挂了"混在一起，排查时看不出所以然。
  let sawEmpty = false

  if (login && book.slug && doc.slug) {
    const url = `${BASE}/${login}/${book.slug}/${doc.slug}/markdown?attachment=true&anchor=false&linebreak=false`
    try {
      const { status, contentType, text } = await yuqueRequest(url, ctx)
      if (status < 400 && /markdown|text\/plain/.test(contentType)) {
        if (text.trim()) return { content: text, format: 'markdown' }
        sawEmpty = true
      } else if (status < 400) {
        console.warn(`    ⚠️  markdown 端点返回的是 ${contentType}，换 API 端点`)
      }
    } catch (err) {
      console.warn(`    ⚠️  markdown 端点失败：${err.message}`)
    }
  }

  try {
    const json = await yuqueJson(`${BASE}/api/docs/${slug}?book_id=${book.id}&mode=markdown`, ctx)
    const src = json?.data?.sourcecode
    if (typeof src === 'string' && src.trim()) return { content: src, format: 'markdown' }
    if (typeof src === 'string') sawEmpty = true
  } catch (err) {
    console.warn(`    ⚠️  API markdown 端点失败：${err.message}`)
  }

  if (sawEmpty) {
    const err = new Error('空文档，语雀里只有标题没写正文')
    err.isEmptyDoc = true
    throw err
  }
  throw new Error('拿不到 Markdown 原文')
}

// ---------------------------------------------------------------- 主流程

/**
 * 语雀图床 cdn.nlark.com 有防盗链：只要 Referer 不是 yuque/nlark 域名就返回 403。
 * 文章发布到自己的博客后，图片会因此全部裂掉。
 * 给正文里的 <img> 一律加上 referrerpolicy="no-referrer"，浏览器就不发 Referer 了。
 */
function addNoReferrer(html) {
  return html.replace(/<img(?=[\s>])/gi, '<img referrerpolicy="no-referrer"')
}

/**
 * 详情页是用 v-html 直接渲染 HTML 的（项目里没有前端 Markdown 库），
 * 所以在这里就把 Markdown 编译成 HTML，前端可以零改动。
 */
function renderContent(content, format) {
  if (format === 'markdown') {
    try {
      return addNoReferrer(marked.parse(content, { breaks: true, gfm: true }))
    } catch (err) {
      console.warn(`    ⚠️  Markdown 编译失败，退回原文：${err.message}`)
      return addNoReferrer(content)
    }
  }
  return addNoReferrer(content)
}

async function syncBook(book, ctx) {
  console.log(`\n📚 ${book.name}  (id=${book.id}, slug=${book.slug})`)
  const docs = await listDocs(book.id, ctx)
  console.log(`   共 ${docs.length} 篇文档`)

  const articles = []
  for (const [i, doc] of docs.entries()) {
    const label = `[${i + 1}/${docs.length}]`
    try {
      const { content, format } = await fetchDocBody(book, doc, ctx)
      // 输出成前端 mapArticleFromBackend() 期望的结构，
      // 这样前端几乎不用改就能直接消费。
      articles.push({
        id: doc.id, // 语雀文档 id，账号内唯一，直接拿来当文章 id
        title: doc.title,
        summary: doc.description || '',
        content: renderContent(content, format), // 编译后的 HTML，详情页直接 v-html 渲染
        contentFormat: format, // markdown | html，标记原稿格式
        // 标记数据来源：语雀文章只能在语雀里删改，博客上的「删除」按钮对它无效
        source: 'yuque',
        cover: '',
        category_id: book.id, // 语雀「知识库」映射为博客的「分类」
        category: { id: book.id, name: book.name, description: book.description || '' },
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        view_count: 0,
        like_count: 0,
        is_top: 0,
        is_featured: 0,
        tags: [],
        status: 'published',
        yuqueUrl: [BASE, book.user?.login || book.login, book.slug, doc.slug]
          .filter(Boolean)
          .join('/'),
        slug: doc.slug,
        wordCount: doc.word_count || 0,
      })
      console.log(`   ${label} ✓ ${doc.title}`)
    } catch (err) {
      // ⊘ = 语雀里的空文档，属于预期内的跳过；✗ = 真的出错了
      console.warn(`   ${label} ${err.isEmptyDoc ? '⊘' : '✗'} ${doc.title} — ${err.message}`)
    }
    await sleep(150) // 对语雀友好一点
  }
  return articles
}

async function main() {
  loadEnv()
  if (process.env.YUQUE_BASE) BASE = process.env.YUQUE_BASE

  const args = process.argv.slice(2)
  const listOnly = args.includes('--list')
  const bookArg = args.find((a) => a.startsWith('--book='))

  const cookie = process.env.YUQUE_COOKIE
  if (!cookie) {
    console.error(
      [
        '❌ 缺少 YUQUE_COOKIE。',
        '',
        '请这样获取：',
        '  1. 浏览器登录语雀，打开 https://www.yuque.com/dashboard',
        '  2. F12 → Network（网络）→ 刷新页面',
        '  3. 找到任意一个请求（比如 mine），复制 Request Headers 里的整条 Cookie',
        '  4. 粘贴到 server/.env ：YUQUE_COOKIE=<粘贴到这里>',
        '',
        '注意：Cookie 等价于你的登录态，不要提交到 Git，也不要发给别人。',
      ].join('\n'),
    )
    process.exit(1)
  }

  // 语雀把 CSRF token 存在 cookie 里，新版叫 yuque_ctoken，旧版叫 ctoken，两个都认
  // Cookie 会作为 HTTP 头发出，头只能含 ASCII。
  // 混进一个中文字符（比如粘贴时带了中文标点、或占位符没替换）
  // 会抛 "Cannot convert argument to a ByteString"，报错完全看不出病因。
  const badChar = [...cookie].find((ch) => ch.charCodeAt(0) > 255)
  if (badChar) {
    console.error(
      `❌ YUQUE_COOKIE 里含非 ASCII 字符「${badChar}」。\n` +
        '   HTTP 请求头只能是 ASCII，请确认已把 .env 里的占位符替换成真实值，\n' +
        '   并且没有混入中文标点或换行。',
    )
    process.exit(1)
  }

  const csrf = readCookie(cookie, 'yuque_ctoken') || readCookie(cookie, 'ctoken')
  if (!csrf) {
    console.error(
      '❌ Cookie 里没找到 yuque_ctoken（或 ctoken）。\n' +
        '   语雀网页端接口需要 x-csrf-token 请求头，它的值就是 Cookie 里的 yuque_ctoken。\n' +
        '   请确认复制的是**完整**的 Cookie，至少应包含两项：_yuque_session 和 yuque_ctoken。',
    )
    process.exit(1)
  }
  if (!readCookie(cookie, '_yuque_session')) {
    console.error(
      '❌ Cookie 里没找到 _yuque_session（这是登录凭证，没有它一定 401）。\n' +
        '   注意：不要从 DevTools 的 Cookie 面板逐条复制，那里的长值会被截断成 "..."。\n' +
        '   请在 Network 标签点开任意请求 → Headers → Request Headers → 复制整行 Cookie 的值。',
    )
    process.exit(1)
  }

  const ctx = { cookie, csrf }

  console.log('🔍 正在读取知识库列表…')
  const allBooks = await listBooks(ctx)
  console.log(`   找到 ${allBooks.length} 个知识库`)

  if (listOnly) {
    console.log('\n可用知识库：')
    for (const b of allBooks) {
      console.log(`  id=${String(b.id).padEnd(10)} ${b.name}  (${b.slug}, ${b.items_count} 篇)`)
    }
    console.log('\n把想要的 id 填进 server/.env 的 YUQUE_BOOK_IDS=，逗号分隔。')
    return
  }

  let targets = allBooks
  if (bookArg) {
    const id = bookArg.split('=')[1]
    targets = allBooks.filter((b) => String(b.id) === String(id))
  } else if (process.env.YUQUE_BOOK_IDS?.trim()) {
    const ids = process.env.YUQUE_BOOK_IDS.split(',').map((s) => s.trim()).filter(Boolean)
    targets = allBooks.filter((b) => ids.includes(String(b.id)))
  }

  if (!targets.length) {
    console.error('❌ 没有匹配到任何知识库。先跑 `node scripts/sync-yuque.js --list` 看看有哪些 id。')
    process.exit(1)
  }

  const books = []
  for (const book of targets) {
    const articles = await syncBook(book, ctx)
    books.push({
      id: book.id,
      name: book.name,
      slug: book.slug,
      description: book.description || '',
      articles,
    })
  }

  const allArticles = books.flatMap((b) => b.articles)
  const total = allArticles.length

  // 索引 + 单篇分离：列表页只拉 index.json（不含正文），详情页才拉单篇，
  // 避免首页一上来就下载全部文章正文。
  const articlesDir = path.join(OUT_DIR, 'articles')
  const indexArticles = []
  fs.mkdirSync(articlesDir, { recursive: true })

  // 清掉上一轮的残留，防止语雀里已删的文档还留在本地。
  // 这里只删目录内的文件、不递归删目录本身：Windows 上对带中文的路径
  // 做 rmSync(recursive) 会抛 EPERM。
  for (const f of fs.readdirSync(articlesDir)) {
    if (f.endsWith('.json')) fs.unlinkSync(path.join(articlesDir, f))
  }

  for (const a of allArticles) {
    const { content, ...meta } = a
    fs.writeFileSync(path.join(articlesDir, `${a.id}.json`), JSON.stringify(a))
    indexArticles.push(meta)
  }

  // 一篇文章都没同步到的知识库不作为分类输出 ——
  // 博客上挂一个「0 篇」的分类只会让人困惑。
  const emptyBooks = books.filter((b) => b.articles.length === 0)
  if (emptyBooks.length) {
    console.log(
      `\n⊘ 以下知识库没有可发布的内容，已跳过（不生成分类）：\n` +
        emptyBooks.map((b) => `     ${b.name}`).join('\n'),
    )
  }

  const categories = books
    .filter((b) => b.articles.length > 0)
    .map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description || '',
      count: b.articles.length,
    }))

  fs.writeFileSync(
    path.join(OUT_DIR, 'index.json'),
    JSON.stringify(
      { syncedAt: new Date().toISOString(), categories, tags: [], articles: indexArticles },
      null,
      2,
    ),
  )

  const kb = (fs.statSync(path.join(OUT_DIR, 'index.json')).size / 1024).toFixed(0)
  console.log(`\n✅ 同步完成：${books.length} 个知识库，共 ${total} 篇文章`)
  console.log(`   索引：${path.relative(process.cwd(), path.join(OUT_DIR, 'index.json'))}  (${kb} KB)`)
  console.log(`   正文：${path.relative(process.cwd(), articlesDir)}/  (${total} 个文件)`)
}

main().catch((err) => {
  console.error('\n❌ 同步失败：', err.message)
  // 这里不能用 process.exit()：此刻 fetch 的 socket 正在关闭，
  // Windows 上会触发 libuv 的 "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)" 崩溃。
  // 设 exitCode 让 Node 自己排空事件循环后自然退出。
  process.exitCode = 1
})
