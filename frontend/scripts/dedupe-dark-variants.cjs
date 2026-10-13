#!/usr/bin/env node
/**
 * 清理同一元素上重复的 dark: 变体。
 *
 * 背景：手写的 dark: 类和 codemod 补的规则值不一致，会产生
 *   text-slate-600 dark:text-slate-400 dark:text-slate-300
 * 这种一个属性两个暗色值的情况。Tailwind 里哪条生效取决于 CSS 生成
 * 顺序，不是类名顺序，所以必须去掉。
 *
 * 归组键忽略具体色阶（slate-300 和 slate-400 归为一族），
 * 同一族只保留**最后**一个 —— 也就是 codemod 统一补的那份。
 *
 *   node scripts/dedupe-dark-variants.cjs          # 干跑
 *   node scripts/dedupe-dark-variants.cjs --write
 */
const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '..', 'src')

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (e.name.endsWith('.vue')) out.push(p)
  }
  return out
}

/**
 * dark:bg-slate-800/60      → dark:bg-slate        （忽略色阶与透明度）
 * dark:hover:text-indigo-300 → dark:hover:text-indigo
 * dark:border-white/80       → dark:border-white
 */
function familyKey(tok) {
  const m = tok.match(/^(dark:(?:[a-z-]+:)*)(text|bg|border|divide|placeholder|shadow|ring|from|to|via)-([a-z]+)(?:-\d+)?(?:\/\d+)?$/)
  if (!m) return null
  return `${m[1]}${m[2]}-${m[3]}`
}

function dedupeClassString(text) {
  const tokens = text.split(/(\s+)/)
  const words = tokens.filter((t) => !/^\s*$/.test(t))
  const darkWords = words.filter((w) => w.startsWith('dark:'))

  // 找出每个族里要保留的那个（最后一个）
  const keep = new Map()
  for (const w of darkWords) {
    const k = familyKey(w)
    if (k) keep.set(k, w) // 后来的覆盖先前的
  }

  let removed = 0
  const seen = new Set()
  const out = []
  // 倒着扫：先遇到的（也就是靠后的）保留，之后的同族丢弃
  const reversed = [...tokens].reverse()
  const result = reversed.map((tok) => {
    if (/^\s*$/.test(tok)) return tok
    const k = familyKey(tok)
    if (!k) return tok
    if (seen.has(k)) {
      removed++
      return null
    }
    seen.add(k)
    return tok
  })
  for (const t of result.reverse()) {
    if (t === null) {
      // 丢掉这个 token 以及它前面多余的空白
      if (out.length && /^\s*$/.test(out[out.length - 1])) out.pop()
      continue
    }
    out.push(t)
  }
  return { text: out.join(''), removed }
}

function transformFile(content) {
  let total = 0
  const next = content.replace(/(["'])((?:\\.|(?!\1)[^\\])*)\1/g, (m, q, body) => {
    if (!body.includes('dark:')) return m
    const { text, removed } = dedupeClassString(body)
    total += removed
    return removed ? q + text + q : m
  })
  return { next, total }
}

const files = walk(SRC)
const write = process.argv.includes('--write')
let grand = 0

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8')
  const { next, total } = transformFile(content)
  if (!total) continue
  grand += total
  console.log(`  ${write ? '改' : '将改'} ${String(total).padStart(3)} 处  ${path.relative(path.join(__dirname, '..'), f)}`)
  if (write) fs.writeFileSync(f, next)
}

console.log(`\n${write ? '✅ 已清理' : '（干跑）将清理'} ${grand} 处重复的 dark: 变体`)
