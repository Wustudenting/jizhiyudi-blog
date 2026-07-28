# 机智的鱼 - 个人博客系统

一个基于 Vue3 + Node.js Express 的前后端分离个人博客系统。

## ✨ 功能特性

- 📝 **文章管理** - 支持文章创建、编辑、删除，Markdown 格式
- 🏷️ **标签系统** - 灵活的标签分类，支持多标签筛选
- 📂 **分类管理** - 多级分类组织文章
- 💬 **评论功能** - 文章评论与回复
- 🔍 **搜索功能** - 文章全文搜索
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🌙 **暗色模式** - 支持主题切换
- 🤖 **AI 助手** - 文章AI智能问答

## 🛠️ 技术栈

### 前端
- Vue 3 + Vite
- Vue Router 4
- Tailwind CSS
- Axios

### 后端
- Node.js + Express
- SQLite (sql.js)
- JWT 认证

## 📁 项目结构

```
aurora-master/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── views/         # 页面视图
│   │   ├── router/        # 路由配置
│   │   └── service/       # 服务层
│   └── package.json
├── server/            # 后端项目
│   ├── src/
│   │   ├── routes/        # API路由
│   │   ├── db.js          # 数据库配置
│   │   └── index.js       # 入口文件
│   └── package.json
└── vercel.json        # Vercel部署配置
```

## 🚀 快速开始

### 后端服务

```bash
cd server
npm install
npm start
```

后端服务将运行在 `http://localhost:8080`

### 前端开发

```bash
cd frontend
npm install
npm run dev
```

前端应用将运行在 `http://localhost:5173`

### 生产构建

```bash
cd frontend
npm run build
```

构建产物将输出到 `frontend/dist`

## 🌐 Vercel 部署

1. 将项目推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入仓库，Vercel 会自动检测配置
4. 点击部署即可

## 📝 License

MIT
