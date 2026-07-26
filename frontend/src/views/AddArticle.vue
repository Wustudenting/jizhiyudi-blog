<template>
  <div class="pt-24">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center space-x-4 mb-8">
        <button @click="router.back()" class="p-2 text-slate-400 hover:text-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-3xl font-bold text-slate-800">添加文章</h1>
      </div>

      <form @submit.prevent="submitArticle" class="glass-card p-8 space-y-6">
        <div>
          <label class="block text-slate-800 font-medium mb-2">文章标题</label>
          <input 
            v-model="articleForm.articleTitle"
            type="text" 
            placeholder="请输入文章标题"
            class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-slate-800 font-medium mb-2">文章摘要</label>
          <textarea 
            v-model="articleForm.articleSummary"
            placeholder="请输入文章摘要"
            class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            rows="3"
          ></textarea>
        </div>

        <div>
          <label class="block text-slate-800 font-medium mb-2">文章封面</label>
          <div class="flex gap-2">
            <input 
              v-model="articleForm.articleCover"
              type="text" 
              placeholder="粘贴图片URL或上传图片"
              class="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <label class="px-4 py-3 bg-indigo-50 text-slate-800 rounded-lg hover:bg-indigo-100 cursor-pointer transition-colors whitespace-nowrap">
              <input 
                type="file" 
                accept="image/*" 
                @change="handleImageUpload"
                class="hidden"
              />
              📁 上传图片
            </label>
          </div>
          <div v-if="previewImage" class="mt-3">
            <img :src="previewImage" alt="预览" class="w-48 h-32 object-cover rounded-lg border border-slate-600" />
          </div>
        </div>

        <div>
          <label class="block text-slate-800 font-medium mb-2">分类</label>
          <div class="flex gap-2 mb-3">
            <select 
              v-model="articleForm.categoryId"
              class="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.categoryName }}
              </option>
            </select>
            <input 
              v-model="newCategoryName"
              type="text" 
              placeholder="新分类名"
              class="w-32 px-3 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
            <button 
              type="button" 
              @click="addNewCategory"
              class="px-4 py-3 bg-purple-600 text-slate-800 rounded-lg hover:bg-purple-700 transition-colors text-sm whitespace-nowrap"
            >
              + 添加
            </button>
          </div>
        </div>

        <div>
          <label class="block text-slate-800 font-medium mb-2">标签</label>
          <div class="flex flex-wrap gap-2 mb-3">
            <button 
              v-for="tag in tags" 
              :key="tag.id"
              type="button"
              @click="toggleTag(tag)"
              class="px-3 py-1 rounded-full text-sm transition-colors"
              :class="selectedTags.includes(tag.id) ? 'bg-blue-500 text-slate-800' : 'bg-indigo-50 text-slate-600 hover:bg-indigo-100'"
            >
              {{ tag.tagName }}
            </button>
          </div>
          <div class="flex gap-2">
            <input 
              v-model="newTag"
              type="text" 
              placeholder="输入新标签名称"
              class="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button 
              type="button" 
              @click="addNewTag"
              class="px-4 py-3 bg-purple-600 text-slate-800 rounded-lg hover:bg-purple-700 transition-colors text-sm whitespace-nowrap"
            >
              + 添加标签
            </button>
          </div>
        </div>

        <div>
          <label class="block text-slate-800 font-medium mb-2">文章内容</label>
          <textarea 
            v-model="articleForm.articleContent"
            placeholder="请输入文章内容"
            class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-mono"
            rows="12"
            required
          ></textarea>
        </div>

        <div class="flex items-center space-x-6">
          <label class="flex items-center space-x-2">
            <input 
              v-model="articleForm.isTop"
              type="checkbox" 
              class="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
            />
            <span class="text-slate-600">置顶文章</span>
          </label>
          <label class="flex items-center space-x-2">
            <input 
              v-model="articleForm.isFeatured"
              type="checkbox" 
              class="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
            />
            <span class="text-slate-600">精选文章</span>
          </label>
        </div>

        <div class="flex justify-end space-x-4 pt-4">
          <button type="button" @click="router.back()" class="btn-secondary">取消</button>
          <button type="submit" class="btn-primary">发布文章</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const defaultCategories = [
  { id: 1, categoryName: '前端开发', categoryDescription: '前端技术相关文章' },
  { id: 2, categoryName: '后端开发', categoryDescription: '后端技术相关文章' },
  { id: 3, categoryName: 'DevOps', categoryDescription: '运维与部署相关文章' },
  { id: 4, categoryName: '生活感悟', categoryDescription: '生活随笔与感悟' },
  { id: 5, categoryName: '感悟', categoryDescription: '人生感悟与思考' },
  { id: 6, categoryName: '生活', categoryDescription: '日常生活点滴记录' },
  { id: 7, categoryName: '读书笔记', categoryDescription: '读书笔记与好书推荐' },
  { id: 8, categoryName: '项目实战', categoryDescription: '项目开发实战经验分享' },
  { id: 9, categoryName: '工具推荐', categoryDescription: '开发工具与效率工具推荐' },
]

const categoryDescriptions = {
  '感悟': '人生感悟与思考',
  '生活': '日常生活点滴记录',
  '读书笔记': '读书笔记与好书推荐',
  '项目实战': '项目开发实战经验分享',
  '工具推荐': '开发工具与效率工具推荐',
  '前端开发': '前端技术相关文章',
  '后端开发': '后端技术相关文章',
  'DevOps': '运维与部署相关文章',
  '生活感悟': '生活随笔与感悟',
  '购物': '购物心得与好物推荐',
  '旅行': '旅行见闻与攻略分享',
  '美食': '美食烹饪与探店分享',
  '健身': '健身运动与健康生活',
  '影视': '影视作品观后感',
  '音乐': '音乐分享与评论',
  '游戏': '游戏心得与攻略',
  '教育': '教育学习经验分享',
  '职场': '职场经验与职业发展',
  '情感': '情感话题与心得',
  '摄影': '摄影技巧与作品分享',
}

const generateDescription = (name) => {
  if (categoryDescriptions[name]) return categoryDescriptions[name]
  if (name.includes('开发') || name.includes('技术')) return `${name}相关文章`
  if (name.includes('感悟') || name.includes('随笔') || name.includes('思考')) return `${name}与心得体会`
  if (name.includes('生活') || name.includes('日常')) return '日常生活点滴记录'
  if (name.includes('笔记') || name.includes('读书')) return '读书笔记与好书推荐'
  if (name.includes('实战') || name.includes('项目')) return '项目开发实战经验分享'
  if (name.includes('工具') || name.includes('效率')) return '工具与效率提升推荐'
  if (name.includes('推荐') || name.includes('好物')) return `${name}与经验分享`
  return `${name}相关内容分享`
}

const defaultTags = [
  { id: 1, tagName: 'Vue3' },
  { id: 2, tagName: 'JavaScript' },
  { id: 3, tagName: 'Node.js' },
  { id: 4, tagName: 'Docker' },
  { id: 5, tagName: 'React' },
  { id: 6, tagName: 'TypeScript' },
  { id: 7, tagName: 'CSS' },
  { id: 8, tagName: 'HTML5' },
  { id: 9, tagName: 'Vue2' },
  { id: 10, tagName: 'Spring Boot' },
  { id: 11, tagName: 'MySQL' },
  { id: 12, tagName: 'Redis' },
  { id: 13, tagName: 'Git' },
  { id: 14, tagName: 'Linux' },
  { id: 15, tagName: 'Nginx' },
  { id: 16, tagName: 'Kubernetes' },
  { id: 17, tagName: 'Python' },
  { id: 18, tagName: 'Java' },
  { id: 19, tagName: 'WebSocket' },
  { id: 20, tagName: 'RESTful' },
]

const loadCategories = () => {
  const saved = localStorage.getItem('blog_categories')
  if (saved) {
    const savedCategories = JSON.parse(saved)
    const merged = [...savedCategories]
    
    defaultCategories.forEach(dc => {
      if (!merged.find(c => c.categoryName === dc.categoryName)) {
        merged.push(dc)
      }
    })
    
    merged.forEach(cat => {
      if (!cat.categoryDescription || cat.categoryDescription === '暂无描述') {
        cat.categoryDescription = generateDescription(cat.categoryName)
      }
    })
    
    localStorage.setItem('blog_categories', JSON.stringify(merged))
    return merged
  }
  localStorage.setItem('blog_categories', JSON.stringify(defaultCategories))
  return [...defaultCategories]
}

const TAGS_VERSION = 'v2'

const loadTags = () => {
  const savedVersion = localStorage.getItem('blog_tags_version')
  const saved = localStorage.getItem('blog_tags')
  if (saved && savedVersion === TAGS_VERSION) {
    return JSON.parse(saved)
  }
  localStorage.setItem('blog_tags', JSON.stringify(defaultTags))
  localStorage.setItem('blog_tags_version', TAGS_VERSION)
  return [...defaultTags]
}

const loadArticles = () => {
  const saved = localStorage.getItem('blog_articles')
  if (saved) {
    return JSON.parse(saved)
  }
  return []
}

const saveCategories = (list) => {
  localStorage.setItem('blog_categories', JSON.stringify(list))
}

const saveTags = (list) => {
  localStorage.setItem('blog_tags', JSON.stringify(list))
}

const saveArticles = (list) => {
  localStorage.setItem('blog_articles', JSON.stringify(list))
}

const articleForm = ref({
  articleTitle: '',
  articleSummary: '',
  articleCover: '',
  categoryId: '',
  articleContent: '',
  isTop: false,
  isFeatured: false,
})

const categories = ref(loadCategories())
const tags = ref(loadTags())
const selectedTags = ref([])
const newTag = ref('')
const newCategoryName = ref('')
const previewImage = ref('')

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      articleForm.value.articleCover = base64
      previewImage.value = base64
    }
    reader.readAsDataURL(file)
  }
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag.id)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag.id)
  }
}

const addNewTag = () => {
  if (newTag.value.trim()) {
    const tagName = newTag.value.trim()
    const existingTag = tags.value.find(t => t.tagName === tagName)
    if (existingTag) {
      if (!selectedTags.value.includes(existingTag.id)) {
        selectedTags.value.push(existingTag.id)
      }
    } else {
      const newTagObj = { id: Date.now(), tagName: tagName }
      tags.value.push(newTagObj)
      saveTags(tags.value)
      selectedTags.value.push(newTagObj.id)
    }
    newTag.value = ''
  }
}

const addNewCategory = () => {
  if (newCategoryName.value.trim()) {
    const categoryName = newCategoryName.value.trim()
    const existingCategory = categories.value.find(c => c.categoryName === categoryName)
    if (existingCategory) {
      articleForm.value.categoryId = existingCategory.id
    } else {
      const newCategory = { 
        id: Date.now(), 
        categoryName: categoryName,
        categoryDescription: generateDescription(categoryName)
      }
      categories.value.push(newCategory)
      saveCategories(categories.value)
      articleForm.value.categoryId = newCategory.id
    }
    newCategoryName.value = ''
  }
}

const submitArticle = async () => {
  if (!articleForm.value.articleTitle || !articleForm.value.articleContent) {
    alert('请填写文章标题和内容')
    return
  }

  try {
    let selectedCategory = categories.value.find(c => c.id === articleForm.value.categoryId)
    
    if (!selectedCategory && articleForm.value.categoryId) {
      selectedCategory = categories.value.find(c => c.id === Number(articleForm.value.categoryId))
    }
    
    if (!selectedCategory) {
      const fallbackCategory = categories.value[0]
      if (fallbackCategory) {
        articleForm.value.categoryId = fallbackCategory.id
        selectedCategory = fallbackCategory
      }
    }
    
    const selectedTagNames = tags.value
      .filter(t => selectedTags.value.includes(t.id))
      .map(t => t.tagName)
    
    const newArticle = {
      id: Date.now(),
      articleTitle: articleForm.value.articleTitle,
      articleSummary: articleForm.value.articleSummary || '暂无摘要',
      articleCover: articleForm.value.articleCover || '',
      categoryName: selectedCategory ? selectedCategory.categoryName : '生活感悟',
      categoryId: articleForm.value.categoryId || (selectedCategory ? selectedCategory.id : ''),
      articleContent: articleForm.value.articleContent,
      isTop: articleForm.value.isTop,
      isFeatured: articleForm.value.isFeatured,
      tagNames: selectedTagNames,
      createTime: new Date().toISOString(),
      viewCount: 0,
      commentCount: 0,
    }
    
    const allArticles = loadArticles()
    allArticles.unshift(newArticle)
    saveArticles(allArticles)
    
    if (selectedCategory) {
      selectedCategory.articleCount = (selectedCategory.articleCount || 0) + 1
      saveCategories(categories.value)
    }
    
    alert('文章发布成功！')
    articleForm.value = {
      articleTitle: '',
      articleSummary: '',
      articleCover: '',
      categoryId: '',
      articleContent: '',
      isTop: false,
      isFeatured: false,
    }
    selectedTags.value = []
    previewImage.value = ''
    router.push('/articles')
  } catch (error) {
    console.error('Failed to submit article:', error)
    alert('文章发布失败：' + error.message)
  }
}

onMounted(() => {
  categories.value = loadCategories()
  tags.value = loadTags()
})
</script>
