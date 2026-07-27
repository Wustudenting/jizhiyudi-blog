const express = require('express')
const router = express.Router()
const { query, run } = require('../db')

router.get('/all', (req, res) => {
  const tags = query('SELECT t.*, (SELECT COUNT(*) FROM article_tags WHERE tag_id = t.id) as count FROM tags t ORDER BY t.id')
  res.json(tags)
})

router.get('/topTen', (req, res) => {
  const tags = query('SELECT t.*, COUNT(at.article_id) as count FROM tags t LEFT JOIN article_tags at ON t.id = at.tag_id GROUP BY t.id ORDER BY count DESC LIMIT 10')
  res.json(tags)
})

router.post('/save', (req, res) => {
  const { name, id } = req.body
  if (id) {
    run('UPDATE tags SET name=? WHERE id=?', [name, id])
    res.json({ message: '更新成功', id })
  } else {
    run('INSERT OR IGNORE INTO tags (name) VALUES (?)', [name])
    const newId = query('SELECT last_insert_rowid() as id')[0].id
    res.json({ message: '创建成功', id: newId })
  }
})

router.delete('/:id', (req, res) => {
  run('DELETE FROM tags WHERE id = ?', [req.params.id])
  res.json({ message: '删除成功' })
})

module.exports = router
