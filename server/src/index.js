const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const articlesRouter = require('./routes/articles')
const categoriesRouter = require('./routes/categories')
const tagsRouter = require('./routes/tags')
const commentsRouter = require('./routes/comments')
const talksRouter = require('./routes/talks')
const linksRouter = require('./routes/links')
const usersRouter = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/', articlesRouter)
app.use('/categories', categoriesRouter)
app.use('/tags', tagsRouter)
app.use('/comments', commentsRouter)
app.use('/talks', talksRouter)
app.use('/links', linksRouter)
app.use('/users', usersRouter)

app.post('/report', (req, res) => {
  const { run } = require('./db')
  const { ip, userAgent, path: pagePath } = req.body
  try {
    run('INSERT INTO visitors (ip, user_agent, path) VALUES (?, ?, ?)', [ip || req.ip, userAgent || req.headers['user-agent'], pagePath || ''])
  } catch (e) {
    console.warn('Report error:', e.message)
  }
  res.json({ message: 'ok' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 机智的鱼博客后端服务已启动:`)
  console.log(`   本地访问: http://localhost:${PORT}`)
  console.log(`   健康检查: http://localhost:${PORT}/health\n`)
})
