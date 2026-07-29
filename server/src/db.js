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

  let schemaVer = null
  try {
    const metaTable = query("SELECT name FROM sqlite_master WHERE type='table' AND name='meta'")
    if (metaTable.length === 0) {
      try { run("CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)") } catch (e) {}
    } else {
      const row = query("SELECT value FROM meta WHERE key = 'schema_version'")
      schemaVer = row.length > 0 ? row[0].value : null
    }
  } catch (e) {}

  const tagArtCount = query('SELECT COUNT(*) as count FROM article_tags')[0].count
  if (schemaVer !== 'v5' || tagArtCount < 20) {
    try { run("INSERT OR IGNORE INTO meta (key, value) VALUES ('schema_version', 'v5')") } catch (e) {}
    const getTagIdByName = (name) => {
      const row = get('SELECT id FROM tags WHERE name = ?', [name])
      return row ? row.id : null
    }
    const articleTagMap = [
      [1, 'Vue3'], [1, 'JavaScript'], [1, '前端'],
      [2, 'Tailwind'], [2, 'CSS'], [2, '前端'],
      [3, 'Node.js'], [3, 'Express'],
      [4, '前端'], [4, '学习'],
      [5, '生活'], [5, '随笔'],
      [6, 'Vite'], [6, 'Vue3'],
      [7, 'React'], [7, 'JavaScript'],
      [8, 'Node.js'], [8, 'Redis'],
      [9, 'Docker'], [9, 'Nginx'],
      [10, 'MySQL'],
      [11, 'Kubernetes'], [11, 'Docker'],
    ]
    articleTagMap.forEach(([articleId, tagName]) => {
      const tagId = getTagIdByName(tagName)
      if (tagId) {
        try { run('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)', [articleId, tagId]) } catch (e) {}
      }
    })
  }

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
    const tags = ['Vue3', 'JavaScript', 'CSS', 'Node.js', 'Express', 'Tailwind', 'Vite', 'SQLite', '生活', '随笔', '前端', '学习', 'Docker', 'React', 'TypeScript', 'MySQL', 'Redis', 'Spring Boot', 'Kubernetes', 'Git', 'Linux', 'Nginx', 'Java', 'Python', 'HTML5']
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
      ['Vite 构建优化', 'Vite 项目的构建优化实践', '# Vite 优化\n\nVite 是新一代前端构建工具...', 1, 192, 0],
      ['React Hooks 实战指南', '深入理解 React Hooks 使用方法', '# React Hooks\n\nReact Hooks 让函数组件拥有状态管理能力...', 1, 780, 0],
      ['Node.js 性能优化实践', '分享 Node.js 性能优化的实用技巧', '# Node.js 性能优化\n\nNode.js 应用性能优化涉及多个方面...', 2, 654, 0],
      ['Docker 容器化部署指南', '从入门到精通 Docker 容器化部署', '# Docker\n\nDocker 容器化部署指南...', 4, 1567, 1],
      ['MySQL 索引优化', 'MySQL 索引优化最佳实践', '# MySQL 索引\n\n合理使用索引可以大幅提升查询效率...', 2, 610, 0],
      ['Kubernetes 入门到精通', 'Kubernetes 容器编排系统学习', '# Kubernetes\n\nKubernetes 是容器编排系统...', 4, 430, 0],
    ]
    articles.forEach(a => run('INSERT INTO articles (title, summary, content, category_id, view_count, is_featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [...a, 'published']))
  }

  const tagArtCount2 = query('SELECT COUNT(*) as count FROM article_tags')[0].count
  if (tagArtCount2 < 20) {
    const getTagIdByName = (name) => {
      const row = get('SELECT id FROM tags WHERE name = ?', [name])
      return row ? row.id : null
    }
    const articleTagMap = [
      [1, 'Vue3'], [1, 'JavaScript'], [1, '前端'],
      [2, 'Tailwind'], [2, 'CSS'], [2, '前端'],
      [3, 'Node.js'], [3, 'Express'],
      [4, '前端'], [4, '学习'],
      [5, '生活'], [5, '随笔'],
      [6, 'Vite'], [6, 'Vue3'],
      [7, 'React'], [7, 'JavaScript'],
      [8, 'Node.js'], [8, 'Redis'],
      [9, 'Docker'], [9, 'Nginx'],
      [10, 'MySQL'],
      [11, 'Kubernetes'], [11, 'Docker'],
    ]
    articleTagMap.forEach(([articleId, tagName]) => {
      const tagId = getTagIdByName(tagName)
      if (tagId) {
        try {
          run('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)', [articleId, tagId])
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
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['GitHub', 'https://github.com', '', '全球最大的代码托管平台，开源项目聚集地'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['Vue 官网', 'https://vuejs.org', '', '渐进式 JavaScript 框架，用于构建用户界面'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['Tailwind CSS', 'https://tailwindcss.com', '', '实用优先的 CSS 框架，快速构建现代界面'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['Node.js', 'https://nodejs.org', '', 'JavaScript 运行时，服务端 JavaScript 开发'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['MDN', 'https://developer.mozilla.org', '', 'Web 技术文档与开发者资源'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['Vite', 'https://vitejs.dev', '', '下一代前端构建工具，极速开发体验'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['Stack Overflow', 'https://stackoverflow.com', '', '全球最大的技术问答社区'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['React', 'https://react.dev', '', '用于构建用户界面的 JavaScript 库'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['百度', 'https://www.baidu.com', '', '全球最大的中文搜索引擎'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['掘金', 'https://juejin.cn', '', '面向开发者的中文技术社区'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['CSDN', 'https://www.csdn.net', '', '中文 IT 技术知识社区'])
    run('INSERT INTO links (name, url, logo, description) VALUES (?, ?, ?, ?)', ['Bing', 'https://www.bing.com', '', '微软旗下搜索引擎'])
  }

  const aboutCount = query('SELECT COUNT(*) as count FROM about')[0].count
  if (aboutCount === 0) {
    run('INSERT INTO about (content) VALUES (?)', ['# 关于我\n\n我是一个热爱技术的前端开发者，专注于 Vue.js 生态的开发与实践。喜欢分享技术、记录生活。'])
  }
}

initDB()

module.exports = { query, run, get, saveDB }
