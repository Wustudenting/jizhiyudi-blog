<template>
  <div class="min-h-screen relative">
    <canvas ref="canvas" class="fixed inset-0 z-0"></canvas>
    <NavHeader class="relative z-50" />
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
 */
const PALETTE = {
  light: {
    bg: ['#dbeafe', '#e0e7ff', '#ede9fe'], // 白天：浅蓝 → 浅靛 → 浅紫
    dot: 'rgba(99, 102, 241, 0.6)',
    link: '139, 92, 246', // 粒子之间的连线
    linkMouse: '99, 102, 241', // 鼠标连线
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

const animate = () => {
  const { bg, linkMouse } = palette()

  const gradient = ctx.createLinearGradient(0, 0, canvas.value.width, canvas.value.height)
  gradient.addColorStop(0, bg[0])
  gradient.addColorStop(0.5, bg[1])
  gradient.addColorStop(1, bg[2])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

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
