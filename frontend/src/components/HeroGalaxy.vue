<template>
  <div
    ref="rootEl"
    class="hero-galaxy"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <canvas ref="canvasEl" class="galaxy-canvas"></canvas>

    <!-- 文字标签：字数最多的 5 颗常驻 + 当前 hover 的那颗，位置由 canvas 循环每帧同步 -->
    <div
      v-for="item in labelItems"
      :key="item.id"
      :ref="item.setEl"
      class="galaxy-label"
      :title="item.fullTitle"
      :style="{ color: item.color, textShadow: `0 0 8px ${item.color}80, 0 1px 3px rgba(2,6,23,.9)` }"
    >
      {{ item.title }}
    </div>

    <!-- 空态：不起动画循环，只留一行居中提示 -->
    <div v-if="!articles.length" class="galaxy-empty">暂无文章</div>

    <div v-if="hovered" ref="tipEl" class="galaxy-tooltip" :style="tooltipStyle">
      <div class="galaxy-tooltip__title">
        <i class="galaxy-tooltip__dot" :style="{ background: hovered.color }"></i>
        <span>{{ hovered.title }}</span>
      </div>
      <div v-if="tooltipMeta" class="galaxy-tooltip__meta">{{ tooltipMeta }}</div>
    </div>
  </div>
</template>

<script setup>
/**
 * HeroGalaxy —— 文章星图。
 *
 * 每篇文章 = 一颗星：位置由向日葵螺旋（黄金角）决定，半径看字数，颜色看分类。
 * 这块面板白天/黑夜模式下都是深色星空，是刻意的「星空窗口」效果，所以不跟随主题切换。
 *
 * 配色说明：9 色青蓝系色板只作视觉区分 —— 这里没有图例，分类身份由 tooltip 和
 * 文字标签给出，不靠「颜色 ↔ 分类」的对照阅读，所以色板不做分类编码意义上的校验。
 * 分类名用 FNV-1a 哈希稳定取色：同一分类永远同色，且与文章在数组里的位置无关。
 */
import { ref, shallowRef, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  /** [{ id, title, categoryName, tags: string[], wordCount }] */
  articles: { type: Array, default: () => [] },
})

const router = useRouter()

/** 9 色青蓝系色板：在深空底色上都够亮、够可读 */
const PALETTE = [
  '#22d3ee',
  '#38bdf8',
  '#818cf8',
  '#5eead4',
  '#60a5fa',
  '#a5b4fc',
  '#7dd3fc',
  '#2dd4bf',
  '#93c5fd',
]

/** 黄金角 ≈ 137.5°，斐波那契球面分布的核心常数 */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const TAU = Math.PI * 2
const MAX_LABELS = 5 // 常驻文字标签的数量
const GLOW_SCALE = 3.5 // 光晕半径 = 星半径 * 3.5
const HIT_PADDING = 8 // 命中判定额外放宽的像素，小星也点得中

// ---- 球面投影 ----
const SPHERE_R = 0.42 // 球半径 = min(宽, 高) * 0.42，给容器留边
const CAM_Z = 3 // 相机在 z 轴上的位置，单位是球半径。越小透视越夸张
const AXIAL_TILT = 0.35 // 地轴倾角（约 20°）：不加的话球体轮廓是个正圆，很假
const LABEL_FRONT_MIN = 0.35 // 深度低于此值的星，标签藏起来（字浮在球外会穿帮）

const rootEl = ref(null)
const canvasEl = ref(null)
const tipEl = ref(null)

/** 当前 hover 的星（普通对象，用 shallowRef 避免深层代理） */
const hovered = shallowRef(null)
/** 需要渲染成 DOM 的标签项，只在布局 / hover 变化时重建 */
const labelItems = shallowRef([])
/** 容器 CSS 尺寸，tooltip 翻转要靠它 */
const box = ref({ w: 0, h: 0 })
/** tooltip 的实测尺寸，用于贴边翻转 */
const tipSize = ref({ w: 0, h: 0 })
/** tooltip 跟随鼠标的位置（容器内坐标） */
const tipPos = ref({ x: 0, y: 0 })

// 下面这些都是每帧读写的东西，故意不放响应式：60fps 走 proxy 只会白白变慢
let ctx = null
let dpr = 1
let stars = []
let backdrop = [] // 球面上的背景星尘（装饰，不可点）
let view = { w: 0, h: 0, cx: 0, cy: 0 }
let rotation = 0
let rafId = 0
let startTs = 0
let reducedMotion = false
let resizeObserver = null
/** id -> 标签项，保证 setEl 的函数引用稳定（同一颗星换标题时才重建） */
const labelCache = new Map()

/** FNV-1a：把分类名稳定映射到色板下标，同一分类永远同色，与数组顺序无关 */
const hashToIndex = (str, mod) => {
  let h = 2166136261
  const s = String(str || '')
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % mod
}

/** 色板是 hex（给 CSS 用的），canvas 的径向渐变要 rgba，这里做一次转换 */
const hexToRgba = (hex, alpha) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

/**
 * 用**斐波那契球面**把每颗星铺在球壳上。
 *
 * 和向日葵螺旋是同一个套路（黄金角 + 面积均匀），只是从平面搬到了球面：
 *   y   = 1 - 2(i + 0.5) / n   → 按纬度把球切成 n 条等高的带
 *   r   = √(1 - y²)            → 该纬度圈的半径
 *   θ   = i × 黄金角            → 经度
 * 任意点数都铺得均匀、不结块也不留空洞，同样不需要碰撞检测。
 *
 * 存的是**单位球面坐标**（ux/uy/uz，模长恒为 1），不是屏幕坐标 ——
 * 自转、透视、前后遮挡每帧现算，所以窗口缩放时不用重建星图，只要换个 R。
 */
const buildStars = () => {
  const n = props.articles.length
  const cosT = Math.cos(AXIAL_TILT)
  const sinT = Math.sin(AXIAL_TILT)

  stars = props.articles.map((a, i) => {
    const y = 1 - (2 * (i + 0.5)) / n
    const ringR = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = i * GOLDEN_ANGLE
    const sx0 = ringR * Math.cos(theta)
    const sz0 = ringR * Math.sin(theta)

    // 地轴倾角：绕 x 轴转一次，写死在基准坐标里
    const uy = y * cosT - sz0 * sinT
    const uz = y * sinT + sz0 * cosT

    const wordCount = Number(a.wordCount) || 0
    const tags = Array.isArray(a.tags) ? a.tags : []
    const category = a.categoryName || '未分类'
    return {
      id: a.id,
      title: a.title || '未命名',
      // tooltip / 标签上的副信息：前 3 个标签，没有标签就退回分类名
      meta: tags.length ? tags.slice(0, 3).join(' · ') : category,
      wordCount,
      color: PALETTE[hashToIndex(category, PALETTE.length)],
      radius: 1.6 + Math.min(wordCount / 1400, 1) * 2.2, // 1.6 ~ 3.8px
      ux: sx0,
      uy,
      uz,
      phase: Math.random() * TAU, // 闪烁相位 / 频率：初始化时随机固定，之后不再变
      speed: 0.6 + Math.random() * 0.9,
      sx: 0, // 每帧算出的屏幕坐标（CSS 像素），绘制、命中、标签共用
      sy: 0,
      scale: 1, // 该帧的透视缩放系数，命中半径跟着它走
      front: 1, // 前后程度：1 = 正对镜头，0 = 转到球心最深处
    }
  })
  labelCache.clear()
  hovered.value = null
  buildLabels()
}

/**
 * 球面上的背景星尘。
 *
 * 42 颗文章星铺在一个球面上，正面同时能看到的也就二十来颗 —— 单靠它们，
 * 球看起来是个空壳。真实地球靠贴图提供这层质感，我们没有贴图，就用一圈
 * 又小又暗的点把球面「填实」，让球体读得出来。它们不可点击、不参与命中、
 * 也不进 tooltip，纯装饰。
 *
 * 位置同样用斐波那契球面（点数不同 → 和文章星自然错开），
 * 大小和亮度用 index 的确定性伪随机微扰，保证每次刷新长得一模一样。
 */
const BACKDROP_COUNT = 150

/** sin 散列：给第 i 个点一个稳定的 0~1 伪随机数，不依赖 Math.random，刷新不变 */
const jitter = (i, salt) => {
  const v = Math.sin(i * 12.9898 + salt) * 43758.5453
  return v - Math.floor(v)
}

const makeBackdrop = () => {
  const cosT = Math.cos(AXIAL_TILT)
  const sinT = Math.sin(AXIAL_TILT)
  backdrop = Array.from({ length: BACKDROP_COUNT }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / BACKDROP_COUNT
    const ringR = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = i * GOLDEN_ANGLE
    const sx0 = ringR * Math.cos(theta)
    const sz0 = ringR * Math.sin(theta)
    return {
      ux: sx0,
      uy: y * cosT - sz0 * sinT,
      uz: y * sinT + sz0 * cosT,
      size: 0.5 + jitter(i, 1.7) * 0.7,
      alpha: 0.35 + jitter(i, 9.3) * 0.65,
    }
  })
}

/** 文章标题普遍偏长（「251.注册路径-中间件案例-文件上传-请求参数解析」），
    不截断的话标签会横穿整个星空盘、互相压在一起。完整标题留在 title 属性里。 */
const LABEL_MAX_CHARS = 10
const truncate = (s) => (s.length > LABEL_MAX_CHARS ? `${s.slice(0, LABEL_MAX_CHARS)}…` : s)

/** 取（并缓存）某颗星的标签项，setEl 引用稳定，避免反复触发 ref 解绑 */
const getLabelItem = (star) => {
  const cached = labelCache.get(star.id)
  const title = truncate(star.title)
  if (cached && cached.title === title && cached.color === star.color) return cached
  const item = { id: star.id, title, fullTitle: star.title, color: star.color, star, el: null, w: 0 }
  // 闭包捕获 item 本身（而不是用 this），Vue 调用时才能写回同一个对象
  item.setEl = (el) => {
    item.el = el
  }
  labelCache.set(star.id, item)
  return item
}

/** 常驻标签 = 字数最多的 5 颗；被 hover 的那颗也补一个（已在列表里就不重复） */
const buildLabels = () => {
  const picked = new Map()
  const top = [...stars].sort((a, b) => b.wordCount - a.wordCount).slice(0, MAX_LABELS)
  for (const s of top) picked.set(s.id, s)
  if (hovered.value) picked.set(hovered.value.id, hovered.value)
  labelItems.value = [...picked.values()].map(getLabelItem)
}

const LABEL_H = 15
const LABEL_PAD = 4

/** 把标签摆到星的右下角，贴边时翻到另一侧；再夹进容器、避让已摆好的标签 */
const syncLabels = () => {
  const placed = [] // 已占用的矩形，用来躲重叠

  for (const item of labelItems.value) {
    const el = item.el
    if (!el) continue

    // 转到球背面的标签直接藏掉 —— 文字浮在球外面会穿帮，
    // 而且它本来也「看不见」那颗星。摆位也就跳过，不占 placed 名额。
    if (item.star.front < LABEL_FRONT_MIN) {
      el.style.opacity = '0'
      continue
    }

    const { sx, sy } = item.star
    if (!item.w) item.w = el.offsetWidth // 文字不变，宽度测一次就够

    let x = sx + 7
    let y = sy + 7
    if (x + item.w > view.w - LABEL_PAD) x = sx - 7 - item.w
    if (y + LABEL_H > view.h - LABEL_PAD) y = sy - 7 - LABEL_H

    // 翻面之后仍可能越界（星的 x 很小时 x 会变成负数），必须再夹一次 ——
    // 容器是 overflow:hidden，跑出去的文字会被直接切掉半截。
    x = Math.min(Math.max(LABEL_PAD, x), Math.max(LABEL_PAD, view.w - item.w - LABEL_PAD))
    y = Math.min(Math.max(LABEL_PAD, y), Math.max(LABEL_PAD, view.h - LABEL_H - LABEL_PAD))

    // 撞上已摆好的标签就往下让一行
    const overlaps = (py) =>
      placed.some((p) => !(x + item.w < p.x || p.x + p.w < x || py + LABEL_H < p.y || p.y + LABEL_H < py))

    let tries = 0
    while (tries < 3 && overlaps(y)) {
      y += LABEL_H + 2
      tries++
    }

    // 让不开、或者让出下边界了 —— 直接藏起来。
    // 注意必须**再判一次 overlaps**：只判断越界的话，位置还在界内但依然压着的
    // 标签会被原样摆上去，糊成一团。（漏过这一条，reduced-motion 下实测有 1 对重叠。）
    if (overlaps(y) || y + LABEL_H > view.h - LABEL_PAD) {
      el.style.opacity = '0'
      continue
    }

    el.style.opacity = ''
    placed.push({ x, y, w: item.w })
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
  }
}

/**
 * 标签定位的兜底时机。
 *
 * 平时 syncLabels() 是挂在 draw() 末尾、靠 rAF 每帧跑的。但开启「减少动态效果」时
 * 根本没有 rAF 循环（只有状态变化时的一次性 draw），而 onMounted 里那次
 * nextTick(syncLabels) 又只覆盖第一轮 —— ResizeObserver 首次回调会再走一遍
 * applyLayout()，重建 labelItems，此时 DOM 还没重渲染、item.el 全是 null，
 * 之后再没有任何时机补位，标签就会全部堆在 (0,0)。
 *
 * 所以这里直接盯 labelItems：它一换，就等 DOM 补完 ref 再摆一次。
 * flush: 'post' 保证回调跑在 DOM 更新之后。
 */
watch(labelItems, () => nextTick(syncLabels), { flush: 'post' })

/**
 * 球体本身。星星只是一堆点，光看点阵看不出「球」——立体感全靠下面三层：
 * 一层偏向光源的球面填充、一圈贴着球面的大气辉光、一道很淡的轮廓线。
 * 这三笔都是纯 2D canvas，不需要 WebGL。
 */
const paintGlobe = (cx, cy, R) => {
  // 球面：光从左上打过来，所以高光偏心
  const body = ctx.createRadialGradient(cx - R * 0.34, cy - R * 0.34, 0, cx, cy, R)
  body.addColorStop(0, 'rgba(34, 211, 238, 0.10)')
  body.addColorStop(0.55, 'rgba(14, 116, 144, 0.07)')
  body.addColorStop(1, 'rgba(3, 8, 20, 0.20)')
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, TAU)
  ctx.fill()

  // 大气辉光：内侧透明、贴着球面最亮、外侧再散掉
  const rim = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.16)
  rim.addColorStop(0, 'rgba(56, 189, 248, 0)')
  rim.addColorStop(0.46, 'rgba(56, 189, 248, 0.13)')
  rim.addColorStop(1, 'rgba(56, 189, 248, 0)')
  ctx.fillStyle = rim
  ctx.beginPath()
  ctx.arc(cx, cy, R * 1.16, 0, TAU)
  ctx.fill()

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.16)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, TAU)
  ctx.stroke()
}

/** 画一帧：先算屏幕坐标，再逐颗画光晕 + 实心核心 */
const draw = () => {
  if (!ctx) return
  const { w, h, cx, cy } = view
  ctx.clearRect(0, 0, w, h)
  if (!stars.length) return

  const cosR = Math.cos(rotation)
  const sinR = Math.sin(rotation)
  const t = (performance.now() - startTs) / 1000
  const R = Math.min(w, h) * SPHERE_R

  paintGlobe(cx, cy, R)

  // 背景星尘：和文章星共用同一套自转 + 透视，先铺在底下当球体纹理
  ctx.fillStyle = '#bae6fd'
  for (const b of backdrop) {
    const brx = b.ux * cosR - b.uz * sinR
    const brz = b.ux * sinR + b.uz * cosR
    const k = CAM_Z / (CAM_Z - brz)
    const front = (brz + 1) / 2
    ctx.globalAlpha = b.alpha * (0.12 + 0.88 * front) * 0.75
    ctx.beginPath()
    ctx.arc(cx + brx * R * k, cy - b.uy * R * k, b.size * k, 0, TAU)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // 把球面上每颗星投到屏幕上
  for (const s of stars) {
    // 绕 y 轴自转（cos/sin 每帧只算一次，所有星共用）
    const rx = s.ux * cosR - s.uz * sinR
    const rz = s.ux * sinR + s.uz * cosR
    const ry = s.uy

    // 透视投影：相机在 +z 轴、朝 -z 看。rz 越大离镜头越近，屏幕坐标铺得越开 ——
    // 近大远小是让人一眼认出「这是个球」的最主要线索。
    const k = CAM_Z / (CAM_Z - rz)
    s.sx = cx + rx * R * k
    s.sy = cy - ry * R * k
    s.scale = k
    s.front = (rz + 1) / 2 // 1 = 正对镜头，0 = 转到球心最深处
  }

  // 从后往前画，正面的星自然盖住背面的，遮挡关系才对。
  // 命中的那颗单独挪到最后，保证高亮不被别的星压住。
  const hot = hovered.value
  const order = stars.slice().sort((a, b) => a.front - b.front)
  if (hot) {
    const idx = order.indexOf(hot)
    if (idx >= 0) {
      order.splice(idx, 1)
      order.push(hot)
    }
  }

  for (const s of order) {
    const isHot = s === hot
    // 背面的星又小又淡：s.scale 给近大远小，depthFade 再把远处的压暗。
    // 下限留 0.32 而不是 0 —— 压到全黑的话球背面就只剩一片空，反而看不出是球。
    const depthFade = 0.32 + 0.68 * s.front
    const r = (isHot ? s.radius * 1.4 : s.radius) * s.scale
    const alpha =
      (reducedMotion ? 0.85 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase)) * depthFade
    const glowR = r * (isHot ? GLOW_SCALE * 1.25 : GLOW_SCALE)

    ctx.globalAlpha = 1
    const glow = ctx.createRadialGradient(s.sx, s.sy, 0, s.sx, s.sy, glowR)
    glow.addColorStop(0, hexToRgba(s.color, Math.min(1, alpha * (isHot ? 0.9 : 0.5))))
    glow.addColorStop(0.45, hexToRgba(s.color, Math.min(1, alpha * (isHot ? 0.3 : 0.16))))
    glow.addColorStop(1, hexToRgba(s.color, 0))
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(s.sx, s.sy, glowR, 0, TAU)
    ctx.fill()

    ctx.globalAlpha = alpha
    ctx.fillStyle = s.color
    ctx.beginPath()
    ctx.arc(s.sx, s.sy, r, 0, TAU)
    ctx.fill()

    if (isHot) {
      ctx.globalAlpha = 1
      ctx.strokeStyle = hexToRgba(s.color, 0.9)
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(s.sx, s.sy, r + 3.5, 0, TAU)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  syncLabels()
}

const stopLoop = () => {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

const loop = () => {
  rotation += 0.00055 // 每帧约 0.03°，转一圈要 40 秒左右 —— 慢到不抢注意力
  draw()
  rafId = requestAnimationFrame(loop)
}

const startLoop = () => {
  if (rafId || reducedMotion || !stars.length) return
  startTs = performance.now()
  rafId = requestAnimationFrame(loop)
}

/**
 * 量尺寸 + 重建布局。
 *
 * 位图按 dpr 放大（否则高分屏上 1px 的星会糊），再用 setTransform 把绘制坐标系
 * 拉回 CSS 像素 —— 这样后面所有坐标、半径、命中判定都直接用 CSS px 写，
 * 不用到处 ×dpr，鼠标事件坐标（clientX - rect.left）也能直接比。
 */
const applyLayout = () => {
  const el = rootEl.value
  const canvas = canvasEl.value
  if (!el || !canvas) return

  const rect = el.getBoundingClientRect()
  const w = Math.max(1, Math.round(rect.width))
  const h = Math.max(1, Math.round(rect.height))
  dpr = window.devicePixelRatio || 1

  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`

  ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  view = { w, h, cx: w / 2, cy: h / 2 }
  box.value = { w, h }
  if (!backdrop.length) makeBackdrop() // 纯几何，和尺寸无关，建一次就够
  buildStars()
  draw()

  // 空数据时不空转 rAF；有数据且没开「减少动态效果」才起循环
  if (!stars.length || reducedMotion) stopLoop()
  else startLoop()
}

/**
 * 命中检测：直接拿每颗星的**屏幕坐标**比距离。
 *
 * 上一版是「把鼠标点反向旋转回基准坐标系」，那在平面布局下很省事。换成球面之后行不通了：
 * 透视投影（近大远小）+ 地轴倾角 + 前后遮挡，反变换要还原的东西比正向算还多。
 * 既然 draw() 每帧已经把 sx / sy / front 算好了，直接扫一遍最省事也最不容易错。
 */
const pickStar = (clientX, clientY) => {
  const el = rootEl.value
  if (!el || !stars.length) return null
  const rect = el.getBoundingClientRect()
  const x = clientX - rect.left
  const y = clientY - rect.top

  let best = null
  let bestFront = -Infinity
  for (const s of stars) {
    // 命中半径跟着透视缩放走，远处的星热区也跟着小
    if (Math.hypot(s.sx - x, s.sy - y) > s.radius * s.scale + HIT_PADDING) continue
    // 重叠时选靠前的那颗，否则点在正面星星上可能选中它背后那颗
    if (s.front > bestFront) {
      best = s
      bestFront = s.front
    }
  }
  return best
}

const onMouseMove = (e) => {
  const el = rootEl.value
  if (!el || !stars.length) return
  const hit = pickStar(e.clientX, e.clientY)
  el.style.cursor = hit ? 'pointer' : 'default'

  if (hit) {
    const rect = el.getBoundingClientRect()
    tipPos.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  if (hovered.value !== hit) {
    hovered.value = hit
    buildLabels()
    if (reducedMotion) draw() // 静态模式没有 rAF，状态变化得自己补画
    nextTick(syncLabels)
  }
}

const onMouseLeave = () => {
  if (rootEl.value) rootEl.value.style.cursor = 'default'
  if (!hovered.value) return
  hovered.value = null
  buildLabels()
  if (reducedMotion) draw()
  nextTick(syncLabels)
}

const onClick = (e) => {
  const hit = pickStar(e.clientX, e.clientY)
  if (hit) router.push(`/articles/${hit.id}`)
}

const tooltipMeta = computed(() => (hovered.value ? hovered.value.meta : ''))

/** tooltip 跟随鼠标；贴近右 / 下边缘时翻到鼠标另一侧，避免溢出容器 */
const tooltipStyle = computed(() => {
  if (!hovered.value) return {}
  const pad = 12
  const { w, h } = box.value
  const { w: tw, h: th } = tipSize.value
  const { x: mx, y: my } = tipPos.value
  let x = mx + 14
  let y = my + 14
  if (tw && x + tw + pad > w) x = mx - tw - 14
  if (th && y + th + pad > h) y = my - th - 14
  return { transform: `translate(${Math.max(pad, x)}px, ${Math.max(pad, y)}px)` }
})

// tooltip 内容变了要重新量一次尺寸，翻转才准
watch(hovered, async () => {
  await nextTick()
  if (tipEl.value) tipSize.value = { w: tipEl.value.offsetWidth, h: tipEl.value.offsetHeight }
})

// 文章列表变化（异步加载完成 / 筛选）→ 重新布局星点
watch(
  () => props.articles,
  () => applyLayout(),
  { deep: true },
)

onMounted(() => {
  // 只读一次：不监听系统设置的变化，省掉一个常驻监听器
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  applyLayout()

  // 观察根元素而不是 canvas：canvas 是绝对定位的，改它的尺寸不会反过来触发 RO
  resizeObserver = new ResizeObserver(applyLayout)
  resizeObserver.observe(rootEl.value)

  nextTick(syncLabels) // 标签元素这时才挂进 DOM，补一次定位
})

onUnmounted(() => {
  stopLoop()
  resizeObserver?.disconnect()
  resizeObserver = null
  labelCache.clear()
  stars = []
  // mousemove / mouseleave / click 走的是模板绑定，Vue 卸载时会自己摘掉，不留监听器
})
</script>

<style scoped>
/* 深色星空底色：白天/黑夜模式共用，刻意做成一块「星空窗口」 */
.hero-galaxy {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(at 24% 22%, #3882be38, #0000 42%),
    radial-gradient(at 78% 80%, #0e749029, #0000 46%),
    linear-gradient(160deg, #071226 0%, #050b1a 55%, #030814 100%);
}

.galaxy-canvas {
  position: absolute;
  inset: 0;
  display: block;
}

.galaxy-label {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 11px;
  line-height: 15px;
  white-space: nowrap;
  letter-spacing: 0.01em;
  pointer-events: none;
  will-change: transform;
}

.galaxy-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  letter-spacing: 0.12em;
  color: rgba(148, 163, 184, 0.65);
}

.galaxy-tooltip {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  max-width: 220px;
  padding: 7px 10px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.45);
  pointer-events: none;
  will-change: transform;
}

.galaxy-tooltip__title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 17px;
  color: #e2e8f0;
}

.galaxy-tooltip__dot {
  flex: none;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.galaxy-tooltip__meta {
  margin-top: 3px;
  font-size: 11px;
  line-height: 15px;
  color: #94a3b8;
}
</style>
