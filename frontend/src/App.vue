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

const canvas = ref(null)
let animationId = null
let particles = []
let fishes = []
let mouse = { x: null, y: null }
let ctx = null

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
    ctx.fillStyle = 'rgba(99, 102, 241, 0.6)'
    ctx.fill()
  }
}

class Fish {
  constructor() {
    this.x = Math.random() * canvas.value.width
    this.y = Math.random() * canvas.value.height
    this.size = Math.random() * 20 + 25
    this.speed = Math.random() * 0.4 + 0.2
    this.direction = Math.random() * Math.PI * 2
    this.tailPhase = Math.random() * Math.PI * 2
    this.tailSpeed = Math.random() * 0.15 + 0.05
    this.fishType = Math.floor(Math.random() * 4)
    this.color = this.getRandomColor()
    this.opacity = Math.random() * 0.4 + 0.5
    this.changeDirectionTimer = 0
    this.bubbles = []
    this.lastBubbleTime = Math.random() * 100
  }

  getRandomColor() {
    const palettes = [
      { body: '#FF6B9D', fin: '#FFB3C6', belly: '#FFE0E6' },
      { body: '#54A0FF', fin: '#82C5FF', belly: '#D6EAFF' },
      { body: '#5F27CD', fin: '#8C7AE6', belly: '#C8B6E2' },
      { body: '#00D2D3', fin: '#48DBFB', belly: '#CAF9FA' },
      { body: '#FECA57', fin: '#FFD966', belly: '#FFF3BF' },
      { body: '#FF6B81', fin: '#FF8FA3', belly: '#FFD6DF' },
      { body: '#1DD1A1', fin: '#55EFC4', belly: '#C7F9E4' },
      { body: '#A29BFE', fin: '#B8B5FF', belly: '#E8E6FF' },
    ]
    return palettes[Math.floor(Math.random() * palettes.length)]
  }

  update() {
    this.changeDirectionTimer++
    if (this.changeDirectionTimer > 120 + Math.random() * 180) {
      this.changeDirectionTimer = 0
      const angleChange = (Math.random() - 0.5) * Math.PI * 0.5
      this.direction += angleChange
    }

    const vx = Math.cos(this.direction) * this.speed
    const vy = Math.sin(this.direction) * this.speed + Math.sin(this.tailPhase) * 0.3

    this.x += vx
    this.y += vy

    const margin = this.size * 2.5
    if (this.x < -margin) this.x = canvas.value.width + margin
    if (this.x > canvas.value.width + margin) this.x = -margin
    if (this.y < -margin) this.y = canvas.value.height + margin
    if (this.y > canvas.value.height + margin) this.y = -margin

    this.tailPhase += this.tailSpeed

    this.lastBubbleTime++
    if (this.lastBubbleTime > 150 + Math.random() * 200) {
      this.lastBubbleTime = 0
      this.bubbles.push({
        offsetX: this.size * 0.5,
        offsetY: -this.size * 0.2,
        radius: Math.random() * 3 + 1.5,
        life: 1,
        speed: Math.random() * 0.008 + 0.005
      })
    }

    this.bubbles = this.bubbles.filter(b => {
      b.life -= b.speed
      b.offsetY -= this.size * 0.04
      return b.life > 0
    })
  }

  draw() {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.direction)
    ctx.globalAlpha = this.opacity

    this.drawBubbles()
    this.drawTail()
    this.drawBody()
    this.drawBelly()
    this.drawFins()
    this.drawEye()
    this.drawSmile()
    this.drawCheeks()

    ctx.restore()
  }

  drawBubbles() {
    this.bubbles.forEach(bubble => {
      ctx.save()
      ctx.globalAlpha = this.opacity * bubble.life * 0.7
      ctx.beginPath()
      ctx.arc(bubble.offsetX, bubble.offsetY, bubble.radius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.lineWidth = 0.5
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(bubble.offsetX - bubble.radius * 0.3, bubble.offsetY - bubble.radius * 0.3, bubble.radius * 0.2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.fill()
      ctx.restore()
    })
  }

  drawBody() {
    const s = this.size
    const c = this.color
    
    ctx.beginPath()
    ctx.moveTo(s * 0.7, 0)
    ctx.bezierCurveTo(s * 0.6, -s * 0.55, s * 0.1, -s * 0.6, -s * 0.3, -s * 0.4)
    ctx.bezierCurveTo(-s * 0.6, -s * 0.2, -s * 0.65, s * 0.2, -s * 0.3, s * 0.4)
    ctx.bezierCurveTo(s * 0.1, s * 0.6, s * 0.6, s * 0.55, s * 0.7, 0)
    ctx.closePath()
    
    const gradient = ctx.createRadialGradient(-s * 0.3, -s * 0.2, 0, 0, 0, s)
    gradient.addColorStop(0, c.belly)
    gradient.addColorStop(0.5, c.body)
    gradient.addColorStop(1, c.fin)
    ctx.fillStyle = gradient
    ctx.fill()
    
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'
    ctx.lineWidth = 1
    ctx.stroke()
    
    this.drawScales()
  }

  drawScales() {
    const s = this.size
    const c = this.color
    ctx.save()
    ctx.globalAlpha = 0.35
    ctx.fillStyle = c.fin
    
    for (let row = 0; row < 3; row++) {
      const y = -s * 0.25 + row * s * 0.2
      for (let col = 0; col < 4; col++) {
        const x = -s * 0.2 + col * s * 0.18
        if (Math.abs(x + s * 0.35) < s * 0.45 && Math.abs(y) < s * 0.3) {
          ctx.beginPath()
          ctx.arc(x, y, s * 0.07, 0, Math.PI, true)
          ctx.fill()
        }
      }
    }
    ctx.restore()
  }

  drawBelly() {
    const s = this.size
    ctx.save()
    ctx.globalAlpha = 0.4
    ctx.fillStyle = this.color.belly
    ctx.beginPath()
    ctx.ellipse(s * 0.05, s * 0.2, s * 0.3, s * 0.2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  drawTail() {
    const s = this.size
    const wag = Math.sin(this.tailPhase) * 0.4
    ctx.save()
    ctx.translate(-s * 0.5, 0)
    ctx.rotate(wag)
    
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(-s * 0.1, -s * 0.15, -s * 0.35, -s * 0.35, -s * 0.5, -s * 0.25)
    ctx.bezierCurveTo(-s * 0.35, -s * 0.1, -s * 0.4, 0, -s * 0.5, s * 0.25)
    ctx.bezierCurveTo(-s * 0.35, s * 0.1, -s * 0.1, s * 0.15, 0, 0)
    ctx.closePath()
    
    const gradient = ctx.createLinearGradient(-s * 0.5, 0, 0, 0)
    gradient.addColorStop(0, this.color.fin)
    gradient.addColorStop(1, this.color.body)
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'
    ctx.lineWidth = 0.8
    ctx.stroke()
    ctx.restore()
  }

  drawFins() {
    const s = this.size
    const wag = Math.sin(this.tailPhase * 0.8) * 0.25
    
    ctx.save()
    ctx.translate(-s * 0.1, s * 0.3)
    ctx.rotate(0.4 + wag)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(s * 0.15, s * 0.1, s * 0.2, s * 0.3, s * 0.05, s * 0.4)
    ctx.bezierCurveTo(-s * 0.05, s * 0.25, -s * 0.1, s * 0.1, 0, 0)
    ctx.closePath()
    ctx.fillStyle = this.color.fin
    ctx.globalAlpha = this.opacity * 0.9
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 0.5
    ctx.stroke()
    ctx.restore()

    ctx.save()
    ctx.translate(s * 0.1, -s * 0.1)
    ctx.rotate(-0.3 + wag * 0.5)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(s * 0.1, -s * 0.05, s * 0.05, -s * 0.25, -s * 0.05, -s * 0.3)
    ctx.bezierCurveTo(-s * 0.15, -s * 0.2, -s * 0.1, -s * 0.05, 0, 0)
    ctx.closePath()
    ctx.fillStyle = this.color.fin
    ctx.globalAlpha = this.opacity * 0.75
    ctx.fill()
    ctx.restore()
  }

  drawEye() {
    const s = this.size
    ctx.save()
    ctx.translate(s * 0.35, -s * 0.15)
    
    ctx.beginPath()
    ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'
    ctx.lineWidth = 0.5
    ctx.stroke()
    
    const pupilOffset = Math.sin(this.tailPhase * 0.3) * s * 0.03
    ctx.beginPath()
    ctx.arc(s * 0.05 + pupilOffset, 0, s * 0.08, 0, Math.PI * 2)
    ctx.fillStyle = '#2C3E50'
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(s * 0.08 + pupilOffset, -s * 0.03, s * 0.035, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    
    ctx.restore()
  }

  drawSmile() {
    const s = this.size
    ctx.save()
    ctx.translate(s * 0.5, s * 0.05)
    ctx.beginPath()
    ctx.arc(0, 0, s * 0.05, 0.2, Math.PI - 0.2)
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.restore()
  }

  drawCheeks() {
    const s = this.size
    ctx.save()
    ctx.globalAlpha = this.opacity * 0.5
    ctx.fillStyle = '#FF9999'
    
    ctx.beginPath()
    ctx.arc(s * 0.25, s * 0.1, s * 0.08, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(s * 0.25, -s * 0.1, s * 0.08, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
}

const initParticles = () => {
  particles = []
  const count = Math.floor((canvas.value.width * canvas.value.height) / 8000)
  for (let i = 0; i < count; i++) {
    particles.push(new Particle())
  }
}

const initFishes = () => {
  fishes = []
  const count = 25
  for (let i = 0; i < count; i++) {
    fishes.push(new Fish())
  }
}

const drawLines = () => {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 150) {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 150)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }
}

const animate = () => {
  const gradient = ctx.createLinearGradient(0, 0, canvas.value.width, canvas.value.height)
  gradient.addColorStop(0, '#dbeafe')
  gradient.addColorStop(0.5, '#e0e7ff')
  gradient.addColorStop(1, '#ede9fe')
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
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.4 * (1 - dist / 200)})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })
  }

  fishes.forEach(f => {
    f.update()
    f.draw()
  })

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
  initFishes()
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initParticles()
  initFishes()
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
