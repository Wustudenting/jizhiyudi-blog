import { dataService } from './dataService'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export async function syncFromServer() {
  try {
    const results = await Promise.allSettled([
      dataService.getArticles(),
      dataService.getCategories(),
      dataService.getTopTenTags(),
      dataService.getTalks(),
      dataService.getFriendLinks(),
    ])

    const [articles, categories, tags, talks, links] = results.map(r => r.status === 'fulfilled' ? r.value : null)

    if (articles && Array.isArray(articles) && articles.length > 0) {
      const mapped = articles.map(a => ({
        id: a.id,
        articleTitle: a.title,
        articleSummary: a.summary,
        content: a.content,
        articleCover: a.cover || '',
        categoryId: a.category_id,
        categoryName: a.category ? a.category.name : '未分类',
        createTime: a.created_at,
        viewCount: a.view_count || 0,
        likeCount: a.like_count || 0,
        isTop: a.is_top,
        isFeatured: a.is_featured,
        tagNames: (a.tags || []).map(t => t.name),
        status: a.status,
      }))
      localStorage.setItem('blog_articles', JSON.stringify(mapped))
    }

    if (categories && Array.isArray(categories) && categories.length > 0) {
      const mapped = categories.map(c => ({
        id: c.id,
        categoryName: c.name,
        categoryDescription: c.description || '',
        articleCount: c.count || 0,
      }))
      localStorage.setItem('blog_categories', JSON.stringify(mapped))
    }

    if (tags && Array.isArray(tags) && tags.length > 0) {
      const mapped = tags.map(t => ({
        id: t.id,
        tagName: t.name,
      }))
      localStorage.setItem('blog_tags', JSON.stringify(mapped))
      localStorage.setItem('blog_tags_version', 'v2')
    }

    if (talks && Array.isArray(talks)) {
      const mapped = talks.map(t => ({
        id: t.id,
        talkContent: t.content,
        talkImages: t.images ? (Array.isArray(t.images) ? t.images : (typeof t.images === 'string' ? t.images.split(',').filter(Boolean) : [])) : [],
        nickname: t.nickname || '匿名',
        avatar: t.avatar || '',
        createTime: t.created_at,
        likeCount: t.like_count || 0,
        liked: false,
        comments: [],
      }))
      localStorage.setItem('blog_talks', JSON.stringify(mapped))
    }

    if (links && Array.isArray(links)) {
      const mapped = links.map(l => ({
        id: l.id,
        linkName: l.name,
        linkUrl: l.url,
        linkLogo: l.logo || '',
        linkDescription: l.description || '',
      }))
      localStorage.setItem('blog_links', JSON.stringify(mapped))
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
      const mapped = {
        id: article.id,
        articleTitle: article.title,
        articleSummary: article.summary,
        content: article.content,
        articleCover: article.cover || '',
        categoryId: article.category_id,
        categoryName: article.category ? article.category.name : '未分类',
        createTime: article.created_at,
        viewCount: article.view_count || 0,
        likeCount: article.like_count || 0,
        tagNames: (article.tags || []).map(t => t.name),
      }
      const saved = JSON.parse(localStorage.getItem('blog_articles') || '[]')
      const idx = saved.findIndex(a => a.id === articleId)
      if (idx >= 0) {
        saved[idx] = { ...saved[idx], ...mapped }
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
      localStorage.setItem(`blog_comments_${articleId}`, JSON.stringify(mapped))
      return mapped
    }
  } catch (e) {
    console.warn('Comments sync failed:', e.message)
  }
  return null
}
