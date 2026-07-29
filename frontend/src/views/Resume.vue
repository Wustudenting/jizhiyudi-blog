<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="max-w-4xl mx-auto space-y-6">
          <section class="glass-card p-8">
            <div class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg viewBox="0 0 80 80" class="w-20 h-20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="resBodyGrad" cx="40%" cy="40%" r="60%">
                      <stop offset="0%" stop-color="#FFFBEB"/>
                      <stop offset="40%" stop-color="#FEF3C7"/>
                      <stop offset="100%" stop-color="#FCD34D"/>
                    </radialGradient>
                    <radialGradient id="resTailGrad" cx="40%" cy="50%" r="60%">
                      <stop offset="0%" stop-color="#FDE68A"/>
                      <stop offset="100%" stop-color="#F59E0B"/>
                    </radialGradient>
                    <radialGradient id="resBlushGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#F87171" stop-opacity="0.6"/>
                      <stop offset="100%" stop-color="#F87171" stop-opacity="0"/>
                    </radialGradient>
                  </defs>
                  <ellipse cx="36" cy="42" rx="22" ry="16" fill="url(#resBodyGrad)" stroke="#92400E" stroke-width="2"/>
                  <path d="M56 42 Q70 30 74 42 Q70 54 56 42 Q62 42 56 42" fill="url(#resTailGrad)" stroke="#92400E" stroke-width="2"/>
                  <path d="M58 38 Q64 36 68 40" stroke="#78350F" stroke-width="1.2" fill="none" opacity="0.5"/>
                  <ellipse cx="30" cy="38" rx="5.5" ry="6" fill="white" stroke="#92400E" stroke-width="1.5"/>
                  <ellipse cx="31.5" cy="39" rx="3" ry="3.5" fill="#1E293B"/>
                  <circle cx="32.5" cy="37.5" r="1.2" fill="white"/>
                  <circle cx="30" cy="40.5" r="0.5" fill="white" opacity="0.6"/>
                  <ellipse cx="20" cy="46" rx="4" ry="2.5" fill="url(#resBlushGrad)"/>
                  <path d="M26 46 Q30 49 34 46" stroke="#92400E" stroke-width="1.8" fill="none" stroke-linecap="round"/>
                  <ellipse cx="42" cy="42" rx="6" ry="4" fill="white" opacity="0.6"/>
                  <circle cx="62" cy="28" r="3" fill="white" opacity="0.7"/>
                  <circle cx="68" cy="22" r="2" fill="white" opacity="0.5"/>
                  <circle cx="20" cy="28" r="1.5" fill="white" opacity="0.6"/>
                  <circle cx="48" cy="58" r="1" fill="white" opacity="0.4"/>
                </svg>
              </div>
              <div class="flex-1 text-center md:text-left">
                <div class="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <h1 class="text-3xl font-bold text-slate-800">机智的鱼</h1>
                  <span class="px-3 py-1 rounded-full text-sm font-medium" :class="currentProfile === 'fullstack' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'">
                    {{ currentProfile === 'fullstack' ? 'AI 全栈工程师' : 'AI 前端工程师' }}
                  </span>
                </div>
                <p class="text-slate-500 mb-4">{{ currentProfile === 'fullstack' ? 'AI 全栈开发工程师 | 精通前后端 + AI 应用' : 'AI 前端开发工程师 | 精通 Vue3 + AI 前端应用' }}</p>
                <div class="flex flex-wrap justify-center md:justify-start gap-2">
                  <span v-if="currentProfile === 'fullstack'" class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">前端开发</span>
                  <span v-if="currentProfile === 'fullstack'" class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">后端开发</span>
                  <span v-if="currentProfile === 'fullstack'" class="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">全栈架构</span>
                  <span v-if="currentProfile === 'fullstack'" class="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">AI应用</span>
                  <span v-if="currentProfile === 'frontend'" class="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm">Vue3</span>
                  <span v-if="currentProfile === 'frontend'" class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">JavaScript</span>
                  <span v-if="currentProfile === 'frontend'" class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">前端工程化</span>
                  <span v-if="currentProfile === 'frontend'" class="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">AI前端</span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-slate-100">
              <div class="flex items-center justify-center gap-4">
                <span class="text-sm text-slate-500">切换简历版本：</span>
                <div class="inline-flex rounded-xl bg-slate-100 p-1">
                  <button
                    @click="currentProfile = 'fullstack'"
                    :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', currentProfile === 'fullstack' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700']"
                  >
                    🚀 AI 全栈工程师
                  </button>
                  <button
                    @click="currentProfile = 'frontend'"
                    :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', currentProfile === 'frontend' ? 'bg-white shadow text-pink-600' : 'text-slate-500 hover:text-slate-700']"
                  >
                    🎨 AI 前端工程师
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section class="glass-card p-8">
            <h2 class="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <span class="mr-2">📖</span>关于我
            </h2>
            <div class="space-y-4 text-slate-600 leading-relaxed">
              <template v-if="currentProfile === 'fullstack'">
                <p>
                  大家好，我是<span class="font-semibold text-indigo-600">机智的鱼</span>，一名热爱编程的 AI 全栈开发工程师。
                  我热衷于探索新技术，享受将想法变为现实的过程，尤其擅长将 AI 技术与全栈开发相结合。
                </p>
                <p>
                  在前端领域，我精通 Vue3 框架，熟悉现代前端工程化体系；在后端方面，我熟练掌握 Node.js 和 Java，
                  能够独立完成从设计到部署的全流程开发，同时具备 AI 应用开发能力。
                </p>
                <p>
                  我关注大语言模型、机器学习在实际业务中的应用，致力于打造智能化的产品。
                  希望通过 AI + 全栈技术，让生活变得更美好。
                </p>
              </template>
              <template v-else>
                <p>
                  大家好，我是<span class="font-semibold text-pink-600">机智的鱼</span>，一名热爱编程的 AI 前端开发工程师。
                  我专精于 Vue3 生态，注重用户体验和交互设计，同时积极探索 AI 技术在前端的应用。
                </p>
                <p>
                  我精通 Vue3、TypeScript、Tailwind CSS 等现代前端技术栈，熟悉 Vite、Webpack 等工程化工具，
                  能够独立完成复杂的前端架构设计和组件开发，同时具备 AI 前端应用开发能力。
                </p>
                <p>
                  我关注 AI 在前端的落地应用，如智能组件生成、代码辅助、AI 驱动的用户界面等。
                  致力于通过 AI + 前端技术，创造更智能的用户体验。
                </p>
              </template>
            </div>
          </section>

          <section class="glass-card p-8">
            <h2 class="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <span class="mr-2">🎓</span>教育经历
            </h2>
            <div class="space-y-6">
              <div class="relative pl-6 border-l-2 border-indigo-200">
                <div class="absolute -left-[7px] top-1 w-3 h-3 bg-indigo-500 rounded-full"></div>
                <div class="flex flex-wrap justify-between items-start mb-1">
                  <h3 class="font-medium text-slate-800">计算机科学与技术</h3>
                  <span class="text-sm text-slate-500">2023 - 2027</span>
                </div>
                <p class="text-slate-500 text-sm mb-2">本科 | 广东理工学院</p>
                <p class="text-slate-600 text-sm">
                  主修课程：数据结构、算法设计、操作系统、计算机网络、数据库系统、软件工程、编译原理
                </p>
              </div>
            </div>
          </section>

          <section class="glass-card p-8">
            <h2 class="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <span class="mr-2">💼</span>工作经历
            </h2>
            <div class="space-y-6">
              <div class="relative pl-6 border-l-2 border-indigo-200">
                <div class="absolute -left-[7px] top-1 w-3 h-3 bg-indigo-500 rounded-full"></div>
                <div class="flex flex-wrap justify-between items-start mb-1">
                  <h3 class="font-medium text-slate-800">{{ currentProfile === 'fullstack' ? 'AI 全栈开发工程师' : 'AI 前端开发工程师' }}</h3>
                  <span class="text-sm text-slate-500">2025 - 至今</span>
                </div>
                <p class="text-slate-500 text-sm mb-2">机智的鱼工作室</p>
                <ul class="text-slate-600 text-sm space-y-1 list-disc list-inside">
                  <template v-if="currentProfile === 'fullstack'">
                    <li>独立设计并开发了多个 AI 全栈 Web 应用项目</li>
                    <li>负责系统架构设计、数据库设计、API 开发和前后端实现</li>
                    <li>使用 Vue3 + Node.js + AI 技术栈，构建智能化应用</li>
                  </template>
                  <template v-else>
                    <li>独立负责多个 AI 前端应用的开发与架构设计</li>
                    <li>负责 Vue3 组件库开发、性能优化、用户体验提升</li>
                    <li>使用 Vue3 + TypeScript + AI 技术，构建智能前端应用</li>
                  </template>
                </ul>
              </div>
            </div>
          </section>

          <section class="glass-card p-8">
            <h2 class="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <span class="mr-2">🌟</span>个人亮点
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <template v-if="currentProfile === 'fullstack'">
                <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <h3 class="font-medium text-slate-800 mb-2">🚀 全栈能力</h3>
                  <p class="text-sm text-slate-600">精通前后端开发，能够独立完成产品从0到1</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <h3 class="font-medium text-slate-800 mb-2">🤖 AI 实践</h3>
                  <p class="text-sm text-slate-600">将 AI 技术融入全栈产品，打造智能化应用</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
                  <h3 class="font-medium text-slate-800 mb-2">📚 持续学习</h3>
                  <p class="text-sm text-slate-600">保持对新技术的好奇心和学习热情</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                  <h3 class="font-medium text-slate-800 mb-2">✨ 追求卓越</h3>
                  <p class="text-sm text-slate-600">注重代码质量和系统架构，精益求精</p>
                </div>
              </template>
              <template v-else>
                <div class="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                  <h3 class="font-medium text-slate-800 mb-2">🎨 前端美学</h3>
                  <p class="text-sm text-slate-600">注重 UI/UX，追求极致的用户体验</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <h3 class="font-medium text-slate-800 mb-2">⚡ 性能优化</h3>
                  <p class="text-sm text-slate-600">精通前端性能调优，打造流畅应用</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                  <h3 class="font-medium text-slate-800 mb-2">🤖 AI 前端</h3>
                  <p class="text-sm text-slate-600">探索 AI 在前端的创新应用场景</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <h3 class="font-medium text-slate-800 mb-2">🏗️ 架构设计</h3>
                  <p class="text-sm text-slate-600">擅长组件化、模块化的前端架构设计</p>
                </div>
              </template>
            </div>
          </section>

          <section class="glass-card p-8">
            <h2 class="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <span class="mr-2">📬</span>联系方式
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="mailto:1146013446@qq.com" class="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <span class="text-2xl">📧</span>
                <div>
                  <p class="text-xs text-slate-500">邮箱</p>
                  <p class="text-sm font-medium text-slate-800">1146013446@qq.com</p>
                </div>
              </a>
              <a href="https://github.com/Wustudenting" target="_blank" class="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <span class="text-2xl">🐙</span>
                <div>
                  <p class="text-xs text-slate-500">GitHub</p>
                  <p class="text-sm font-medium text-slate-800">Wustudenting</p>
                </div>
              </a>
            </div>
          </section>
        </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SideBar from '../components/SideBar.vue'

const currentProfile = ref('fullstack')
</script>
