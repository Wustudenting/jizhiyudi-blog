import { blogApi } from './api'

const TIMEOUT = 3000

async function withFallback(apiFn, localStorageKey, transform) {
  try {
    const result = await Promise.race([
      apiFn(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT))
    ])
    return transform ? transform(result) : result
  } catch (e) {
    const saved = localStorage.getItem(localStorageKey)
    if (saved) return JSON.parse(saved)
    return transform ? transform([]) : null
  }
}

export const dataService = {
  async getArticles() {
    return withFallback(blogApi.getArticles, 'blog_articles')
  },
  async getArticleById(id) {
    return withFallback(() => blogApi.getArticleById(id), null)
  },
  async getCategories() {
    return withFallback(blogApi.getCategories, 'blog_categories')
  },
  async getTags() {
    return withFallback(blogApi.getTags, 'blog_tags')
  },
  async getTopTenTags() {
    return withFallback(blogApi.getTopTenTags, 'blog_tags')
  },
  async getTalks() {
    return withFallback(blogApi.getTalks, 'blog_talks')
  },
  async getComments(articleId) {
    return withFallback(() => blogApi.getComments({ articleId }), `blog_comments_${articleId}`)
  },
  async getTopSixComments() {
    return withFallback(blogApi.getTopSixComments, 'blog_comments')
  },
  async getArchives() {
    return withFallback(blogApi.getArchives, 'blog_articles')
  },
  async getFriendLinks() {
    return withFallback(blogApi.getFriendLinks, 'blog_links')
  },
  async getArticlesByTag(tagId) {
    return withFallback(() => blogApi.getArticlesByTag(tagId), 'blog_articles')
  },
  async getArticlesByCategory(categoryId) {
    return withFallback(() => blogApi.getArticlesByCategory(categoryId), 'blog_articles')
  },
  async getTopAndFeatured() {
    return withFallback(blogApi.getTopAndFeatured, 'blog_articles')
  },
  async getAbout() {
    return withFallback(blogApi.getAbout, 'blog_about')
  },
  async saveComment(data) {
    try {
      return await blogApi.saveComment(data)
    } catch (e) {
      const saved = JSON.parse(localStorage.getItem(`blog_comments_${data.article_id}`) || '[]')
      saved.unshift({ ...data, id: Date.now(), created_at: new Date().toISOString() })
      localStorage.setItem(`blog_comments_${data.article_id}`, JSON.stringify(saved))
      return { message: '评论成功(离线)' }
    }
  },
  async saveTalk(data) {
    try {
      return await blogApi.saveTalk(data)
    } catch (e) {
      const saved = JSON.parse(localStorage.getItem('blog_talks') || '[]')
      saved.unshift({ ...data, id: Date.now(), created_at: new Date().toISOString() })
      localStorage.setItem('blog_talks', JSON.stringify(saved))
      return { message: '发布成功(离线)' }
    }
  }
}
