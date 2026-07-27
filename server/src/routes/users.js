const express = require('express')
const router = express.Router()
const { query, get, run } = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'aurora-blog-secret-key-2024'

router.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = get('SELECT * FROM users WHERE username = ?', [username])
  if (!user) return res.status(400).json({ message: '用户不存在' })
  if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ message: '密码错误' })
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, role: user.role } })
})

router.post('/register', (req, res) => {
  const { username, password, email } = req.body
  const exists = get('SELECT id FROM users WHERE username = ?', [username])
  if (exists) return res.status(400).json({ message: '用户名已存在' })
  const hash = bcrypt.hashSync(password, 10)
  run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hash, email || ''])
  const newId = query('SELECT last_insert_rowid() as id')[0].id
  res.json({ message: '注册成功', id: newId })
})

router.post('/logout', (req, res) => {
  res.json({ message: '登出成功' })
})

router.get('/code', (req, res) => {
  res.json({ code: '123456' })
})

router.get('/info', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: '未登录' })
  try {
    const decoded = jwt.verify(authHeader.replace('Bearer ', ''), JWT_SECRET)
    const user = get('SELECT id, username, email, avatar, role FROM users WHERE id = ?', [decoded.id])
    res.json(user)
  } catch (e) {
    res.status(401).json({ message: '登录已过期' })
  }
})

module.exports = router
