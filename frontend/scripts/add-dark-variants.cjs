#!/usr/bin/env node
/**
 * 一次性 codemod：给各视图里高频的 Tailwind 类补上 dark: 变体。
 *
 * 只处理「带引号的、看起来像 class 列表的字符串」，逐 token 替换，
 * 并且同一串里已有对应 dark: 类时跳过 —— 所以**可以安全地重复运行**。
 *
 *   node scripts/add-dark-variants.cjs          # 干跑，只报告
 *   node scripts/add-dark-variants.cjs --write  # 实际写入
 */
const fs = require('fs')
const path = require('path')

const COLORS = [
  'slate', 'gray', 'zinc', 'indigo', 'blue', 'purple', 'violet', 'sky',
  'amber', 'orange', 'yellow', 'emerald', 'teal', 'cyan', 'green', 'lime',
  'pink', 'rose', 'fuchsia', 'red',
]

/** 固定映射：非彩色的、或者语义特殊的 */
const FIXED = {
  'text-slate-800': 'dark:text-slate-100',
  'text-slate-700': 'dark:text-slate-300',
  'text-slate-600': 'dark:text-slate-400',
  'text-slate-500': 'dark:text-slate-400',
  'text-slate-400': 'dark:text-slate-500',
  'bg-white/95': 'dark:bg-slate-900/95',
  'bg-white/90': 'dark:bg-slate-800/80',
  'bg-white/80': 'dark:bg-slate-800/70',
  'bg-white/70': 'dark:bg-slate-800/60',
  'bg-white/60': 'dark:bg-slate-800/50',
  'bg-white/50': 'dark:bg-slate-800/40',
  'border-white/80': 'dark:border-slate-700/50',
  'border-white/60': 'dark:border-slate-700/50',
  'border-white/50': 'dark:border-slate-700/40',
  'bg-slate-50': 'dark:bg-slate-700/40',
  'bg-slate-100': 'dark:bg-slate-700/60',
  'from-slate-50': 'dark:from-slate-700/40',
  'via-slate-50': 'dark:via-slate-700/40',
  'to-slate-50': 'dark:to-slate-700/40',
  'from-slate-100': 'dark:from-slate-700/50',
  'to-slate-100': 'dark:to-slate-700/50',
  'from-white': 'dark:from-slate-800/30',
  'to-white': 'dark:to-slate-800/30',
  'placeholder-slate-400': 'dark:placeholder-slate-500',
  'placeholder-slate-500': 'dark:placeholder-slate-400',
  'divide-slate-100': 'dark:divide-slate-700/60',
  'divide-slate-200': 'dark:divide-slate-700',
}

/** 程序化生成：彩色系（渐变浅色标、浅底、浅边框、深文字） */
const GENERATED = {}
for (const c of COLORS) {
  // 渐变浅色标 → 暗色下改成该色低透明度的叠加，保留色相
  GENERATED[`from-${c}-50`] = `dark:from-${c}-500/10`
  GENERATED[`from-${c}-100`] = `dark:from-${c}-500/20`
  GENERATED[`via-${c}-50`] = `dark:via-${c}-500/10`
  GENERATED[`via-${c}-100`] = `dark:via-${c}-500/20`
  GENERATED[`to-${c}-50`] = `dark:to-${c}-500/10`
  GENERATED[`to-${c}-100`] = `dark:to-${c}-500/20`
  // 浅色底
  GENERATED[`bg-${c}-50`] = `dark:bg-${c}-500/10`
  GENERATED[`bg-${c}-100`] = `dark:bg-${c}-500/20`
  // 浅色边框
  GENERATED[`border-${c}-50`] = `dark:border-${c}-500/10`
  GENERATED[`border-${c}-100`] = `dark:border-${c}-500/20`
  GENERATED[`border-${c}-200`] = `dark:border-${c}-500/30`
  // 深色文字 → 暗色下提亮
  GENERATED[`text-${c}-600`] = `dark:text-${c}-300`
  GENERATED[`text-${c}-700`] = `dark:text-${c}-300`
  GENERATED[`text-${c}-800`] = `dark:text-${c}-200`
}

const MAP = { ...GENERATED, ...FIXED }

const SRC = path.join(__dirname, '..', 'src')

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (e.name.endsWith('.vue')) out.push(p)
  }
  return out
}

function processClassString(text) {
  const tokens = text.split(/(\s+)/) // 保留空白
  const present = new Set(tokens.filter((t) => !/^\s*$/.test(t)))
  let changed = 0

  const out = tokens.map((tok) => {
    if (/^\s*$/.test(tok)) return tok

    if (tok === 'bg-white') {
      if (present.has('dark:bg-slate-800')) return tok
      changed++
      return 'bg-white dark:bg-slate-800'
    }

    const dark = MAP[tok]
    if (!dark) return tok

    // 同一族已经有别的 dark: 值了就跳过（codemod 是值统一的，以先到的为准）
    const fam = dark.replace(/^(dark:(?:[a-z-]+:)*[a-z]+-)[a-z]+(?:-\d+)?(?:\/\d+)?$/, '$1')
    const hasFamily = [...present].some(
      (t) => t.startsWith('dark:') && t.startsWith(fam),
    )
    if (present.has(dark) || hasFamily) return tok

    changed++
    return `${tok} ${dark}`
  })

  return { text: out.join(''), changed }
}

function transformFile(content) {
  let total = 0

  // 单个 token 是否长得像 Tailwind 类名（不含引号、问号、逗号等表达式字符）
  const TOKEN_OK = /^[-a-z0-9:/[\]().%#_!]+$/i

  /**
   * 判断一个引号串是不是「纯 class 列表」。
   *
   * 关键：必须逐 token 判断，不能用整串正则 —— 因为像
   *   :class="['px-3 ...', cond ? 'bg-indigo-500' : 'bg-indigo-50 text-indigo-600']"
   * 这种三元表达式，整个属性里混着 ' ? , []，整串正则一看就直接放弃了，
   * 结果里面真正的 class 串一个都没处理到。
   *
   * 用「至少命中一个已知类」兜底，避免误伤普通英文文案。
   */
  const isClassLike = (s) => {
    if (!s || s.length > 6000) return false
    const toks = s.trim().split(/\s+/).filter(Boolean)
    if (!toks.length) return false
    if (!toks.some((t) => t in MAP || t === 'bg-white')) return false
    return toks.every((t) => TOKEN_OK.test(t))
  }

  // 分两轮：先单引号、再双引号。
  // 不能用一个 (["']) 的正则一次搞定 —— 因为 `:class="[...'...' ...]"` 里，
  // 外层的双引号会一路吞到结尾，把里面的单引号串整个包进去，导致内层一个都匹配不到。
  const pass = (src, re, q) =>
    src.replace(re, (m, body) => {
      if (!isClassLike(body)) return m
      const { text, changed } = processClassString(body)
      total += changed
      return changed ? q + text + q : m
    })

  let next = pass(content, /'((?:\\.|[^'\\])*)'/g, "'")
  next = pass(next, /"((?:\\.|[^"\\])*)"/g, '"')

  return { next, total }
}

const files = walk(SRC)
const write = process.argv.includes('--write')
let grand = 0
let touched = 0

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8')
  const { next, total } = transformFile(content)
  if (!total) continue
  grand += total
  touched++
  console.log(`  ${write ? '改' : '将改'} ${String(total).padStart(3)} 处  ${path.relative(path.join(__dirname, '..'), f)}`)
  if (write) fs.writeFileSync(f, next)
}

console.log(
  `\n${write ? '✅ 已写入' : '（干跑）将处理'} ${grand} 处，涉及 ${touched} 个 .vue 文件`,
)
if (!write) console.log('确认无误后加 --write 实际写入')
