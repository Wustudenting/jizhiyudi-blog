import { dataService } from './dataService'
import { blogApi } from './api'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function isAlreadyMappedArticle(article) {
  return article && article.tagNames !== undefined && article.articleTitle !== undefined
}

function mapArticleFromBackend(a) {
  return {
    id: a.id,
    articleTitle: a.title || a.articleTitle || '',
    articleSummary: a.summary || a.articleSummary || '',
    content: a.content || '',
    articleCover: a.cover || a.articleCover || '',
    categoryId: a.category_id ?? a.categoryId,
    categoryName: a.category ? a.category.name : (a.categoryName || '未分类'),
    createTime: a.created_at || a.createTime,
    viewCount: a.view_count ?? a.viewCount ?? 0,
    likeCount: a.like_count ?? a.likeCount ?? 0,
    isTop: a.is_top ?? a.isTop ?? 0,
    isFeatured: a.is_featured ?? a.isFeatured ?? 0,
    tagNames: (a.tags || []).map(t => t.name || t.tagName || '').filter(Boolean),
    status: a.status || 'published',
  }
}

function mapCategoryFromBackend(c) {
  return {
    id: c.id,
    categoryName: c.name || c.categoryName || '',
    categoryDescription: c.description || c.categoryDescription || '',
    articleCount: c.count ?? c.articleCount ?? 0,
  }
}

function mapTagFromBackend(t) {
  return {
    id: t.id,
    tagName: t.name || t.tagName || '',
  }
}

function mapLinkFromBackend(l) {
  return {
    id: l.id,
    linkName: l.name || l.linkName || '',
    linkUrl: l.url || l.linkUrl || '',
    linkLogo: l.logo || l.linkLogo || '',
    linkDescription: l.description || l.linkDescription || '',
  }
}

async function fetchWithTimeout(fn, timeout = 3000) {
  try {
    const result = await Promise.race([
      fn(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
    ])
    return result
  } catch (e) {
    return null
  }
}

export async function syncFromServer() {
  try {
    const [rawArticles, rawCategories, rawTags, rawTalks, rawLinks] = await Promise.all([
      fetchWithTimeout(() => blogApi.getArticles()),
      fetchWithTimeout(() => blogApi.getCategories()),
      fetchWithTimeout(() => blogApi.getTopTenTags()),
      fetchWithTimeout(() => blogApi.getTalks()),
      fetchWithTimeout(() => blogApi.getFriendLinks()),
    ])

    if (rawArticles && Array.isArray(rawArticles) && rawArticles.length > 0) {
      const existing = JSON.parse(localStorage.getItem('blog_articles') || '[]')
      const mapped = rawArticles.map(a => {
        const mappedArticle = mapArticleFromBackend(a)
        const localArticle = existing.find(e => 
          (e.id != null && e.id === mappedArticle.id) ||
          ((e.articleTitle || e.title || '').trim().toLowerCase() === (mappedArticle.articleTitle || '').trim().toLowerCase())
        )
        if (localArticle) {
          if ((localArticle.viewCount || 0) > (mappedArticle.viewCount || 0)) {
            mappedArticle.viewCount = localArticle.viewCount
          }
          if (localArticle._synced) {
            mappedArticle._synced = true
          }
          if (localArticle.tags && (!mappedArticle.tagNames || mappedArticle.tagNames.length === 0)) {
            mappedArticle.tagNames = localArticle.tagNames || []
          }
          if (localArticle._localId) {
            mappedArticle._localId = localArticle._localId
          }
        }
        return mappedArticle
      })

      const backendIds = new Set(mapped.map(m => m.id))
      const backendTitles = new Set(mapped.map(m => (m.articleTitle || '').trim().toLowerCase()))

      const localOnly = []
      const processedIds = new Set()
      
      for (const e of existing) {
        if (!e) continue
        const eId = e.id
        const eTitle = (e.articleTitle || e.title || '').trim().toLowerCase()
        
        if (eId != null && backendIds.has(eId)) {
          processedIds.add(eId)
          continue
        }
        
        if (eTitle && backendTitles.has(eTitle)) {
          processedIds.add(eId)
          const matched = mapped.find(m => (m.articleTitle || '').trim().toLowerCase() === eTitle)
          if (matched) {
            if (e.viewCount > matched.viewCount) {
              matched.viewCount = e.viewCount
            }
            if (e._synced) {
              matched._synced = true
            }
            if (e.tags && (!matched.tagNames || matched.tagNames.length === 0)) {
              matched.tagNames = e.tagNames || []
            }
            if (!matched._localId && eId) {
              matched._localId = eId
            }
          }
          continue
        }
        
        localOnly.push(e)
      }

      const finalArticles = [...mapped, ...localOnly]
      const titleMap = new Map()
      const dedupedFinal = finalArticles.filter(a => {
        if (!a) return false
        const key = (a.articleTitle || a.title || '').trim().toLowerCase()
        if (!key) return true
        if (titleMap.has(key)) {
          const existing = titleMap.get(key)
          const existingIsBackend = existing.id != null && existing.id > 0 && !String(existing.id).startsWith('tmp')
          const currentIsBackend = a.id != null && a.id > 0 && !String(a.id).startsWith('tmp')
          if (existingIsBackend && !currentIsBackend) {
            return false
          }
          if (!existingIsBackend && currentIsBackend) {
            titleMap.set(key, a)
            return true
          }
          return false
        }
        titleMap.set(key, a)
        return true
      })
      localStorage.setItem('blog_articles', JSON.stringify(dedupedFinal))
    }

    if (rawCategories && Array.isArray(rawCategories) && rawCategories.length > 0) {
      const mapped = rawCategories.map(c => mapCategoryFromBackend(c))
      localStorage.setItem('blog_categories', JSON.stringify(mapped))
    }

    if (rawTags && Array.isArray(rawTags) && rawTags.length > 0) {
      const mapped = rawTags.map(t => mapTagFromBackend(t))
      localStorage.setItem('blog_tags', JSON.stringify(mapped))
      localStorage.setItem('blog_tags_version', 'v3')
    }

    if (rawTalks && Array.isArray(rawTalks)) {
      const existing = JSON.parse(localStorage.getItem('blog_talks') || '[]')
      const mapped = rawTalks.map(t => {
        const saved = existing.find(e => e.id === t.id)
        if (t.talkContent !== undefined) {
          return {
            id: t.id,
            talkContent: t.talkContent,
            talkImages: t.talkImages || [],
            nickname: t.nickname || '匿名',
            avatar: t.avatar || '',
            createTime: t.createTime,
            likeCount: t.likeCount || 0,
            liked: t.liked || false,
            comments: t.comments || [],
          }
        }
        return {
          id: t.id,
          talkContent: t.content,
          talkImages: t.images ? (Array.isArray(t.images) ? t.images : (typeof t.images === 'string' ? t.images.split(',').filter(Boolean) : [])) : [],
          nickname: t.nickname || '匿名',
          avatar: t.avatar || '',
          createTime: t.created_at,
          likeCount: saved ? (saved.likeCount || t.like_count || 0) : (t.like_count || 0),
          liked: saved ? (saved.liked || false) : false,
          comments: saved ? (saved.comments || []) : [],
        }
      })
      const existingOnly = existing.filter(e => !rawTalks.find(t => t.id === e.id))
      localStorage.setItem('blog_talks', JSON.stringify([...existingOnly, ...mapped]))
    }

    if (rawLinks && Array.isArray(rawLinks)) {
      const existing = JSON.parse(localStorage.getItem('blog_links') || '[]')
      const mapped = rawLinks
        .map(l => mapLinkFromBackend(l))
        .filter(l => l && l.linkName && l.linkName.trim())
      const existingOnly = existing.filter(e => e && e.linkName && e.linkName.trim() && !mapped.find(m => m.id === e.id))
      localStorage.setItem('blog_links', JSON.stringify([...mapped, ...existingOnly]))
    }

    return true
  } catch (e) {
    console.warn('API sync failed, using localStorage:', e.message)
    return false
  }
}

export async function syncArticleDetail(articleId) {
  try {
    const article = await dataService.getArticleById(articleId)
    if (article) {
      const mapped = isAlreadyMappedArticle(article) ? article : mapArticleFromBackend(article)
      const saved = JSON.parse(localStorage.getItem('blog_articles') || '[]')
      const idx = saved.findIndex(a => a.id === articleId)
      if (idx >= 0) {
        const merged = { ...saved[idx], ...mapped }
        if (saved[idx].viewCount > mapped.viewCount) {
          merged.viewCount = saved[idx].viewCount
        }
        if (saved[idx]._synced) {
          merged._synced = true
        }
        saved[idx] = merged
      } else {
        saved.unshift(mapped)
      }
      localStorage.setItem('blog_articles', JSON.stringify(saved))
      return mapped
    }
  } catch (e) {
    console.warn('Article detail sync failed:', e.message)
  }
  return null
}

export async function syncComments(articleId) {
  try {
    const comments = await dataService.getComments({ articleId })
    if (comments && Array.isArray(comments)) {
      const mapped = comments.map(c => ({
        id: c.id,
        articleId: c.article_id,
        userId: c.user_id,
        nickname: c.nickname || '匿名',
        avatar: c.avatar || '',
        commentContent: c.content,
        parentId: c.parent_id || 0,
        replyTo: c.reply_to || '',
        createTime: c.created_at,
        replies: [],
      }))
      const localSaved = localStorage.getItem(`blog_comments_${articleId}`)
      if (localSaved) {
        try {
          const localComments = JSON.parse(localSaved)
          const backendIds = new Set(mapped.map(m => m.id))
          const localOnly = localComments.filter(lc => {
            if (!lc) return false
            if (lc.id != null && backendIds.has(lc.id)) return false
            const lcContent = (lc.commentContent || '').trim()
            if (!lcContent) return false
            const existsInBackend = mapped.some(m =>
              (m.commentContent || '').trim() === lcContent &&
              m.nickname === lc.nickname
            )
            return !existsInBackend
          })
          const merged = [...mapped, ...localOnly]
          localStorage.setItem(`blog_comments_${articleId}`, JSON.stringify(merged))
          return merged
        } catch (e) {
          localStorage.setItem(`blog_comments_${articleId}`, JSON.stringify(mapped))
          return mapped
        }
      }
      localStorage.setItem(`blog_comments_${articleId}`, JSON.stringify(mapped))
      return mapped
    }
  } catch (e) {
    console.warn('Comments sync failed:', e.message)
  }
  return null
}
