<template>
  <div class="min-h-screen relative">
    <canvas ref="canvas" class="fixed inset-0 z-0"></canvas>
    <!--
      这里**不要**加 `relative`。NavHeader 的根元素本身是 `fixed top-0 …`，
      而 Tailwind 的 `.relative` 在产物 CSS 里排在 `.fixed` 之后，会把它顶掉 ——
      导航会跟着页面一起滚走（原来的 `relative z-50` 就是这么写的，一直有这个 bug）。
      `z-50` 单独加就够了：position:fixed 本身就能承载 z-index。
    -->
    <NavHeader class="z-50" />
    <main class="container mx-auto px-4 py-8 relative z-10">
      <router-view :key="$route.fullPath" />
    </main>
    <Footer class="relative z-10" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NavHeader from './components/NavHeader.vue'
import Footer from './components/Footer.vue'
import { useTheme } from './composables/useTheme'

const { theme } = useTheme()

const canvas = ref(null)
let animationId = null
let particles = []
let mouse = { x: null, y: null }
let ctx = null

/**
 * 两套配色。canvas 是逐帧重绘的，所以主题一变下一帧就跟着变，
 * 不需要额外的重绘逻辑 —— 只在每帧读一次 theme.value 即可。
 *
 * ⚠️ dark 这一套是「原始配色」，改动白天时不要碰它。
 */
const PALETTE = {
  light: {
    // 白天：对齐 velpro 的「淡青白平铺 + 两处青色径向光晕」。
    // 它不是一个三档线性渐变，所以这里用 mode 标出绘制形态，
    // 真正的铺底逻辑见 paintBackground()。
    mode: 'glow',
    bg: '#f3f8fb',
    glow: [
      // 对应 velpro 的 radial-gradient(circle at top, #0891b224, transparent 28%)
      { x: 0.5, y: 0, radius: 0.46, color: 'rgba(8, 145, 178, 0.14)' },
      // 对应 radial-gradient(circle at 80% 18%, #0ea5e91a, transparent 22%)
      { x: 0.8, y: 0.18, radius: 0.36, color: 'rgba(14, 165, 233, 0.1)' },
    ],
    dot: 'rgba(8, 145, 178, 0.55)',
    link: '8, 145, 178', // 粒子之间的连线
    linkMouse: '14, 165, 233', // 鼠标连线
  },
  dark: {
    bg: ['#0b1220', '#111a2e', '#1a1430'], // 黑夜：深海军蓝 → 深靛
    dot: 'rgba(129, 140, 248, 0.7)',
    link: '129, 140, 248',
    linkMouse: '165, 180, 252',
  },
}

const palette = () => PALETTE[theme.value] || PALETTE.light

class Particle {
  constructor() {
    this.x = Math.random() * canvas.value.width
    this.y = Math.random() * canvas.value.height
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.radius = Math.random() * 2 + 1
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > canvas.value.width) this.vx *= -1
    if (this.y < 0 || this.y > canvas.value.height) this.vy *= -1

    if (mouse.x !== null) {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 200) {
        const force = (200 - dist) / 200
        this.x -= (dx / dist) * force * 2
        this.y -= (dy / dist) * force * 2
      }
    }
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = palette().dot
    ctx.fill()
  }
}

const initParticles = () => {
  particles = []
  const count = Math.floor((canvas.value.width * canvas.value.height) / 8000)
  for (let i = 0; i < count; i++) {
    particles.push(new Particle())
  }
}

const drawLines = () => {
  const { link } = palette()
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 150) {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(${link}, ${0.15 * (1 - dist / 150)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }
}

/**
 * 铺底。两种形态：
 *  - 'glow'（白天）：平铺底色 + 若干径向光晕，复刻 velpro 的 body 背景
 *  - 默认（黑夜）：原来的三档线性渐变，逻辑与改造前完全一致
 */
const paintBackground = () => {
  const p = palette()
  const { width: w, height: h } = canvas.value

  if (p.mode === 'glow') {
    ctx.fillStyle = p.bg
    ctx.fillRect(0, 0, w, h)

    for (const g of p.glow) {
      const radius = Math.hypot(w, h) * g.radius
      const x = w * g.x
      const y = h * g.y
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
      grad.addColorStop(0, g.color)
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    }
    return
  }

  const gradient = ctx.createLinearGradient(0, 0, w, h)
  gradient.addColorStop(0, p.bg[0])
  gradient.addColorStop(0.5, p.bg[1])
  gradient.addColorStop(1, p.bg[2])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)
}

const animate = () => {
  const { linkMouse } = palette()

  paintBackground()

  particles.forEach(p => {
    p.update()
    p.draw()
  })

  drawLines()

  if (mouse.x !== null) {
    particles.forEach(p => {
      const dx = mouse.x - p.x
      const dy = mouse.y - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 200) {
        ctx.beginPath()
        ctx.moveTo(mouse.x, mouse.y)
        ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = `rgba(${linkMouse}, ${0.4 * (1 - dist / 200)})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })
  }

  animationId = requestAnimationFrame(animate)
}

const handleMouseMove = (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

const handleMouseLeave = () => {
  mouse.x = null
  mouse.y = null
}

const handleResize = () => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initParticles()
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initParticles()
  animate()

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
canvas {
  display: block;
}
</style>
