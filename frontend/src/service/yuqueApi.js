/**
 * 语雀文章数据源
 *
 * 数据由 `server/scripts/sync-yuque.js` 同步生成到 frontend/public/yuque/，
 * 由 Vite / Vercel 作为静态资源原样发布，所以线上不需要任何后端进程。
 *
 *   /yuque/index.json          全部文章的元数据（不含正文）+ 分类 + 标签
 *   /yuque/articles/{id}.json  单篇文章的完整正文
 *
 * 注意：正文是同步时就已经编译好的 HTML（详情页用 v-html 直接渲染），
 * 这里不再做 Markdown 解析。
 */

const INDEX_URL = '/yuque/index.json'
const articleUrl = (id) => `/yuque/articles/${encodeURIComponent(id)}.json`

let indexPromise = null

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} 返回 HTTP ${res.status}`)

  // vercel.json 里有一条 SPA rewrite，会把所有找不到的路径回退成 index.html，
  // 也就是说「文件不存在」拿到的是 HTTP 200 + text/html，而不是 404。
  // 直接 res.json() 会抛一个很难懂的解析错误，这里提前识别并说清楚。
  const type = res.headers.get('content-type') || ''
  if (!type.includes('json')) {
    throw new Error(
      `${url} 拿到的不是 JSON（content-type: ${type || '未知'}），` +
        `大概率是语雀数据还没同步 —— 先在 server/ 下跑 npm run sync:yuque`,
    )
  }
  return res.json()
}

function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetchJson(INDEX_URL)
    // 别把失败的 Promise 缓存住，否则一次失败之后重试也永远拿到 reject
    indexPromise.catch(() => {
      indexPromise = null
    })
  }
  return indexPromise
}

function byCreatedAtDesc(a, b) {
  return new Date(b.created_at || 0) - new Date(a.created_at || 0)
}

export const yuqueApi = {
  /** 语雀数据是否就绪。用来决定走语雀、还是回退到原来的后端接口。 */
  async isAvailable() {
    try {
      await loadIndex()
      return true
    } catch {
      return false
    }
  },

  async getArticles() {
    const { articles } = await loadIndex()
    return [...articles].sort(byCreatedAtDesc)
  },

  async getArticleById(id) {
    return fetchJson(articleUrl(id))
  },

  async getCategories() {
    return (await loadIndex()).categories || []
  },

  async getTags() {
    return (await loadIndex()).tags || []
  },

  async getArticlesByCategory(categoryId) {
    const { articles } = await loadIndex()
    return articles
      .filter((a) => String(a.category_id) === String(categoryId))
      .sort(byCreatedAtDesc)
  },

  async searchArticles(keyword) {
    const kw = String(keyword || '').trim().toLowerCase()
    if (!kw) return []
    const { articles } = await loadIndex()
    return articles
      .filter(
        (a) =>
          (a.title || '').toLowerCase().includes(kw) ||
          (a.summary || '').toLowerCase().includes(kw),
      )
      .sort(byCreatedAtDesc)
  },

  async getTopAndFeatured() {
    const { articles } = await loadIndex()
    return {
      top: articles.filter((a) => a.is_top).sort(byCreatedAtDesc).slice(0, 5),
      featured: articles.filter((a) => a.is_featured).sort(byCreatedAtDesc).slice(0, 5),
    }
  },

  /** 按 年-月 分组，供归档页使用 */
  async getArchives() {
    const { articles } = await loadIndex()
    const grouped = {}
    for (const a of [...articles].sort(byCreatedAtDesc)) {
      const d = new Date(a.created_at)
      if (Number.isNaN(d.getTime())) continue
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!grouped[key]) grouped[key] = []
      grouped[key].push({ id: a.id, title: a.title, created_at: a.created_at })
    }
    return grouped
  },
}
