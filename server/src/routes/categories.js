const express = require('express')
const router = express.Router()
const { query, run } = require('../db')

router.get('/all', (req, res) => {
  const categories = query("SELECT c.*, (SELECT COUNT(*) FROM articles WHERE category_id = c.id AND status = 'published') as count FROM categories c")
  res.json(categories)
})

router.post('/save', (req, res) => {
  const { name, description, id } = req.body
  if (id) {
    run('UPDATE categories SET name=?, description=? WHERE id=?', [name, description, id])
    res.json({ message: '更新成功', id })
  } else {
    run('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)', [name, description])
    const newId = query('SELECT last_insert_rowid() as id')[0].id
    res.json({ message: '创建成功', id: newId })
  }
})

router.delete('/:id', (req, res) => {
  run('DELETE FROM categories WHERE id = ?', [req.params.id])
  res.json({ message: '删除成功' })
})

module.exports = router
