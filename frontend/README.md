# 机智的鱼 - 前端

机智的鱼个人博客系统的前端，基于 Vue 3 + Vite 构建。

## 技术栈

- Vue 3（`<script setup>` SFC）
- Vue Router 4
- Tailwind CSS
- Axios

## 开发

```bash
npm install
npm run dev      # 开发服务器，默认 http://localhost:5173
```

开发环境下 `/api` 请求由 Vite 代理转发到后端（见 `vite.config.js`），因此代码中统一使用相对路径。

## 构建

```bash
npm run build    # 产物输出到 dist/
npm run preview  # 本地预览构建产物
```

## 目录结构

```
src/
├── components/   # 通用组件（导航、侧边栏、页脚、AI 助手等）
├── views/        # 页面视图（文章、标签、分类、随笔、项目等）
├── router/       # 路由配置
├── service/      # 接口层（api.js / axios.js / dataService.js / syncService.js）
└── assets/       # 静态资源
```

## 相关

- 后端服务见 [`../server`](../server)
- 完整项目说明见 [根目录 README](../README.md)
