<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div v-if="article" class="max-w-4xl mx-auto">
          <button @click="$router.back()" class="mb-4 flex items-center space-x-2 text-slate-400 hover:text-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
      <article class="glass-card p-8 mb-8">
        <div class="flex items-center space-x-2 mb-4">
          <span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-500 rounded">{{ article.categoryName }}</span>
          <span class="text-xs text-slate-500">{{ formatDate(article.createTime) }}</span>
        </div>
        <h1 class="text-3xl font-bold text-slate-800 mb-6">{{ article.articleTitle }}</h1>
        <div v-if="article.articleCover" class="mb-6">
          <img :src="article.articleCover" :alt="article.articleTitle" class="w-full h-64 object-cover rounded-lg" />
        </div>
        <div class="flex flex-wrap gap-2 mb-6">
          <router-link 
            v-for="tag in article.tags" 
            :key="tag.id"
            :to="`/tags/${tag.id}`"
            class="px-3 py-1 bg-purple-500/20 text-purple-500 text-sm rounded-full hover:bg-purple-500/30 transition-colors"
          >
            {{ tag.tagName }}
          </router-link>
        </div>
        <div class="markdown-body" v-html="article.articleContent"></div>
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <div class="flex items-center space-x-4 text-slate-500">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ article.viewCount || 0 }}
            </span>
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {{ totalCommentCount }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="toggleLike" 
              class="p-2 transition-colors"
              :class="article.liked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'"
              :title="article.liked ? '取消点赞' : '点赞'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="article.liked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button 
              @click="deleteArticle" 
              class="p-2 text-slate-400 hover:text-red-400 transition-colors"
              title="删除文章"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </article>

      <div v-if="article" class="mb-8">
        <AIChat
          :article-title="article.articleTitle"
          :article-content="article.articleContent"
          :article-summary="article.articleSummary"
          :category-name="article.categoryName"
          :tags="article.tags"
        />
      </div>

      <section class="glass-card p-8 mb-8">
        <h2 class="text-xl font-semibold text-slate-800 mb-6">评论 ({{ totalCommentCount }})</h2>
        
        <div v-if="comments.length > 0" class="space-y-6">
          <div v-for="comment in comments" :key="comment.id" class="border-b border-slate-200 pb-6">
            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span class="text-slate-800 font-medium">{{ comment.nickname?.charAt(0) || 'U' }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-slate-800">{{ comment.nickname }}</span>
                  <span class="text-sm text-slate-500">{{ formatDate(comment.createTime) }}</span>
                </div>
                <p class="text-slate-600">{{ comment.commentContent }}</p>
                
                <div v-if="comment.replies?.length > 0" class="mt-4 ml-4 pl-4 border-l-2 border-slate-200">
                  <div v-for="reply in comment.replies" :key="reply.id" class="mb-3">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-sm text-blue-500">{{ reply.nickname }}</span>
                      <span class="text-xs text-slate-500">{{ formatDate(reply.createTime) }}</span>
                    </div>
                    <p class="text-sm text-slate-600">{{ reply.commentContent }}</p>
                  </div>
                </div>
                
                <button @click="showReplyBox(comment.id)" class="mt-3 text-sm text-slate-400 hover:text-blue-500 transition-colors">
                  回复
                </button>
                
                <div v-if="replyCommentId === comment.id" class="mt-4">
                  <textarea 
                    v-model="replyContent"
                    placeholder="输入回复内容..."
                    class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                    rows="3"
                  ></textarea>
                  <div class="flex justify-end mt-3">
                    <button @click="submitReply(comment.id)" class="btn-primary">发送回复</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <p class="text-slate-500">暂无评论，快来发表第一条评论吧！</p>
        </div>
        
        <div class="mt-8 pt-6 border-t border-slate-200">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">发表评论</h3>
          <form @submit.prevent="submitComment" class="space-y-4">
            <input 
              v-model="commentForm.nickname"
              type="text" 
              placeholder="昵称"
              class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <textarea 
              v-model="commentForm.commentContent"
              placeholder="输入评论内容..."
              class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              rows="4"
            ></textarea>
            <div class="flex justify-end">
              <button type="submit" class="btn-primary">发表评论</button>
            </div>
          </form>
        </div>
      </section>
    </div>

    <div v-else class="text-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-slate-400">文章不存在</p>
        </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SideBar from '../components/SideBar.vue'
import AIChat from '../components/AIChat.vue'
import { syncArticleDetail, syncComments } from '../service/syncService'

const route = useRoute()
const router = useRouter()
const article = ref(null)
const comments = ref([])

watch(() => route.params.id, async () => {
  if (route.params.id) {
    await syncArticleDetail(route.params.id)
    loadArticle()
    await syncComments(route.params.id)
    const syncedComments = loadComments(route.params.id)
    if (syncedComments) {
      comments.value = syncedComments
    }
  }
})

const totalCommentCount = computed(() => {
  let count = comments.value.length
  for (const comment of comments.value) {
    if (comment.replies && Array.isArray(comment.replies)) {
      count += comment.replies.length
    }
  }
  return count
})
const replyCommentId = ref(null)
const replyContent = ref('')
const likedArticles = ref([])

const loadLikedArticles = () => {
  const saved = localStorage.getItem('blog_liked_articles')
  return saved ? JSON.parse(saved) : []
}

const saveLikedArticles = (list) => {
  localStorage.setItem('blog_liked_articles', JSON.stringify(list))
}

const toggleLike = () => {
  if (!article.value) return
  
  const liked = loadLikedArticles()
  const articleId = article.value.id
  
  if (liked.includes(articleId)) {
    const index = liked.indexOf(articleId)
    liked.splice(index, 1)
    article.value.liked = false
  } else {
    liked.push(articleId)
    article.value.liked = true
  }
  
  saveLikedArticles(liked)
}

const commentForm = ref({
  nickname: '',
  commentContent: '',
})

const getCommentsKey = (articleId) => `blog_comments_${articleId}`

const saveComments = (articleId, commentsData) => {
  localStorage.setItem(getCommentsKey(articleId), JSON.stringify(commentsData))
}

const loadComments = (articleId) => {
  const saved = localStorage.getItem(getCommentsKey(articleId))
  if (saved) {
    return JSON.parse(saved)
  }
  return null
}

const getDateStr = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const showReplyBox = (commentId) => {
  replyCommentId.value = replyCommentId.value === commentId ? null : commentId
  replyContent.value = ''
}

const deleteArticle = () => {
  if (!article.value) return
  
  if (!confirm('确定要删除这篇文章吗？删除后不可恢复！')) {
    return
  }
  
  try {
    const saved = localStorage.getItem('blog_articles')
    if (saved) {
      const articles = JSON.parse(saved)
      const index = articles.findIndex(a => a.id === article.value.id)
      if (index > -1) {
        articles.splice(index, 1)
        localStorage.setItem('blog_articles', JSON.stringify(articles))
        
        localStorage.removeItem(getCommentsKey(article.value.id))
        
        if (article.value.categoryName) {
          const categories = JSON.parse(localStorage.getItem('blog_categories') || '[]')
          const catIndex = categories.findIndex(c => c.categoryName === article.value.categoryName)
          if (catIndex > -1) {
            categories[catIndex].articleCount = Math.max(0, (categories[catIndex].articleCount || 1) - 1)
            localStorage.setItem('blog_categories', JSON.stringify(categories))
          }
        }
        
        alert('文章删除成功！')
        router.push('/articles')
      }
    }
  } catch (error) {
    console.error('Failed to delete article:', error)
    alert('删除失败：' + error.message)
  }
}

const submitComment = () => {
  if (!commentForm.value.nickname || !commentForm.value.commentContent) {
    alert('请填写昵称和评论内容')
    return
  }
  
  const newComment = {
    id: Date.now(),
    nickname: commentForm.value.nickname,
    commentContent: commentForm.value.commentContent,
    createTime: new Date(),
    replies: [],
  }
  
  comments.value.push(newComment)
  if (article.value) {
    saveComments(article.value.id, comments.value)
  }
  commentForm.value = { nickname: '', commentContent: '' }
}

const submitReply = (parentId) => {
  if (!replyContent.value.trim()) {
    alert('请填写回复内容')
    return
  }
  
  const newReply = {
    id: Date.now(),
    nickname: commentForm.value.nickname || '访客',
    commentContent: replyContent.value,
    createTime: new Date(),
  }
  
  const comment = comments.value.find(c => c.id === parentId)
  if (comment) {
    if (!comment.replies) {
      comment.replies = []
    }
    comment.replies.push(newReply)
  }
  
  if (article.value) {
    saveComments(article.value.id, comments.value)
  }
  
  replyContent.value = ''
  replyCommentId.value = null
}

const incrementViewCount = (articleId) => {
  const saved = JSON.parse(localStorage.getItem('blog_articles') || '[]')
  const index = saved.findIndex(a => a.id === articleId)
  if (index > -1) {
    saved[index].viewCount = (saved[index].viewCount || 0) + 1
    localStorage.setItem('blog_articles', JSON.stringify(saved))
    return saved[index].viewCount
  }
  return null
}

const loadArticle = () => {
  const id = Number(route.params.id)
  const saved = JSON.parse(localStorage.getItem('blog_articles') || '[]')
  const liked = loadLikedArticles()
  
  const found = saved.find(a => a.id === id)
  if (found) {
    const newViewCount = incrementViewCount(found.id)
    article.value = {
      id: found.id,
      articleTitle: found.articleTitle,
      articleContent: found.articleContent,
      articleSummary: found.articleSummary,
      articleCover: found.articleCover || '',
      categoryName: found.categoryName,
      createTime: found.createTime,
      viewCount: newViewCount !== null ? newViewCount : (found.viewCount || 0) + 1,
      commentCount: found.commentCount || 0,
      liked: liked.includes(found.id),
      tags: (found.tagNames || []).map((name, idx) => ({ id: idx + 100, tagName: name })),
    }
    const savedComments = loadComments(found.id)
    comments.value = savedComments || []
    return
  }
  
  const mockArticles = {
    1: {
      id: 1,
      articleTitle: 'Vue3 组合式API详解',
      articleContent: '<h2>什么是组合式API</h2><p>组合式API是Vue3引入的一种新的代码组织方式，它允许我们使用函数来组织组件逻辑，而不是选项对象。</p><h3>核心概念</h3><ul><li>setup: 组件的入口函数</li><li>ref: 创建响应式基本类型</li><li>reactive: 创建响应式对象</li><li>computed: 计算属性</li></ul><p>通过组合式API，我们可以更好地组织和复用组件逻辑，提高代码的可维护性。</p>',
      categoryName: '前端开发',
      createTime: getDateStr(0),
      viewCount: 1234,
      commentCount: 45,
      tags: [{ id: 1, tagName: 'Vue3' }, { id: 2, tagName: 'JavaScript' }],
    },
    2: {
      id: 2,
      articleTitle: 'JavaScript 高级技巧',
      articleContent: '<h2>JavaScript 高级技巧</h2><p>JavaScript是一门功能强大的语言，掌握高级技巧可以大幅提升代码质量。</p><h3>闭包与作用域</h3><p>理解闭包和作用域是掌握JavaScript的关键，它们决定了变量的可见性和生命周期。</p><h3>原型与继承</h3><p>JavaScript使用原型链实现继承，理解原型对象可以帮助我们更好地设计对象结构。</p><h3>异步编程</h3><p>掌握Promise、async/await等异步编程方式，可以处理复杂的异步任务。</p>',
      categoryName: '前端开发',
      createTime: getDateStr(1),
      viewCount: 892,
      commentCount: 32,
      tags: [{ id: 3, tagName: 'JavaScript' }],
    },
    3: {
      id: 3,
      articleTitle: 'Node.js 性能优化实践',
      articleContent: '<h2>Node.js 性能优化</h2><p>Node.js应用性能优化涉及多个方面，包括内存管理、异步处理、缓存策略等。</p><h3>内存优化</h3><p>避免内存泄漏，合理使用全局变量，及时释放不再使用的资源。</p><h3>异步优化</h3><p>使用异步IO、事件循环、Worker线程等技术提升并发处理能力。</p>',
      categoryName: '后端开发',
      createTime: getDateStr(2),
      viewCount: 654,
      commentCount: 28,
      tags: [{ id: 4, tagName: 'Node.js' }, { id: 5, tagName: '性能优化' }],
    },
    4: {
      id: 4,
      articleTitle: 'Docker容器化部署指南',
      articleContent: '<h2>Docker 容器化</h2><p>Docker是一个开源的容器化平台，使开发者能够将应用及其依赖打包到一个可移植的容器中。</p><h3>基本概念</h3><ul><li>镜像(Image)：只读的模板，包含创建容器的指令</li><li>容器(Container)：镜像的运行实例</li><li>仓库(Registry)：存储和分发镜像的服务</li></ul><h3>常用命令</h3><p>docker pull, docker run, docker build, docker push 等是Docker的核心命令。</p>',
      categoryName: 'DevOps',
      createTime: getDateStr(3),
      viewCount: 1567,
      commentCount: 56,
      tags: [{ id: 6, tagName: 'Docker' }, { id: 7, tagName: 'DevOps' }],
    },
    5: {
      id: 5,
      articleTitle: 'React Hooks 深入解析',
      articleContent: '<h2>React Hooks</h2><p>React Hooks是React 16.8引入的新特性，它让函数组件也能拥有状态和副作用。</p><h3>常用Hooks</h3><ul><li>useState: 状态管理</li><li>useEffect: 副作用处理</li><li>useContext: 上下文使用</li><li>useRef: 引用管理</li></ul><p>Hooks的出现让React代码更加简洁和可复用。</p>',
      categoryName: '前端开发',
      createTime: getDateStr(5),
      viewCount: 780,
      commentCount: 25,
      tags: [{ id: 8, tagName: 'React' }, { id: 2, tagName: 'JavaScript' }],
    },
    6: {
      id: 6,
      articleTitle: 'Vite 构建优化实践',
      articleContent: '<h2>Vite 构建优化</h2><p>Vite是新一代的前端构建工具，基于ES Module提供极速的开发体验。</p><h3>优化策略</h3><ul><li>代码分割</li><li>Tree Shaking</li><li>懒加载</li><li>资源压缩</li></ul><p>通过合理配置Vite，可以大幅提升项目的构建速度和加载性能。</p>',
      categoryName: '前端开发',
      createTime: getDateStr(6),
      viewCount: 520,
      commentCount: 18,
      tags: [{ id: 9, tagName: 'Vite' }, { id: 1, tagName: 'Vue3' }],
    },
    7: {
      id: 7,
      articleTitle: 'MySQL 索引优化',
      articleContent: '<h2>MySQL 索引优化</h2><p>索引是提高数据库查询性能的关键因素，合理使用索引可以大幅提升查询效率。</p><h3>索引类型</h3><ul><li>B+树索引</li><li>哈希索引</li><li>全文索引</li></ul><h3>优化建议</h3><p>避免在索引列上使用函数、不要过度使用索引、使用覆盖索引等。</p>',
      categoryName: '后端开发',
      createTime: getDateStr(7),
      viewCount: 610,
      commentCount: 22,
      tags: [{ id: 10, tagName: 'MySQL' }, { id: 5, tagName: '性能优化' }],
    },
    8: {
      id: 8,
      articleTitle: 'Kubernetes 入门到精通',
      articleContent: '<h2>Kubernetes</h2><p>Kubernetes是容器编排系统，用于自动化部署、扩展和管理容器化应用。</p><h3>核心概念</h3><ul><li>Pod: 最小部署单元</li><li>Service: 服务发现和负载均衡</li><li>Deployment: 部署管理</li><li>ConfigMap/Secret: 配置管理</li></ul><p>掌握Kubernetes对于云原生时代的开发者至关重要。</p>',
      categoryName: 'DevOps',
      createTime: getDateStr(8),
      viewCount: 430,
      commentCount: 15,
      tags: [{ id: 11, tagName: 'Kubernetes' }, { id: 6, tagName: 'Docker' }],
    },
    9: {
      id: 9,
      articleTitle: '感悟',
      articleContent: '<h2>生活感悟</h2><p>在技术学习的道路上，我逐渐明白，真正的成长不仅仅是技术的积累，更是思维方式的转变。</p><h3>学习心得</h3><p>保持好奇心、持续学习、善于总结、勇于实践，这些都是技术人成长的必经之路。</p><h3>生活态度</h3><p>工作与生活的平衡，是每个人都需要面对的课题。希望我能在代码中找到乐趣，在生活中发现美好。</p>',
      categoryName: '感悟',
      createTime: getDateStr(0),
      viewCount: 280,
      commentCount: 12,
      tags: [{ id: 12, tagName: '感悟' }],
    },
    10: {
      id: 10,
      articleTitle: '生活',
      articleContent: '<h2>生活随笔</h2><p>记录生活中的点滴，分享那些平凡而美好的瞬间。</p><h3>日常</h3><p>每一个清晨都是新的开始，每一次努力都不会被辜负。保持热爱，奔赴山海。</p><h3>思考</h3><p>生活的意义不在于长度，而在于深度。愿我们都能活出自己想要的样子。</p>',
      categoryName: '生活',
      createTime: getDateStr(0),
      viewCount: 320,
      commentCount: 8,
      tags: [{ id: 13, tagName: '生活' }],
    },
    11: {
      id: 11,
      articleTitle: '百度',
      articleContent: '<h2>关于百度</h2><p>百度是中国最大的搜索引擎和互联网服务提供商之一，由李彦宏于2000年创立。</p><h3>业务范围</h3><ul><li>搜索引擎</li><li>人工智能</li><li>自动驾驶</li><li>云计算</li></ul><p>百度在AI领域的布局尤其值得关注，文心一言大模型代表了国内AI的最高水平。</p>',
      categoryName: '感悟',
      createTime: getDateStr(0),
      viewCount: 450,
      commentCount: 20,
      tags: [{ id: 14, tagName: '互联网' }],
    },
  }
  
  const defaultArticle = mockArticles[id] || mockArticles[1]
  const viewSessionKey = `blog_viewed_${id}_${Date.now().toString().slice(0, -4)}`
  const sessionViewed = sessionStorage.getItem(`blog_viewed_${id}`)
  let newViewCount = defaultArticle.viewCount
  if (!sessionViewed) {
    newViewCount = (defaultArticle.viewCount || 0) + 1
    sessionStorage.setItem(`blog_viewed_${id}`, '1')
  }
  article.value = Object.assign({}, defaultArticle, {
    viewCount: newViewCount,
    liked: liked.includes(defaultArticle.id)
  })
  
  const savedComments = loadComments(article.value.id)
  if (savedComments) {
    comments.value = savedComments
  } else {
    const mockComments = [
      { id: 1, nickname: '访客', commentContent: '文章写得很棒，收获很多！', createTime: new Date(), replies: [] },
      { id: 2, nickname: '读者', commentContent: '感谢分享，期待更多内容', createTime: new Date(), replies: [] },
    ]
    comments.value = mockComments
    saveComments(article.value.id, mockComments)
  }
}

onMounted(async () => {
  if (route.params.id) {
    await syncArticleDetail(route.params.id)
    loadArticle()
    await syncComments(route.params.id)
    const syncedComments = loadComments(route.params.id)
    if (syncedComments) {
      comments.value = syncedComments
    }
  }
})
</script>
