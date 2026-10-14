<template>
  <div
    ref="rootEl"
    class="hero-galaxy"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @click="onClick"
  >
    <canvas ref="canvasEl" class="galaxy-canvas"></canvas>

    <!--
      文字标签：每篇文章一个，绝对定位的圆角徽章。
      位置和透明度每帧由「星星相对镜头的正面程度」驱动 —— 见 syncLabels()。
    -->
    <div
      v-for="item in labelItems"
      :key="item.id"
      :ref="item.setEl"
      class="galaxy-label"
      :title="item.fullTitle"
    >
      {{ item.title }}
    </div>

    <div v-if="!articles.length" class="galaxy-overlay">暂无文章</div>
    <div v-else-if="webglFailed" class="galaxy-overlay galaxy-overlay--warn">
      浏览器未启用硬件加速，3D 地球无法渲染
    </div>

    <div v-if="hovered" ref="tipEl" class="galaxy-tooltip" :style="tooltipStyle">
      <div class="galaxy-tooltip__title">
        <i class="galaxy-tooltip__dot" :style="{ background: hovered.color }"></i>
        <span>{{ hovered.label }}</span>
      </div>
      <div v-if="tooltipMeta" class="galaxy-tooltip__meta">{{ tooltipMeta }}</div>
      <!-- 标签取的是 summary，这里补上语雀里的原始文档名，方便对回是哪一篇 -->
      <div v-if="hovered.docTitle" class="galaxy-tooltip__doc">语雀文档名：{{ hovered.docTitle }}</div>
    </div>
  </div>
</template>

<script setup>
/**
 * HeroGalaxy —— 首页那颗会自转的关注地球。
 *
 * 用 three.js 做一个真实贴图的三维地球（贴着球面飞的文章星点），
 * 结构照搬参考站：昼夜贴图 + 法线贴图 + 高光贴图 + 云层 + 大气辉光 shader。
 *
 * 和参考站的两处不同：
 *   1. 云层用**加法混合 + 灰度图**，不是带 alpha 的 PNG —— 带 alpha 的 WebP
 *      压不动（实测 quality 从 45 调到 60 体积纹丝不动，走了无损），
 *      灰度 + AdditiveBlending 一张 JPEG 就够，85KB 顶掉 210KB。
 *   2. 单独处理 WebGL 起不来的情况：没开硬件加速的访客要看到一句人话，
 *      而不是一块黑屏（参考站就是黑屏的，用户自己踩过）。
 *
 * 这篇文章星点的「正面程度」驱动标签淡入淡出，那套阈值是实测调出来的：
 * 均匀球面上 z 分量均匀分布 → front = (z+1)/2 也均匀 → 可见比例 = 1 - 阈值。
 */
import { ref, shallowRef, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  Mesh,
  Sprite,
  SpriteMaterial,
  SphereGeometry,
  MeshPhongMaterial,
  ShaderMaterial,
  CanvasTexture,
  Color,
  Vector2,
  Vector3,
  AdditiveBlending,
  BackSide,
  DirectionalLight,
  AmbientLight,
  TextureLoader,
  SRGBColorSpace,
} from 'three'

const props = defineProps({
  /** [{ id, title, summary, categoryName, tags: string[], wordCount }] */
  articles: { type: Array, default: () => [] },
})

/**
 * 标签上显示什么文字。
 *
 * 语雀里的文档名有 36/42 是纯编号（「1.day1」「2.day2」），直接当标签等于没信息；
 * 这种就改用 summary（文档的首个标题）顶上，并把开头的「第X章.」「1.」剥掉，
 * 让「第一章.MySQL的常用函数」变成「MySQL的常用函数」。
 *
 * 标题本身有信息量的（「252.express路由系统-静态资源部署-koa和中间件」
 * 「小程序八股」）**保持原标题** —— 那些的 summary 往往只是其中一个知识点
 * （「express路由系统的使用」），换过去反而丢信息。
 */
const BARE_TITLE = /^\d+\s*\.\s*(day\s*\d*)?\s*$/i

/** summary 太长的多半是正文首段连写，不是小标题 */
const MAX_SUMMARY_LABEL = 20
/** 带句读的也不是标题 */
const SENTENCE_PUNCT = /[。，！？；]/

/** 剥掉开头的「第X章.」「1.」 */
const stripSectionPrefix = (s) =>
  String(s || '')
    .replace(/^第\s*[一二三四五六七八九十百零\d]+\s*[章节篇]\s*[.、：:·-]?\s*/, '')
    .replace(/^\d+\s*[.、：:]\s*/, '')

/**
 * summary 通常是「标题1标题2标题3」连写的（「安装第三方库1.标准库介绍2.引入第三方库」），
 * 只取第一段就够当标签了。
 */
const firstSegment = (s) =>
  String(s || '')
    .split(/第\s*[一二三四五六七八九十百零\d]+\s*[章节篇]/)[0]
    .split(/\d+\s*[.、：:]/)[0]
    .trim()

const labelTextOf = (title, summary) => {
  const t = String(title || '').trim()
  if (!BARE_TITLE.test(t)) return t

  const s = firstSegment(stripSectionPrefix(summary))
  // 太长或带句读的，说明 summary 存的是正文首段而不是小标题 ——
  // 与其把半句话截出来当标签（「这个是我们依赖的核…」），不如老实退回文档名。
  // 实测这样能挡掉「React+Ts基础环境创建我们要创建一个…」这类连写。
  if (!s || s.length > MAX_SUMMARY_LABEL || SENTENCE_PUNCT.test(s)) return t
  return s
}

const router = useRouter()

const rootEl = ref(null)
const canvasEl = ref(null)
const tipEl = ref(null)

/** 9 色青蓝系色板，在深空底上都够亮 */
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

// ---- 场景尺度 ----
const GLOBE_R = 7 // 地球半径
const STAR_R = GLOBE_R * 1.017 // 星点贴在地表外侧一点点，避免被球面 z-fighting 吃掉
const ATMO_R = GLOBE_R * 1.136 // 大气层
const CAM_Z = 27 // 相机距离：这个值 + fov 一起决定地球在面板里占多大。约留三成余量
const FOV = 45
const SPIN = 0.13 // 自转角速度（弧度/秒），约 48 秒一圈

/**
 * 系统开了「减少动态效果」时的速度倍数。
 *
 * 这里**不是停转，而是降到三成** —— 参考站就是这么处理的（它的循环里写的是
 * `t = reduce ? .3 : 1`，然后 `rotation.y += .0022 * t`）。
 * 之前我按「完全冻结」实现，结果开了这个系统设置的访客看到的是地球一动不动，
 * 和参考站对不上。低频、缓慢的连续自转不属于该设置要防的那类动效
 * （它主要防视差、大幅位移、高频闪烁），所以跟着参考站降速是合理的。
 */
const SPIN_REDUCED = 0.3

// 标签可见性：低于 MIN 不给标签，到 FULL 完全不透明，中间线性淡入淡出。
//
// front 取的是世界坐标归一化后的 z，落在 [-1, 1] 且**均匀分布**，
// 所以「同时可见比例 = (1 - MIN) / 2」。想要两成左右就是 MIN = 0.60。
// （从手写 canvas 版搬过来时这里是 0.80 —— 那版 front 是 (z+1)/2 落在 [0,1]，
//   刻度和这边差一倍，直接照搬会只剩一成的标签。）
const LABEL_FRONT_MIN = 0.6
const LABEL_FRONT_FULL = 0.84
const LABEL_FADE = 0.08 // 每帧朝目标透明度逼近的比例
const LABEL_PAD = 4
const LABEL_H = 20

const hovered = shallowRef(null)
const labelItems = shallowRef([])
const box = ref({ w: 0, h: 0 })
const tipSize = ref({ w: 0, h: 0 })
const tipPos = ref({ x: 0, y: 0 })
const webglFailed = ref(false)

// 每帧读写的东西一律不放响应式
let renderer = null
let camera = null
let scene = null
let earthGroup = null
let rafId = 0
let lastTs = 0
let reducedMotion = false
let resizeObserver = null
let stars = []
let starMeshes = []
const labelCache = new Map()
const disposables = [] // 卸载时要 dispose 的几何/材质/贴图

/** FNV-1a：分类名 → 色板下标，同一分类永远同色，与数组顺序无关 */
const hashToIndex = (str, mod) => {
  let h = 2166136261
  const s = String(str || '')
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % mod
}

/** 径向渐变的小光点贴图（白的，上色交给 sprite 的 color） */
const makeGlowTexture = (size = 128) => {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const r = size / 2
  const grad = g.createRadialGradient(r, r, 0, r, r, r)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.75)')
  grad.addColorStop(0.55, 'rgba(255,255,255,0.18)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  disposables.push(tex)
  return tex
}

const makeStarMaterial = (glowTex, color) => {
  const mat = new SpriteMaterial({
    map: glowTex,
    color: new Color(color),
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  })
  disposables.push(mat)
  return mat
}

/**
 * 注意是 TextureLoader 而不是 ImageLoader —— 后者回调给的是裸的
 * HTMLImageElement，塞进 material.map 里 three 会去读 map.matrix 然后炸在
 * Matrix3.copy 上，报错长得完全不像「加载器用错了」。踩过一次。
 */
const textureLoader = new TextureLoader()

const loadTexture = (url) =>
  new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (tex) => {
        tex.colorSpace = SRGBColorSpace
        disposables.push(tex)
        resolve(tex)
      },
      undefined,
      reject,
    )
  })

/** 大气辉光：越靠球的边缘越亮，正面最弱 —— 参考站用的就是这个公式 */
const makeAtmosphere = () => {
  const geo = new SphereGeometry(ATMO_R, 64, 64)
  const mat = new ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.58 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.72, 1.0, 1.0) * intensity;
      }
    `,
    blending: AdditiveBlending,
    side: BackSide,
    transparent: true,
    depthWrite: false,
  })
  disposables.push(geo, mat)
  return new Mesh(geo, mat)
}

const buildEarth = async () => {
  earthGroup = new Group()
  // 地轴倾角：不加的话地球看着像被立正了，很假
  earthGroup.rotation.z = 0.41
  scene.add(earthGroup)

  // 贴图是本地静态资源（public/textures/），已从 2048 压到 1024。
  // 加载失败不该让整块面板炸掉 —— 退化成没有贴图的暗球，星点照常。
  let day = null
  let normal = null
  let specular = null
  let clouds = null
  try {
    ;[day, normal, specular, clouds] = await Promise.all([
      loadTexture('/textures/earth-day.jpg'),
      loadTexture('/textures/earth-normal.jpg'),
      loadTexture('/textures/earth-specular.jpg'),
      loadTexture('/textures/earth-clouds.jpg'),
    ])
  } catch (err) {
    console.warn('[HeroGalaxy] 地球贴图加载失败，退化成素球：', err.message)
  }

  const globeGeo = new SphereGeometry(GLOBE_R, 96, 96)
  const globeMat = new MeshPhongMaterial({
    map: day,
    normalMap: normal,
    normalScale: new Vector2(0.85, 0.85),
    specularMap: specular,
    specular: new Color(0x2e4457),
    shininess: 6,
    color: day ? 0xffffff : 0x1b2f4a,
  })
  disposables.push(globeGeo, globeMat)
  earthGroup.add(new Mesh(globeGeo, globeMat))

  if (clouds) {
    const cloudGeo = new SphereGeometry(GLOBE_R * 1.009, 64, 64)
    // 加法混合的云层不能给太亮：它是「往地表上加白」，给到 0.5 以上
    // 整颗球会糊成灰蒙蒙一团，大陆和海的颜色都被洗掉
    const cloudMat = new MeshPhongMaterial({
      map: clouds,
      blending: AdditiveBlending,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    })
    disposables.push(cloudGeo, cloudMat)
    earthGroup.add(new Mesh(cloudGeo, cloudMat))
  }

  earthGroup.add(makeAtmosphere())
}

/**
 * 文章星点：斐波那契球面铺在球壳上。
 * 和平面螺旋同源（黄金角 + 面积均匀），只是搬到了球面，任意点数都不结块。
 */
const buildStars = () => {
  starMeshes.forEach((m) => earthGroup.remove(m))
  starMeshes = []
  stars = []

  const glow = makeGlowTexture()
  const n = props.articles.length
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const matCache = new Map()

  props.articles.forEach((a, i) => {
    const y = 1 - (2 * (i + 0.5)) / n
    const ringR = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = i * goldenAngle

    const wordCount = Number(a.wordCount) || 0
    const tags = Array.isArray(a.tags) ? a.tags : []
    const category = a.categoryName || '未分类'
    const rawTitle = a.title || '未命名'
    const label = labelTextOf(rawTitle, a.summary)
    const color = PALETTE[hashToIndex(category, PALETTE.length)]
    // 基础尺寸看篇幅，再叠一点微扰，免得大星挤在一起时看着像复制粘贴
    const baseScale = 0.5 + Math.min(wordCount / 1400, 1) * 0.9 + (i % 5) * 0.06

    if (!matCache.has(color)) matCache.set(color, makeStarMaterial(glow, color))
    const sprite = new Sprite(matCache.get(color))
    sprite.position.set(STAR_R * ringR * Math.cos(theta), STAR_R * y, STAR_R * ringR * Math.sin(theta))
    sprite.scale.setScalar(baseScale)
    earthGroup.add(sprite)
    starMeshes.push(sprite)

    stars.push({
      id: a.id,
      title: rawTitle,
      label,
      // 标签取的是 summary 时，把原始文档名也留着，tooltip 里给出来方便对回语雀
      docTitle: label === rawTitle ? '' : rawTitle,
      meta: tags.length ? tags.slice(0, 3).join(' · ') : category,
      color,
      sprite,
      baseScale,
      phase: Math.random() * Math.PI * 2,
      // 每帧算出来的：屏幕坐标 + 正面程度，标签和命中检测共用
      sx: 0,
      sy: 0,
      front: 1,
      screenR: 6,
    })
  })

  labelCache.clear()
  hovered.value = null
  buildLabels()
}

/** 标签文字偏长就截断；完整内容留在 title 属性里 */
const LABEL_MAX_CHARS = 10
const truncate = (s) => (s.length > LABEL_MAX_CHARS ? `${s.slice(0, LABEL_MAX_CHARS)}…` : s)

const getLabelItem = (star) => {
  const cached = labelCache.get(star.id)
  const title = truncate(star.label)
  if (cached && cached.title === title && cached.color === star.color) return cached
  const item = {
    id: star.id,
    title,
    fullTitle: star.label,
    color: star.color,
    star,
    el: null,
    w: 0,
    opacity: 0,
    x: undefined, // 转到背面后要留在原地淡出，不能跳回原点
    y: undefined,
  }
  item.setEl = (el) => {
    item.el = el
  }
  labelCache.set(star.id, item)
  return item
}

/** 每篇文章一个标签；「该显示谁」每帧由深度现算，不是固定一批 */
const buildLabels = () => {
  labelItems.value = stars.map(getLabelItem)
}

// ---- 临时向量：每帧复用，避免 60fps 下疯狂分配对象触发 GC ----
const _world = new Vector3()
const _proj = new Vector3()

/**
 * 每帧把星点投到屏幕上，并算出「正面程度」。
 *
 * 正面程度 = 星点方向 · 相机方向（都归一化后的点积）：
 * 1 = 正对镜头，0 = 转到球心最深处，<0 表示在背面。
 * 这和参考站 ge() 里算的是同一个量，只是那边叫 c。
 */
const projectStars = () => {
  const { w, h } = box.value

  for (const s of stars) {
    _world.copy(s.sprite.position).applyMatrix4(earthGroup.matrixWorld)

    // 相机在 +z 轴上看向原点，所以「相机方向」就是 (0,0,1)；
    // 星点世界坐标归一化后的 z 分量，就等于和相机方向做点积，省一步运算。
    // 结果落在 [-1, 1]：+1 = 正对镜头，-1 = 转到球心最深处。
    // 这里手写除范数而不是 clone().normalize()：后者每帧每颗星都要新分配一个
    // Vector3，42 颗星 × 60fps 就是每秒两千多次分配，白白喂给 GC。
    s.front = _world.z / (_world.length() || 1)

    _proj.copy(_world).project(camera)
    s.sx = (_proj.x * 0.5 + 0.5) * w
    s.sy = (-_proj.y * 0.5 + 0.5) * h

    // 星点在世界里的实际像素半径：用来做命中热区
    const worldPerPixel = (2 * Math.tan((FOV * Math.PI) / 360) * CAM_Z) / h
    s.screenR = Math.max(5, (s.baseScale * s.sprite.scale.x * 1.6) / worldPerPixel)
  }
}

/**
 * 摆标签 + 算透明度。
 *
 * 两种「消失」共用同一条平滑通道（item.opacity 每帧朝目标逼近）：
 *   1. 转到背面 —— 目标透明度随深度连续衰减，所以是化掉，不是闪没
 *   2. 和别人撞了 —— 让位，但同样走淡出
 * 直接写 style.opacity 会随自转频繁跳变，看着毛躁。
 */
const syncLabels = () => {
  const placed = []
  const targets = new Map()

  const visible = labelItems.value
    .filter((it) => it.el && it.star.front >= LABEL_FRONT_MIN)
    .sort((a, b) => b.star.front - a.star.front)

  for (const item of visible) {
    const { sx, sy, front } = item.star
    if (!item.w) item.w = item.el.offsetWidth

    let x = sx + 8
    let y = sy - LABEL_H / 2
    if (x + item.w > box.value.w - LABEL_PAD) x = sx - 8 - item.w
    x = Math.min(Math.max(LABEL_PAD, x), Math.max(LABEL_PAD, box.value.w - item.w - LABEL_PAD))
    y = Math.min(Math.max(LABEL_PAD, y), Math.max(LABEL_PAD, box.value.h - LABEL_H - LABEL_PAD))

    const hit = placed.some(
      (p) => !(x + item.w < p.x || p.x + p.w < x || y + LABEL_H < p.y || p.y + LABEL_H < y),
    )
    if (!hit) placed.push({ x, y, w: item.w })

    item.x = x
    item.y = y
    targets.set(item, hit ? 0 : (front - LABEL_FRONT_MIN) / (LABEL_FRONT_FULL - LABEL_FRONT_MIN))
  }

  for (const item of labelItems.value) {
    const el = item.el
    if (!el) continue
    const target = Math.min(1, Math.max(0, targets.get(item) ?? 0))
    // 减弱动态效果时动画循环跑得很慢，一帧定生死，得直接到位
    item.opacity = reducedMotion ? target : item.opacity + (target - item.opacity) * LABEL_FADE
    if (item.x !== undefined) {
      el.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0)`
    }
    el.style.opacity = item.opacity < 0.02 ? '0' : String(item.opacity)
  }
}

const tick = (ts) => {
  rafId = requestAnimationFrame(tick)
  if (!renderer || !camera) return

  const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0
  lastTs = ts
  // 「减少动态效果」只降速，不停 —— 自转、浮动、闪烁一起按同一个倍数放慢
  const speed = reducedMotion ? SPIN_REDUCED : 1
  const t = (ts / 1000) * speed

  earthGroup.rotation.y += SPIN * speed * dt
  // 缓慢上下浮动，免得像贴纸一样死板
  earthGroup.position.y = Math.sin((t * SPIN) / 0.22) * 0.35

  // 星点闪烁：每颗相位不同，幅度小，别抢注意力
  for (const s of stars) {
    const twinkle = 0.82 + 0.3 * Math.abs(Math.sin(t * 1.6 + s.phase))
    const target = hovered.value === s ? s.baseScale * 2 : s.baseScale * twinkle
    const now = s.sprite.scale.x
    s.sprite.scale.setScalar(now + (target - now) * 0.14)
  }

  renderer.render(scene, camera)
  projectStars()
  syncLabels()
}

const pickStar = (clientX, clientY) => {
  const el = rootEl.value
  if (!el || !stars.length) return null
  const rect = el.getBoundingClientRect()
  const x = clientX - rect.left
  const y = clientY - rect.top

  let best = null
  let bestFront = -Infinity
  for (const s of stars) {
    if (Math.hypot(s.sx - x, s.sy - y) > s.screenR + 8) continue
    // 重叠时选靠前的，否则点在正面星星上可能选中它背后那颗
    if (s.front > bestFront) {
      best = s
      bestFront = s.front
    }
  }
  return best
}

const onMouseMove = (e) => {
  const el = rootEl.value
  if (!el) return
  const hit = pickStar(e.clientX, e.clientY)
  el.style.cursor = hit ? 'pointer' : 'default'
  if (hit) {
    const rect = el.getBoundingClientRect()
    tipPos.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  hovered.value = hit
}

const onMouseLeave = () => {
  if (rootEl.value) rootEl.value.style.cursor = 'default'
  hovered.value = null
}

const onClick = (e) => {
  const hit = pickStar(e.clientX, e.clientY)
  if (hit) router.push(`/articles/${hit.id}`)
}

const tooltipMeta = computed(() => (hovered.value ? hovered.value.meta : ''))

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

watch(hovered, async () => {
  await nextTick()
  if (tipEl.value) tipSize.value = { w: tipEl.value.offsetWidth, h: tipEl.value.offsetHeight }
})

// labelItems 一换，DOM 要重渲染、ref 才绑得上；
// 减弱动态效果时动画循环很慢，这是唯一稳定的补位时机
watch(labelItems, () => nextTick(syncLabels), { flush: 'post' })

watch(
  () => props.articles,
  () => {
    if (!earthGroup) return
    buildStars()
  },
  { deep: true },
)

const resize = () => {
  const el = rootEl.value
  if (!el || !renderer || !camera) return
  const rect = el.getBoundingClientRect()
  const w = Math.max(1, Math.round(rect.width))
  const h = Math.max(1, Math.round(rect.height))
  box.value = { w, h }
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
}

onMounted(async () => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // WebGL 起不来就直接告诉用户，别留一块黑屏（没开硬件加速的机器很常见）
  try {
    renderer = new WebGLRenderer({
      canvas: canvasEl.value,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
  } catch (err) {
    console.warn('[HeroGalaxy] WebGL 不可用：', err.message)
    webglFailed.value = true
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

  scene = new Scene()

  camera = new PerspectiveCamera(FOV, 1, 0.1, 400)
  camera.position.set(0, 0, CAM_Z)

  // 光从左上偏前来：海洋的高光、大陆的明暗都靠它。
  // 环境光压得很低（0.3）—— 调高了整颗球会被照平，昼夜分界和体积感全没了。
  const key = new DirectionalLight(0xffffff, 2.6)
  key.position.set(-1, 0.65, 1.15)
  scene.add(key)
  scene.add(new AmbientLight(0xffffff, 0.3))

  await buildEarth()
  buildStars()
  resize()

  // 循环总是要起：减少动态效果只是把它放慢（见 SPIN_REDUCED），不是停
  rafId = requestAnimationFrame(tick)

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(rootEl.value)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
  resizeObserver?.disconnect()
  resizeObserver = null
  labelCache.clear()
  stars = []
  starMeshes = []
  // three 的对象不吃 GC，显式释放显存（几何、材质、贴图、renderer）
  for (const d of disposables) d.dispose?.()
  disposables.length = 0
  renderer?.dispose()
  renderer = null
  scene = null
  camera = null
  earthGroup = null
})
</script>

<style scoped>
/* 深空底色：白天/黑夜模式共用，刻意做成一块「星空窗口」 */
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
  width: 100%;
  height: 100%;
}

/* 标签做成圆角徽章（参考站就是这个样式），比纯文字在星空上清楚得多 */
.galaxy-label {
  position: absolute;
  left: 0;
  top: 0;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid rgba(125, 211, 252, 0.32);
  background: rgba(8, 20, 40, 0.72);
  color: #e0f2fe;
  font-size: 11px;
  line-height: 14px;
  white-space: nowrap;
  pointer-events: none;
  /* 这里**不要**挂 will-change —— 每篇文章都有一个标签元素，
     逐个挂等于要求浏览器提升几十个合成层，多数浏览器直接忽略、白吃内存 */
  transition: opacity 0.12s linear;
}

/* 开了「减少动态效果」就别再补淡入淡出 —— 那正是用户想关掉的东西 */
@media (prefers-reduced-motion: reduce) {
  .galaxy-label {
    transition: none;
  }
}

.galaxy-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.12em;
  color: rgba(148, 163, 184, 0.72);
}

.galaxy-overlay--warn {
  color: rgba(251, 191, 36, 0.85);
  letter-spacing: 0.04em;
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
  margin-top: 4px;
  font-size: 11px;
  line-height: 15px;
  color: #94a3b8;
  word-break: break-all;
}

/* 原始文档名：比副信息再淡一档，它只是用来对回语雀的 */
.galaxy-tooltip__doc {
  margin-top: 2px;
  font-size: 10px;
  line-height: 14px;
  color: #64748b;
  word-break: break-all;
}
</style>
