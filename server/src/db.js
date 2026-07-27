const initSqlJs = require('sql.js')
const fs = require('fs')
const path = require('path')

let db = null

async function initDB() {
  const SQL = await initSqlJs()
  const dbPath = path.join(__dirname, '..', 'data', 'blog.db')
  const dataDir = path.dirname(dbPath)
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      avatar TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT,
      content TEXT,
      cover TEXT,
      category_id INTEGER,
      author_id INTEGER,
      view_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      is_top INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (article_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      user_id INTEGER,
      nickname TEXT,
      avatar TEXT,
      content TEXT NOT NULL,
      parent_id INTEGER DEFAULT 0,
      reply_to TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS talks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      images TEXT,
      nickname TEXT DEFAULT '匿名',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      logo TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      user_agent TEXT,
      path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS about (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  seedData()
  saveDB()

  setInterval(saveDB, 5000)
}

function saveDB() {
  if (!db) return
  const dbPath = path.join(__dirname, '..', 'data', 'blog.db')
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbPath, buffer)
}

function query(sql, params) {
  if (!db) throw new Error('Database not initialized')
  const stmt = db.prepare(sql)
  if (params && params.length) stmt.bind(params)
  const results = []
  while (stmt.step()) results.push(stmt.getAsObject())
  stmt.free()
  return results
}

function run(sql, params) {
  if (!db) throw new Error('Database not initialized')
  db.run(sql, params)
}

function get(sql, params) {
  const results = query(sql, params)
  return results.length > 0 ? results[0] : null
}

function seedData() {
  const userCount = query('SELECT COUNT(*) as count FROM users')[0].count
  if (userCount === 0) {
    const bcrypt = require('bcryptjs')
    run('INSERT INTO users (username, password, email, avatar, role) VALUES (?, ?, ?, ?, ?)', ['admin', bcrypt.hashSync('admin123', 10), 'admin@example.com', '', 'admin'])
    run('INSERT INTO users (username, password, email, avatar, role) VALUES (?, ?, ?, ?, ?)', ['witty', bcrypt.hashSync('123456', 10), 'witty@example.com', '', 'user'])
  }

  const catCount = query('SELECT COUNT(*) as count FROM categories')[0].count
  if (catCount === 0) {
    const cats = [
      ['前端', '前端开发技术分享'],
      ['后端', '后端开发技术分享'],
      ['生活', '生活随笔与感悟'],
      ['学习', '学习笔记与知识总结'],
      ['项目', '项目实战经验']
    ]
    cats.forEach(c => run('INSERT INTO categories (name, description) VALUES (?, ?)', c))
  }

  const tagCount = query('SELECT COUNT(*) as count FROM tags')[0].count
  if (tagCount === 0) {
    const tags = ['Vue3', 'JavaScript', 'CSS', 'Node.js', 'Express', 'Tailwind', 'Vite', 'SQLite', '生活', '随笔']
    tags.forEach(t => run('INSERT INTO tags (name) VALUES (?)', [t]))
  }

  const artCount = query('SELECT COUNT(*) as count FROM articles')[0].count
  if (artCount === 0) {
    const articles = [
      ['Vue 3 组合式 API 详解', '深入理解 Vue 3 的组合式 API 使用方法', '# Vue 3 组合式 API\n\nVue 3 的组合式 API 提供了更灵活的代码组织方式...', 1, 128, 1],
      ['Tailwind CSS 实战技巧', '分享 Tailwind CSS 在项目中的实用技巧', '# Tailwind CSS 实战\n\nTailwind CSS 是一个实用优先的 CSS 框架...', 1, 256, 1],
      ['Node.js Express 入门', '从零开始学习 Node.js Express 框架', '# Express 入门\n\nExpress 是最流行的 Node.js Web 框架...', 2, 89, 0],
      ['我的前端学习之路', '记录我的前端学习历程与心得体会', '# 学习之路\n\n从零基础到能够独立开发项目...', 4, 456, 1],
      ['生活中的小确幸', '记录生活中的美好瞬间', '# 生活随笔\n\n生活中总有一些让人感到幸福的瞬间...', 3, 67, 0],
      ['Vite 构建优化', 'Vite 项目的构建优化实践', '# Vite 优化\n\nVite 是新一代前端构建工具...', 1, 192, 0]
    ]
    articles.forEach(a => run('INSERT INTO articles (title, summary, content, category_id, view_count, is_featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [...a, 'published']))
  }

  const tagArtCount = query('SELECT COUNT(*) as count FROM article_tags')[0].count
  if (tagArtCount === 0) {
    const tags = query('SELECT id FROM tags')
    const articles = query('SELECT id FROM articles')
    articles.forEach(a => {
      const count = 2 + Math.floor(Math.random() * 3)
      const shuffled = [...tags].sort(() => 0.5 - Math.random())
      for (let i = 0; i < count; i++) {
        try {
          run('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)', [a.id, shuffled[i].id])
        } catch (e) {}
      }
    })
  }

  const talkCount = query('SELECT COUNT(*) as count FROM talks')[0].count
  if (talkCount === 0) {
    run('INSERT INTO talks (content, nickname, avatar) VALUES (?, ?, ?)', ['欢迎来到我的博客！', '机智的鱼', ''])
    run('INSERT INTO talks (content, nickname, avatar) VALUES (?, ?, ?)', ['今天心情不错，分享一下最近的学习心得~', '机智的鱼', ''])
    run('INSERT INTO talks (content, nickname, avatar) VALUES (?, ?, ?)', ['Vue 3 真的好用！', '访客', ''])
  }

  const linkCount = query('SELECT COUNT(*) as count FROM links')[0].count
  if (linkCount === 0) {
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['GitHub', 'https://github.com', '', '全球最大的代码托管平台'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['Vue 官网', 'https://vuejs.org', '', '渐进式 JavaScript 框架'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['Tailwind CSS', 'https://tailwindcss.com', '', '实用优先的 CSS 框架'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['Node.js', 'https://nodejs.org', '', 'JavaScript 运行时'])
  }

  const aboutCount = query('SELECT COUNT(*) as count FROM about')[0].count
  if (aboutCount === 0) {
    run('INSERT INTO about (content) VALUES (?)', ['# 关于我\n\n我是一个热爱技术的前端开发者，专注于 Vue.js 生态的开发与实践。喜欢分享技术、记录生活。'])
  }
}

initDB()

module.exports = { query, run, get, saveDB }
