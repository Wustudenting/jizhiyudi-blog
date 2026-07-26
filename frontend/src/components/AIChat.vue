<template>
  <div class="glass-card p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-slate-800 text-sm">AI 智能助手</h3>
          <p class="text-xs text-slate-500">关于这篇文章的任何问题</p>
        </div>
      </div>
      <button
        v-if="messages.length > 1"
        @click="clearChat"
        class="text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        清空对话
      </button>
    </div>

    <div class="h-64 overflow-y-auto mb-4 space-y-3 pr-2" ref="chatContainer">
      <div v-if="messages.length === 0" class="text-center py-8">
        <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p class="text-sm text-slate-500 mb-3">你可以问我关于这篇文章的任何问题</p>
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            @click="sendSuggestion(suggestion)"
            class="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full hover:bg-indigo-100 transition-colors"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <div v-for="(msg, idx) in messages" :key="idx" class="flex gap-2" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <div v-if="msg.role === 'assistant'" class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
          <span class="text-white text-xs font-bold">AI</span>
        </div>
        <div class="max-w-[80%]">
          <div
            :class="[
              'px-3 py-2 rounded-2xl text-sm',
              msg.role === 'user'
                ? 'bg-indigo-500 text-white rounded-br-sm'
                : 'bg-slate-100 text-slate-700 rounded-bl-sm'
            ]"
          >
            <span v-html="formatMessage(msg.content)"></span>
          </div>
        </div>
        <div v-if="msg.role === 'user'" class="w-7 h-7 rounded-full bg-slate-300 flex-shrink-0 flex items-center justify-center">
          <span class="text-white text-xs font-bold">我</span>
        </div>
      </div>

      <div v-if="isTyping" class="flex gap-2 justify-start">
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
          <span class="text-white text-xs font-bold">AI</span>
        </div>
        <div class="px-3 py-2 rounded-2xl rounded-bl-sm bg-slate-100">
          <div class="flex gap-1">
            <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-2">
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        :disabled="isTyping"
        placeholder="问我关于这篇文章的问题..."
        class="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 disabled:opacity-50"
      />
      <button
        @click="sendMessage"
        :disabled="isTyping || !inputMessage.trim()"
        class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'

const props = defineProps({
  articleTitle: {
    type: String,
    default: ''
  },
  articleContent: {
    type: String,
    default: ''
  },
  articleSummary: {
    type: String,
    default: ''
  },
  categoryName: {
    type: String,
    default: ''
  },
  tags: {
    type: Array,
    default: () => []
  }
})

const messages = ref([])
const inputMessage = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)

const suggestions = ref([
  '请总结这篇文章',
  '这篇文章的核心观点是什么？',
  '能详细解释一下吗？',
  '文章适合什么水平的读者？'
])

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const formatMessage = (content) => {
  return content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:0.85em;">$1</code>')
    .replace(/\n/g, '<br>')
}

const generateSummary = () => {
  const title = props.articleTitle || '这篇文章'
  const summary = props.articleSummary || ''
  const cat = props.categoryName || ''
  const tagNames = props.tags?.map(t => t.tagName).join('、') || ''
  
  let response = `根据文章《${title}》的内容，我为你总结如下：\n\n`
  response += `**📌 核心主题**: 这是一篇关于 **${cat}** 领域的技术文章`
  
  if (tagNames) {
    response += `，涉及 ${tagNames} 等相关技术点`
  }
  response += '。\n\n'
  
  if (summary) {
    response += `**📝 内容概要**: ${summary}\n\n`
  }
  
  response += `**💡 阅读建议**: 这篇文章适合对 ${cat} 感兴趣的开发者阅读，建议结合实际项目进行实践，效果更佳。`
  
  return response
}

const generateCorePoints = () => {
  const title = props.articleTitle || '这篇文章'
  const cat = props.categoryName || ''
  
  return `文章《${title}》的核心观点包括：\n\n` +
    `1. **技术原理阐述**: 详细介绍了 ${cat} 相关的核心概念和工作机制\n\n` +
    `2. **实践方法指导**: 提供了可操作的实现步骤和代码示例\n\n` +
    `3. **最佳实践建议**: 总结了开发中的常见陷阱和优化方案\n\n` +
    `4. **扩展学习方向**: 指明了进一步深入学习的路径和相关技术栈`
}

const generateExplanation = () => {
  const title = props.articleTitle || '这篇文章'
  
  return `好的，让我为你详细解释《${title}》的核心内容：\n\n` +
    `**🔍 背景介绍**: 文章首先阐述了相关技术的发展背景和应用场景，帮助读者建立整体认知。\n\n` +
    `**⚙️ 核心机制**: 深入剖析了技术的内部工作原理，通过流程图和代码示例帮助理解。\n\n` +
    `**🚀 实战应用**: 提供了完整的实战案例，从环境搭建到代码实现，一步步带你掌握。\n\n` +
    `**⚠️ 注意事项**: 文中也提到了开发过程中需要注意的坑点和性能优化要点。\n\n` +
    `如果某个具体部分还想深入了解，随时告诉我！`
}

const generateAudience = () => {
  const cat = props.categoryName || '相关'
  const title = props.articleTitle || '这篇文章'
  
  return `《${title}》适合以下读者：\n\n` +
    `**👨‍💻 初级开发者**: 文章从基础概念讲起，适合入门学习\n\n` +
    `**👩‍💻 中级工程师**: 包含实用技巧和最佳实践，能帮助提升开发效率\n\n` +
    `**🎓 技术爱好者**: 内容深入浅出，对 ${cat} 感兴趣的读者都能受益\n\n` +
    `建议读者具备基本的编程基础，对 ${cat} 有一定了解会更容易理解。`
}

const generateDefault = (question) => {
  const title = props.articleTitle || '这篇文章'
  return `关于"${question}"这个问题，基于《${title}》的内容，我理解如下：\n\n` +
    `文章中涉及的相关内容主要围绕 **${props.categoryName || '主题'}** 展开。虽然这个问题在文中没有直接回答，但根据文章的核心观点，我可以给出以上分析。\n\n` +
    `💡 你也可以尝试问我：\n` +
    `- 总结这篇文章\n` +
    `- 核心观点是什么\n` +
    `- 详细解释一下\n` +
    `- 适合什么读者`
}

const generateResponse = (question) => {
  const q = question.toLowerCase()
  
  if (q.includes('总结') || q.includes('概要') || q.includes('概述') || q.includes('summary')) {
    return generateSummary()
  }
  if (q.includes('核心') || q.includes('观点') || q.includes('要点') || q.includes('主要')) {
    return generateCorePoints()
  }
  if (q.includes('解释') || q.includes('详细') || q.includes('讲解') || q.includes('深入')) {
    return generateExplanation()
  }
  if (q.includes('适合') || q.includes('读者') || q.includes('水平') || q.includes('难度')) {
    return generateAudience()
  }
  if (q.includes('你好') || q.includes('hi') || q.includes('hello') || q.includes('在吗')) {
    return `你好！👋 我是这篇文章的 AI 助手，可以帮你解答关于《${props.articleTitle}》的任何问题。试试问我吧！`
  }
  
  return generateDefault(question)
}

const sendMessage = async () => {
  const text = inputMessage.value.trim()
  if (!text || isTyping.value) return
  
  messages.value.push({ role: 'user', content: text })
  inputMessage.value = ''
  isTyping.value = true
  scrollToBottom()
  
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600))
  
  const response = generateResponse(text)
  messages.value.push({ role: 'assistant', content: response })
  isTyping.value = false
  scrollToBottom()
}

const sendSuggestion = async (suggestion) => {
  inputMessage.value = suggestion
  await sendMessage()
}

const clearChat = () => {
  messages.value = []
}

watch(() => props.articleTitle, () => {
  messages.value = []
})

onMounted(() => {
  messages.value = [{
    role: 'assistant',
    content: `你好！👋 我是文章《${props.articleTitle || ''}》的 AI 智能助手。\n\n我可以帮你：\n- 📝 总结文章内容\n- 🔍 解释核心概念\n- 💡 提炼关键观点\n- 🎯 分析适用场景\n\n有什么想问的吗？`
  }]
})
</script>
