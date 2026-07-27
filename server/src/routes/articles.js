const express = require('express')
const router = express.Router()
const { query, run, get } = require('../db')

router.get('/', (req, res) => {
  const featured = query("SELECT * FROM articles WHERE is_featured = 1 AND status = 'published' LIMIT 5")
  const top = query("SELECT * FROM articles WHERE is_top = 1 AND status = 'published' LIMIT 5")
  const categories = query("SELECT c.*, (SELECT COUNT(*) FROM articles WHERE category_id = c.id) as count FROM categories c")
  const tags = query("SELECT t.*, (SELECT COUNT(*) FROM article_tags WHERE tag_id = t.id) as count FROM tags t ORDER BY count DESC LIMIT 10")
  const talks = query('SELECT * FROM talks ORDER BY created_at DESC LIMIT 5')
  res.json({ featured, top, categories, tags, talks })
})

router.get('/about', (req, res) => {
  const about = get('SELECT * FROM about ORDER BY id DESC LIMIT 1')
  res.json(about || { content: '' })
})

router.get('/articles/all', (req, res) => {
  const { categoryId, tagId, keyword, sort = 'latest' } = req.query
  let where = "WHERE status = 'published'"
  const params = []

  if (categoryId) {
    where += ' AND category_id = ?'
    params.push(categoryId)
  }
  if (keyword) {
    where += ' AND (title LIKE ? OR content LIKE ?)'
    params.push(`%${keyword}%`, `%${keyword}%`)
  }

  let order = 'ORDER BY created_at DESC'
  if (sort === 'views') order = 'ORDER BY view_count DESC'
  else if (sort === 'likes') order = 'ORDER BY like_count DESC'

  let articles = query(`SELECT * FROM articles ${where} ${order}`, params)

  if (tagId) {
    articles = articles.filter(a => {
      const tagRows = query('SELECT tag_id FROM article_tags WHERE article_id = ?', [a.id])
      return tagRows.some(t => t.tag_id === parseInt(tagId))
    })
  }

  articles.forEach(a => {
    a.tags = query('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?', [a.id])
  })

  res.json(articles)
})

router.get('/articles/topAndFeatured', (req, res) => {
  const top = query("SELECT * FROM articles WHERE is_top = 1 AND status = 'published' ORDER BY view_count DESC LIMIT 5")
  const featured = query("SELECT * FROM articles WHERE is_featured = 1 AND status = 'published' ORDER BY created_at DESC LIMIT 5")
  res.json({ top, featured })
})

router.get('/articles/search', (req, res) => {
  const { keyword } = req.query
  const articles = query("SELECT * FROM articles WHERE (title LIKE ? OR content LIKE ?) AND status = 'published' ORDER BY created_at DESC", [`%${keyword}%`, `%${keyword}%`])
  articles.forEach(a => {
    a.tags = query('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?', [a.id])
  })
  res.json(articles)
})

router.get('/articles/categoryId', (req, res) => {
  const { categoryId } = req.query
  const articles = query("SELECT * FROM articles WHERE category_id = ? AND status = 'published' ORDER BY created_at DESC", [categoryId])
  articles.forEach(a => {
    a.tags = query('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?', [a.id])
  })
  res.json(articles)
})

router.get('/articles/:id', (req, res) => {
  const article = get('SELECT * FROM articles WHERE id = ?', [req.params.id])
  if (!article) return res.status(404).json({ message: '文章不存在' })
  run('UPDATE articles SET view_count = view_count + 1 WHERE id = ?', [req.params.id])
  article.view_count = (article.view_count || 0) + 1
  article.tags = query('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?', [article.id])
  article.category = get('SELECT * FROM categories WHERE id = ?', [article.category_id])
  res.json(article)
})

router.post('/articles/save', (req, res) => {
  const { title, summary, content, cover, category_id, tags, is_top, is_featured, id } = req.body
  if (id) {
    run('UPDATE articles SET title=?, summary=?, content=?, cover=?, category_id=?, is_top=?, is_featured=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
      [title, summary, content, cover, category_id, is_top || 0, is_featured || 0, id])
    run('DELETE FROM article_tags WHERE article_id = ?', [id])
    if (tags && tags.length) {
      tags.forEach(t => {
        try { run('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)', [id, t]) } catch (e) {}
      })
    }
    res.json({ message: '更新成功', id })
  } else {
    run('INSERT INTO articles (title, summary, content, cover, category_id) VALUES (?, ?, ?, ?, ?)',
      [title, summary, content, cover, category_id])
    const newId = query('SELECT last_insert_rowid() as id')[0].id
    if (tags && tags.length) {
      tags.forEach(t => {
        try { run('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)', [newId, t]) } catch (e) {}
      })
    }
    res.json({ message: '创建成功', id: newId })
  }
})

router.post('/articles/:id/like', (req, res) => {
  run('UPDATE articles SET like_count = like_count + 1 WHERE id = ?', [req.params.id])
  const article = get('SELECT like_count FROM articles WHERE id = ?', [req.params.id])
  res.json({ like_count: article.like_count })
})

router.get('/archives/all', (req, res) => {
  const articles = query("SELECT id, title, created_at FROM articles WHERE status = 'published' ORDER BY created_at DESC")
  const grouped = {}
  articles.forEach(a => {
    const date = new Date(a.created_at)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const key = `${year}-${month}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(a)
  })
  res.json(grouped)
})

module.exports = router
