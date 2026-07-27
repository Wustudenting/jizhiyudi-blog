const express = require('express')
const router = express.Router()
const { query, run } = require('../db')

router.get('/', (req, res) => {
  const links = query('SELECT * FROM links ORDER BY created_at DESC')
  res.json(links)
})

router.post('/save', (req, res) => {
  const { name, url, logo, description, id } = req.body
  if (id) {
    run('UPDATE links SET name=?, url=?, logo=?, description=? WHERE id=?', [name, url, logo, description, id])
    res.json({ message: '更新成功', id })
  } else {
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', [name, url, logo, description])
    const newId = query('SELECT last_insert_rowid() as id')[0].id
    res.json({ message: '创建成功', id: newId })
  }
})

router.delete('/:id', (req, res) => {
  run('DELETE FROM links WHERE id = ?', [req.params.id])
  res.json({ message: '删除成功' })
})

module.exports = router
