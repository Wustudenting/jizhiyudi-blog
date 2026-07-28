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
const initialized = ref(false)

const loadArticle = async (skipIncrement = false) => {
  const id = Number(route.params.id)
  const saved = JSON.parse(localStorage.getItem('blog_articles') || '[]')
  const liked = loadLikedArticles()
  
  let found = saved.find(a => a.id === id)
  
  if (!found) {
    try {
      const resp = await fetch(`http://localhost:8080/articles/${id}`)
      if (resp.ok) {
        const data = await resp.json()
        if (data && !data.message) {
          found = {
            id: data.id,
            articleTitle: data.title || data.articleTitle,
            articleContent: data.content || '',
            articleSummary: data.summary || '',
            articleCover: data.cover || '',
            categoryName: data.category ? data.category.name : '未分类',
            createTime: data.created_at,
            viewCount: data.view_count || 0,
            likeCount: data.like_count || 0,
            tagNames: (data.tags || []).map(t => t.name),
          }
          if (!saved.find(a => a.id === id)) {
            saved.push(found)
            localStorage.setItem('blog_articles', JSON.stringify(saved))
          }
        }
      }
    } catch (e) {
      console.warn('Failed to fetch article from backend:', e.message)
    }
  }

  if (found) {
    let newViewCount = found.viewCount || 0
    if (!skipIncrement) {
      const sessionViewed = sessionStorage.getItem(`blog_viewed_${id}`)
      if (!sessionViewed) {
        newViewCount = (found.viewCount || 0) + 1
        sessionStorage.setItem(`blog_viewed_${id}`, '1')
        const idx = saved.findIndex(a => a.id === id)
        if (idx > -1) {
          saved[idx].viewCount = newViewCount
          localStorage.setItem('blog_articles', JSON.stringify(saved))
        }
      }
    }
    article.value = {
      id: found.id,
      articleTitle: found.articleTitle || found.title,
      articleContent: found.articleContent || found.content || '',
      articleSummary: found.articleSummary || found.summary || '',
      articleCover: found.articleCover || found.cover || '',
      categoryName: found.categoryName || '未分类',
      createTime: found.createTime || found.created_at,
      viewCount: newViewCount,
      commentCount: found.commentCount || 0,
      liked: liked.includes(found.id),
      tags: (found.tagNames || found.tags || []).map((name, idx) => {
        if (typeof name === 'string') return { id: idx + 100, tagName: name }
        return { id: name.id || idx + 100, tagName: name.tagName || name.name }
      }),
    }
    const savedComments = loadComments(found.id)
    comments.value = savedComments || []
    return
  }

  article.value = null
  comments.value = []
}

const initPage = async () => {
  if (!route.params.id || initialized.value) return
  initialized.value = true
  
  await loadArticle()
  const articleId = route.params.id
  
  syncArticleDetail(articleId).then(() => {
    loadArticle(true)
  }).catch(() => {})
  
  syncComments(articleId).then((syncedComments) => {
    if (syncedComments) {
      comments.value = syncedComments
      if (article.value) {
        saveComments(article.value.id, syncedComments)
      }
    }
  }).catch(() => {})
}

watch(() => route.params.id, () => {
  initialized.value = false
  if (route.params.id) {
    initPage()
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

const deleteArticle = async () => {
  if (!article.value) return
  
  if (!confirm('确定要删除这篇文章吗？删除后不可恢复！')) {
    return
  }
  
  try {
    try {
      await fetch(`http://localhost:8080/articles/${article.value.id}`, { method: 'DELETE' })
    } catch (e) {}

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

const submitComment = async () => {
  if (!commentForm.value.nickname || !commentForm.value.commentContent) {
    alert('请填写昵称和评论内容')
    return
  }
  
  const tempId = Date.now()
  const newComment = {
    id: tempId,
    nickname: commentForm.value.nickname,
    commentContent: commentForm.value.commentContent,
    createTime: new Date().toISOString(),
    replies: [],
  }
  
  comments.value.push(newComment)
  if (article.value) {
    saveComments(article.value.id, comments.value)
  }

  try {
    const resp = await fetch('http://localhost:8080/comments/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        article_id: article.value?.id,
        nickname: newComment.nickname,
        content: newComment.commentContent,
        avatar: '',
        parent_id: 0,
      })
    })
    if (resp.ok) {
      const data = await resp.json()
      if (data && data.id) {
        const idx = comments.value.findIndex(c => c.id === tempId)
        if (idx > -1) {
          comments.value[idx].id = data.id
          comments.value[idx]._backendId = data.id
          saveComments(article.value.id, comments.value)
        }
      }
    }
  } catch (e) {
    console.warn('Failed to save comment to backend:', e.message)
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

onMounted(() => {
  if (route.params.id) {
    initPage()
  }
})
</script>
