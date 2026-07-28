import request from './axios'

export const blogApi = {
  getHomeInfo: () => request.get('/'),
  getAbout: () => request.get('/about'),
  getArticles: () => request.get('/articles/all'),
  getArticleById: (id) => request.get(`/articles/${id}`),
  getArticlesByCategory: (id) => request.get(`/articles/categoryId?categoryId=${id}`),
  getArticlesByTag: (id) => request.get(`/articles/all?tagId=${id}`),
  getTopAndFeatured: () => request.get('/articles/topAndFeatured'),
  searchArticles: (keyword) => request.get(`/articles/search?keyword=${keyword}`),
  saveArticle: (data) => request.post('/articles/save', data),
  getArchives: () => request.get('/archives/all'),
  getCategories: () => request.get('/categories/all'),
  getTags: () => request.get('/tags/all'),
  getTopTenTags: () => request.get('/tags/topTen'),
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
