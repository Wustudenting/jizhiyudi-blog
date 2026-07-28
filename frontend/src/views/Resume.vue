<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="max-w-4xl mx-auto space-y-6">
          <section class="glass-card p-8">
            <div class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span class="text-5xl">🐟</span>
              </div>
              <div class="flex-1 text-center md:text-left">
                <h1 class="text-3xl font-bold text-slate-800 mb-2">机智的鱼</h1>
                <p class="text-slate-500 mb-4">全栈开发工程师 | 热爱技术，追求卓越</p>
                <div class="flex flex-wrap justify-center md:justify-start gap-2">
                  <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">前端开发</span>
                  <span class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">后端开发</span>
                  <span class="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">全栈</span>
                  <span class="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">AI应用</span>
                </div>
              </div>
            </div>
          </section>

          <section class="glass-card p-8">
            <h2 class="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <span class="mr-2">📖</span>关于我
            </h2>
            <div class="space-y-4 text-slate-600 leading-relaxed">
              <p>
                大家好，我是<span class="font-semibold text-indigo-600">机智的鱼</span>，一名热爱编程的全栈开发工程师。
                我热衷于探索新技术，享受将想法变为现实的过程。
              </p>
              <p>
                在前端领域，我精通 Vue3 框架，熟悉现代前端工程化体系；在后端方面，我熟练掌握 Node.js 和 Java，
                能够独立完成从设计到部署的全流程开发。
              </p>
              <p>
                除了编程，我还对 AI 应用开发有浓厚兴趣，关注机器学习和深度学习在实际业务中的应用。
                希望通过技术，让生活变得更美好。
              </p>
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
                  <h3 class="font-medium text-slate-800">全栈开发工程师</h3>
                  <span class="text-sm text-slate-500">2025 - 至今</span>
                </div>
                <p class="text-slate-500 text-sm mb-2">机智的鱼工作室</p>
                <ul class="text-slate-600 text-sm space-y-1 list-disc list-inside">
                  <li>独立设计并开发了多个全栈 Web 应用项目</li>
                  <li>负责系统架构设计、数据库设计、API 开发和前端实现</li>
                  <li>使用 Vue3 + Node.js 技术栈，构建高性能、易维护的应用</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="glass-card p-8">
            <h2 class="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <span class="mr-2">🌟</span>个人亮点
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <h3 class="font-medium text-slate-800 mb-2">🚀 全栈能力</h3>
                <p class="text-sm text-slate-600">精通前后端开发，能够独立完成产品从0到1</p>
              </div>
              <div class="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <h3 class="font-medium text-slate-800 mb-2">🤖 AI 实践</h3>
                <p class="text-sm text-slate-600">将 AI 技术融入实际产品，打造智能化应用</p>
              </div>
              <div class="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
                <h3 class="font-medium text-slate-800 mb-2">📚 持续学习</h3>
                <p class="text-sm text-slate-600">保持对新技术的好奇心和学习热情</p>
              </div>
              <div class="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                <h3 class="font-medium text-slate-800 mb-2">✨ 追求卓越</h3>
                <p class="text-sm text-slate-600">注重代码质量和用户体验，精益求精</p>
              </div>
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
import SideBar from '../components/SideBar.vue'
</script>
