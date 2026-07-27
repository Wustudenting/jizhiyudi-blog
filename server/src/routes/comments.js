const express = require('express')
const router = express.Router()
const { query, run } = require('../db')

router.get('/', (req, res) => {
  const { articleId } = req.query
  let comments
  if (articleId) {
    comments = query('SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC', [articleId])
  } else {
    comments = query('SELECT * FROM comments ORDER BY created_at DESC LIMIT 50')
  }
  res.json(comments)
})

router.get('/topSix', (req, res) => {
  const comments = query('SELECT * FROM comments ORDER BY created_at DESC LIMIT 6')
  res.json(comments)
})

router.get('/:id/replies', (req, res) => {
  const replies = query('SELECT * FROM comments WHERE parent_id = ? ORDER BY created_at ASC', [req.params.id])
  res.json(replies)
})

router.post('/save', (req, res) => {
  const { article_id, user_id, nickname, avatar, content, parent_id, reply_to } = req.body
  run('INSERT INTO comments (article_id, user_id, nickname, avatar, content, parent_id, reply_to) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [article_id, user_id || null, nickname || '匿名', avatar || '', content, parent_id || 0, reply_to || ''])
  const newId = query('SELECT last_insert_rowid() as id')[0].id
  res.json({ message: '评论成功', id: newId })
})

router.delete('/:id', (req, res) => {
  run('DELETE FROM comments WHERE id = ?', [req.params.id])
  res.json({ message: '删除成功' })
})

module.exports = router
