const express = require('express')
const router = express.Router()
const { query, run, get } = require('../db')

router.get('/', (req, res) => {
  const talks = query('SELECT * FROM talks ORDER BY created_at DESC')
  res.json(talks)
})

router.get('/:id', (req, res) => {
  const talk = get('SELECT * FROM talks WHERE id = ?', [req.params.id])
  if (!talk) return res.status(404).json({ message: '说说不存在' })
  res.json(talk)
})

router.post('/save', (req, res) => {
  const { content, images, nickname, avatar } = req.body
  run('INSERT INTO talks (content, images, nickname, avatar) VALUES (?, ?, ?, ?)',
    [content, images || '', nickname || '匿名', avatar || ''])
  const newId = query('SELECT last_insert_rowid() as id')[0].id
  res.json({ message: '发布成功', id: newId })
})

router.delete('/:id', (req, res) => {
  run('DELETE FROM talks WHERE id = ?', [req.params.id])
  res.json({ message: '删除成功' })
})

module.exports = router
