import request from './axios'
import { yuqueApi } from './yuqueApi'

/**
 * 文章相关接口优先走语雀静态数据（见 yuqueApi.js）。
 *
 * 如果 /yuque/index.json 还不存在（也就是还没跑过 `npm run sync:yuque`），
 * 自动回退到原来的后端接口 —— 这样同步之前本地开发不会被卡住，
 * 后端真部署起来之后也能继续用。
 */
const preferYuque = (yuqueFn, backendFn) => async (...args) => {
  try {
    return await yuqueFn(...args)
  } catch (err) {
    console.warn('[yuque] 语雀数据不可用，回退到后端接口：', err.message)
    return backendFn(...args)
  }
}

export const blogApi = {
  getHomeInfo: async () => {
    try {
      const [{ top, featured }, categories, talks] = await Promise.all([
        yuqueApi.getTopAndFeatured(),
        yuqueApi.getCategories(),
        request.get('/talks').catch(() => []),
      ])
      // 语雀文档没有标签概念，标签这块暂时留空
      return { top, featured, categories, tags: [], talks }
    } catch (err) {
      console.warn('[yuque] 语雀数据不可用，回退到后端接口：', err.message)
      return request.get('/')
    }
  },
  getAbout: () => request.get('/about'),

  getArticles: preferYuque(yuqueApi.getArticles, () => request.get('/articles/all')),
  getArticleById: preferYuque(yuqueApi.getArticleById, (id) => request.get(`/articles/${id}`)),
  getArticlesByCategory: preferYuque(
    yuqueApi.getArticlesByCategory,
    (id) => request.get(`/articles/categoryId?categoryId=${id}`),
  ),
  getTopAndFeatured: preferYuque(yuqueApi.getTopAndFeatured, () =>
    request.get('/articles/topAndFeatured'),
  ),
  searchArticles: preferYuque(yuqueApi.searchArticles, (keyword) =>
    request.get(`/articles/search?keyword=${keyword}`),
  ),
  getArchives: preferYuque(yuqueApi.getArchives, () => request.get('/archives/all')),
  getCategories: preferYuque(yuqueApi.getCategories, () => request.get('/categories/all')),

  // 以下仍走原后端：语雀没有对应的概念，或属于独立功能
  getArticlesByTag: (id) => request.get(`/articles/all?tagId=${id}`),
  getTags: () => request.get('/tags/all'),
  getTopTenTags: () => request.get('/tags/topTen'),
  saveArticle: (data) => request.post('/articles/save', data),
  deleteArticle: (id) => request.delete(`/articles/${id}`),
  getTalks: () => request.get('/talks'),
  getTalkById: (id) => request.get(`/talks/${id}`),
  getComments: (params) => request.get('/comments', { params }),
  getReplies: (commentId) => request.get(`/comments/${commentId}/replies`),
  getTopSixComments: () => request.get('/comments/topSix'),
  saveComment: (data) => request.post('/comments/save', data),
  getFriendLinks: () => request.get('/links'),
  reportVisitor: () => request.post('/report'),
}

export const authApi = {
  login: (data) => request.post('/users/login', data),
  register: (data) => request.post('/users/register', data),
  logout: () => request.post('/users/logout'),
  sendCode: (username) => request.get(`/users/code?username=${username}`),
}
