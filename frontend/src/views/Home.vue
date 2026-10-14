<template>
  <div class="pt-24">
    <!-- ==================== hero ==================== -->
    <section class="relative pb-12 sm:pb-16 md:pb-24">
      <!-- 两团装饰光斑（对应 velpro 的 .home-orb） -->
      <div
        class="pointer-events-none absolute left-[8%] top-10 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl dark:bg-indigo-500/10 sm:top-12 sm:h-52 sm:w-52"
      ></div>
      <div
        class="pointer-events-none absolute right-[10%] top-20 h-44 w-44 rounded-full bg-blue-500/15 blur-3xl dark:bg-purple-500/10 sm:top-24 sm:h-72 sm:w-72"
      ></div>

      <div
        class="relative mx-auto grid max-w-7xl items-center gap-10 sm:gap-14 lg:grid-cols-[1.12fr_0.88fr]"
      >
        <!-- ---------- 左列：文案 ---------- -->
        <div>
          <p
            class="hero-overline mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] sm:mb-4 sm:text-xs sm:tracking-[0.38em]"
          >
            ◇ Knowledge Base
          </p>

          <h1
            class="hero-heading mb-5 text-4xl font-semibold leading-tight tracking-tight sm:mb-6 sm:text-5xl md:text-7xl"
          >
            <span
              v-for="(char, i) in titleChars"
              :key="i"
              class="hero-char inline-block"
              :style="{ animationDelay: `${i * 45}ms` }"
              >{{ char }}</span
            >
          </h1>

          <p class="hero-sub max-w-2xl text-base leading-7 sm:text-lg sm:leading-8">
            记录技术成长，分享生活感悟 —— 把踩过的坑和想明白的事都留在这里。
          </p>

          <div class="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            <span
              v-for="chip in HERO_CHIPS"
              :key="chip"
              class="hero-chip inline-flex rounded-full px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
            >
              {{ chip }}
            </span>
          </div>

          <div class="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <router-link
              to="/articles"
              class="hero-btn hero-btn-primary w-full justify-center px-6 py-3 text-sm sm:w-auto"
            >
              浏览文章
            </router-link>
            <router-link
              to="/projects"
              class="hero-btn hero-btn-secondary w-full justify-center px-6 py-3 text-sm sm:w-auto"
            >
              项目经历
            </router-link>
          </div>

          <HeroQuote />

          <div class="mt-8 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-4">
            <div
              v-for="metric in metrics"
              :key="metric.label"
              class="glass-card hero-metric rounded-[1.5rem] px-2 py-3 text-center sm:px-5 sm:py-4 sm:text-left"
            >
              <p class="hero-caption text-xs sm:text-sm">{{ metric.label }}</p>
              <p
                class="hero-metric-value mt-2 whitespace-nowrap text-lg font-semibold sm:mt-3 sm:text-2xl md:text-3xl"
              >
                {{ metric.value }}
              </p>
            </div>
          </div>
        </div>

        <!-- ---------- 右列：知识星球 ---------- -->
        <div class="glass-card hero-panel relative rounded-[1.75rem] p-5 sm:rounded-[2rem] sm:p-8">
          <div class="space-y-5">
            <div class="overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10">
              <!-- macOS 三色圆点 -->
              <div class="flex items-center gap-3 px-5 pt-4">
                <div class="h-3 w-3 rounded-full bg-rose-400"></div>
                <div class="h-3 w-3 rounded-full bg-amber-400"></div>
                <div class="h-3 w-3 rounded-full bg-emerald-400"></div>
              </div>

              <div class="px-4 pb-4 pt-3">
                <div class="hero-galaxy-frame">
                  <HeroGalaxy :articles="galaxyArticles" />
                </div>
                <p class="hero-caption mt-3 text-center text-[11px]">
                  知识星球：点击星球上的星星直达对应文章
                </p>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="glass-card rounded-[1.5rem] p-5">
                <p class="hero-caption text-sm">文档来源</p>
                <p class="hero-metric-value mt-2 text-2xl font-semibold">语雀知识库</p>
              </div>
              <div class="glass-card rounded-[1.5rem] p-5">
                <p class="hero-caption text-sm">技术栈</p>
                <p class="hero-metric-value mt-2 text-2xl font-semibold">Vue 3 + Vite</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 网站特点 ==================== -->
    <section class="px-4 py-12 sm:px-6 sm:py-16">
      <div class="mx-auto max-w-7xl">
        <div class="max-w-3xl">
          <p class="hero-overline mb-3 text-xs font-semibold uppercase tracking-[0.32em] sm:text-sm">
            网站特点
          </p>
          <h2 class="hero-heading text-2xl font-semibold sm:text-3xl md:text-4xl">
            写作在语雀，发布是静态站
          </h2>
          <p class="hero-sub mt-4 text-sm leading-7 sm:text-base">
            从内容同步到页面呈现，整条链路上没有数据库，也没有需要常驻的后端。
          </p>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <div
            v-for="feature in siteFeatures"
            :key="feature.title"
            class="glass-card hero-metric rounded-[1.75rem] p-5 sm:p-6"
          >
            <p class="hero-overline text-sm font-medium">{{ feature.eyebrow }}</p>
            <h3 class="hero-heading mt-4 text-xl font-semibold sm:text-2xl">{{ feature.title }}</h3>
            <p class="hero-sub mt-4 text-sm leading-7 sm:text-base">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 收尾：个人卡片 + 公告 ==================== -->
    <section class="px-4 py-12 sm:px-6 sm:py-16">
      <div class="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <!-- 个人卡片 -->
        <div class="glass-card p-6 sm:p-8">
          <div class="text-center">
            <div class="avatar-container mx-auto mb-4 h-24 w-24">
              <div class="avatar-ring"></div>
              <div class="avatar-inner">
                <svg viewBox="0 0 120 120" class="fish-swim h-16 w-16" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="homeShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#F59E0B" flood-opacity="0.25" />
                    </filter>
                    <linearGradient id="homeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#FEF08A" />
                      <stop offset="50%" stop-color="#FCD34D" />
                      <stop offset="100%" stop-color="#F59E0B" />
                    </linearGradient>
                    <linearGradient id="homeFinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#FDE68A" />
                      <stop offset="100%" stop-color="#D97706" />
                    </linearGradient>
                    <radialGradient id="homeEyeGrad" cx="40%" cy="40%" r="60%">
                      <stop offset="0%" stop-color="#FFFFFF" />
                      <stop offset="100%" stop-color="#F3F4F6" />
                    </radialGradient>
                    <radialGradient id="homeBlushGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#FB7185" stop-opacity="0.4" />
                      <stop offset="100%" stop-color="#FB7185" stop-opacity="0" />
                    </radialGradient>
                  </defs>
                  <g filter="url(#homeShadow)">
                    <ellipse cx="50" cy="62" rx="32" ry="26" fill="url(#homeBodyGrad)" />
                    <ellipse cx="50" cy="70" rx="22" ry="14" fill="#FFFBEB" opacity="0.8" />
                    <path d="M82 62 Q106 40 110 62 Q106 84 82 62" fill="url(#homeFinGrad)" />
                    <path d="M82 62 Q92 56 100 62 Q92 68 82 62" fill="#F59E0B" opacity="0.5" />
                    <path d="M72 50 Q86 34 94 50" stroke="#D97706" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.3" />
                    <ellipse cx="38" cy="52" rx="11" ry="12" fill="url(#homeEyeGrad)" />
                    <ellipse cx="40" cy="54" rx="7" ry="8" fill="#1F2937" />
                    <ellipse cx="42" cy="51" rx="3" ry="3.5" fill="white" />
                    <circle cx="36" cy="57" r="1.5" fill="white" opacity="0.6" />
                    <ellipse cx="24" cy="68" rx="7" ry="4" fill="url(#homeBlushGrad)" />
                    <path d="M36 74 Q42 80 48 74" stroke="#92400E" stroke-width="2.5" fill="none" stroke-linecap="round" />
                    <path d="M44 46 Q50 38 56 46" stroke="#D97706" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.35" />
                    <ellipse cx="58" cy="62" rx="5" ry="4" fill="#F59E0B" opacity="0.25" />
                  </g>
                  <circle cx="100" cy="30" r="5" fill="white" opacity="0.7" class="bubble-1" />
                  <circle cx="110" cy="18" r="3.5" fill="white" opacity="0.5" class="bubble-2" />
                  <circle cx="22" cy="36" r="2.5" fill="white" opacity="0.6" />
                  <circle cx="68" cy="96" r="2.5" fill="white" opacity="0.4" />
                </svg>
              </div>
            </div>

            <h3 class="mb-1 text-xl font-bold text-slate-800 dark:text-slate-100">机智的鱼</h3>
            <p class="hero-caption mb-4 text-sm">机智的鱼的博客，记录技术成长与生活感悟</p>

            <div class="flex justify-center space-x-6 text-center">
              <div>
                <p class="text-lg font-bold text-cyan-600 dark:text-blue-500">{{ stats.articleCount }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">文章</p>
              </div>
              <div>
                <p class="text-lg font-bold text-cyan-700 dark:text-purple-500">{{ stats.categoryCount }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">分类</p>
              </div>
            </div>

            <a
              href="https://github.com/Wustudenting"
              target="_blank"
              rel="noopener"
              class="mt-4 block w-full rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-700 py-2 text-center font-medium text-white transition-opacity hover:opacity-90 dark:from-blue-500 dark:to-purple-600"
            >
              + 关注我
            </a>

            <div class="mt-4 flex justify-center space-x-4">
              <a
                href="https://github.com/Wustudenting"
                target="_blank"
                rel="noopener"
                class="text-slate-400 transition-colors hover:text-cyan-600 dark:text-slate-500 dark:hover:text-indigo-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
              </a>
              <a
                href="#"
                class="text-slate-400 transition-colors hover:text-cyan-600 dark:text-slate-500 dark:hover:text-indigo-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
              <a
                href="#"
                class="text-slate-400 transition-colors hover:text-cyan-600 dark:text-slate-500 dark:hover:text-indigo-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- 公告 -->
        <div class="glass-card flex flex-col justify-center p-6 sm:p-8">
          <h3 class="mb-4 flex items-center text-lg font-semibold text-slate-800 dark:text-slate-100">
            <span class="mr-2">📢</span>公告
          </h3>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            欢迎来到机智的鱼的博客！这里记录着我在技术学习和生活中的点滴感悟，希望能给你带来一些启发和帮助。
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { blogApi } from '../service/api'
import HeroGalaxy from '../components/HeroGalaxy.vue'
import HeroQuote from '../components/HeroQuote.vue'

/**
 * 技术标签 chips。语雀那边没有标签概念（同步下来的 tags 恒为空数组），
 * 分类名又太长不适合做 chip，所以这里手写一组。
 * 想改就往这个数组里加/删。
 */
const HERO_CHIPS = ['Vue 3', 'React', 'TypeScript', 'Node.js', 'Python', 'MySQL', 'Git']

/** 标题逐字入场 */
const titleChars = '机智的鱼的博客'.split('')

const articlesData = ref([])
const categoriesData = ref([])

const stats = computed(() => ({
  articleCount: articlesData.value.length,
  categoryCount: categoriesData.value.length,
  wordCount: articlesData.value.reduce((sum, a) => sum + (a.wordCount || 0), 0),
}))

/** 一万字以上折成「万」，否则显示原数 */
const formatWordCount = (n) => (n >= 10000 ? `${(n / 10000).toFixed(2)} 万字` : `${n} 字`)

const metrics = computed(() => [
  { label: '文章', value: `${stats.value.articleCount} 篇` },
  { label: '分类', value: `${stats.value.categoryCount} 个` },
  { label: '累计字数', value: formatWordCount(stats.value.wordCount) },
])

/** 给知识星球的形状：星星按字数定大小、按分类上色 */
const galaxyArticles = computed(() =>
  articlesData.value.map((a) => ({
    id: a.id,
    title: a.articleTitle,
    categoryName: a.categoryName,
    tags: [],
    wordCount: a.wordCount || 0,
  })),
)

/**
 * 「网站特点」三张卡。文案描述的是这个站**真实**在做的事，别照抄参考站的
 * （那边写的是 FastAPI / MySQL / SSE，本站没有这些）。文章数取实时的。
 */
const siteFeatures = computed(() => [
  {
    eyebrow: '内容来源',
    title: '语雀写作 · 一键同步',
    desc: `${stats.value.articleCount} 篇文章全部来自语雀知识库，跑一条 npm run sync:yuque 就抓成静态 JSON —— 写和发布彻底分开，改完重新同步即可。`,
  },
  {
    eyebrow: '站点形态',
    title: '纯静态 · 零后端',
    desc: 'Vue 3 + Vite 打包成静态文件直接托管，没有数据库要维护、没有服务要守着，也不存在接口挂了页面就打不开的情况。',
  },
  {
    eyebrow: '阅读体验',
    title: '全文检索 · 深浅双主题',
    desc: '顶栏搜索覆盖标题与摘要，关键词记不全也能命中；白天黑夜各一套配色，晚上读着不刺眼。',
  },
])

onMounted(async () => {
  try {
    // 只拉语雀的两块数据。「热门标签」和「友链」走的是后端 /api/*，
    // 线上后端从未部署、必然为空，首页已不再展示，这里也就不再请求。
    const [allArticles, categories] = await Promise.all([
      blogApi.getArticles().catch(() => []),
      blogApi.getCategories().catch(() => []),
    ])

    if (Array.isArray(allArticles)) {
      articlesData.value = allArticles.map((a) => ({
        id: a.id,
        articleTitle: a.title || a.articleTitle || '',
        articleSummary: a.summary || a.articleSummary || '',
        categoryName: a.category ? a.category.name : a.categoryName || '未分类',
        createTime: a.created_at || a.createTime,
        wordCount: a.wordCount ?? a.word_count ?? 0,
      }))
    }

    if (Array.isArray(categories)) {
      categoriesData.value = categories.map((c) => ({
        id: c.id,
        categoryName: c.name || c.categoryName || '',
        articleCount: c.count ?? c.articleCount ?? 0,
      }))
    }
  } catch (e) {
    console.warn('Home page data fetch failed:', e.message)
  }
})
</script>

<style scoped>
/* ---------------------------------------------------------------
   首页专用样式。白天一律用 velpro 那套青色，黑夜沿用本站原有的
   slate + indigo/blue-purple 配色，用 `.dark .xxx` 分开写 —— scoped 样式会把
   选择器编译成 `.dark .xxx[data-v-x]`，正好能命中。
   --------------------------------------------------------------- */

/* ---- 文字层级 ---- */
.hero-overline {
  color: #0891b2;
}

.hero-heading {
  color: #0f172a;
}

.hero-sub {
  color: #334155;
}

.hero-caption {
  color: #64748b;
}

.hero-metric-value {
  color: #0f172a;
}

.dark .hero-overline {
  color: #22d3ee;
}

.dark .hero-heading {
  color: #f1f5f9;
}

.dark .hero-sub {
  color: #cbd5e1;
}

.dark .hero-caption {
  color: #94a3b8;
}

.dark .hero-metric-value {
  color: #f1f5f9;
}

/* ---- 标题逐字入场 ---- */
@keyframes hero-char-in {
  from {
    opacity: 0;
    transform: translateY(0.35em);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: blur(0);
  }
}

.hero-char {
  animation: hero-char-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .hero-char {
    animation: none;
  }
}

/* ---- 技术 chips ---- */
.hero-chip {
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(240, 249, 255, 0.92);
  color: #334155;
  transition: transform 0.25s, border-color 0.25s, background-color 0.25s, color 0.25s;
}

.hero-chip:hover {
  border-color: rgba(8, 145, 178, 0.45);
  color: #0891b2;
  transform: translateY(-2px);
}

.dark .hero-chip {
  border-color: rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
}

.dark .hero-chip:hover {
  border-color: rgba(165, 180, 252, 0.45);
  color: #a5b4fc;
}

/* ---- hero 按钮（玻璃态，数值取自 velpro）---- */
.hero-btn {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-weight: 500;
  transition: transform 0.25s, box-shadow 0.25s, background-color 0.25s, border-color 0.25s;
}

.hero-btn:hover {
  transform: translateY(-2px);
}

.hero-btn-primary {
  background: linear-gradient(135deg, rgba(14, 165, 190, 0.8), rgba(8, 116, 145, 0.68));
  border: 1px solid rgba(255, 255, 255, 0.45);
  color: #fff;
  box-shadow:
    0 12px 28px rgba(8, 116, 145, 0.28),
    inset 0 1px rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
}

.hero-btn-secondary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0.36));
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: #0e7490;
  box-shadow:
    0 12px 28px rgba(15, 42, 80, 0.12),
    inset 0 1px rgba(255, 255, 255, 0.99);
}

.dark .hero-btn-primary {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.75), rgba(147, 51, 234, 0.55));
  border-color: rgba(165, 180, 252, 0.25);
  box-shadow:
    0 12px 28px rgba(2, 6, 23, 0.5),
    inset 0 1px rgba(255, 255, 255, 0.18);
}

.dark .hero-btn-secondary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.04));
  border-color: rgba(165, 180, 252, 0.16);
  color: #c7d2fe;
  box-shadow:
    0 12px 28px rgba(2, 6, 23, 0.4),
    inset 0 1px rgba(255, 255, 255, 0.08);
}

/* ---- 指标卡 hover ---- */
.hero-metric {
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
}

.hero-metric:hover {
  transform: translateY(-6px) scale(1.02);
}

/* ---- 知识星球的外框（深色星空由组件自己画）---- */
.hero-galaxy-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 1.5rem;
  overflow: hidden;
}

/* ---- 头像 ---- */
.avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  background: linear-gradient(45deg, #f59e0b, #d97706, #b45309, #f59e0b) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: ring-rotate 3s linear infinite;
}

.avatar-inner {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: linear-gradient(135deg, #ecfeff, #cffafe);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: avatar-breath 2s ease-in-out infinite;
  box-shadow: inset 0 2px 8px rgba(8, 145, 178, 0.1);
}

.dark .avatar-inner {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  box-shadow: inset 0 2px 8px rgba(59, 130, 246, 0.1);
}

.fish-swim {
  animation: fish-swim 3s ease-in-out infinite;
  display: inline-block;
}

.bubble-1 {
  animation: bubble-float 2.5s ease-in-out infinite;
}

.bubble-2 {
  animation: bubble-float 3s ease-in-out infinite 0.5s;
}

@keyframes ring-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes avatar-breath {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes fish-swim {
  0%,
  100% {
    transform: rotate(0deg) translateY(0);
  }
  25% {
    transform: rotate(-6deg) translateY(-3px);
  }
  50% {
    transform: rotate(0deg) translateY(0);
  }
  75% {
    transform: rotate(6deg) translateY(-3px);
  }
}

@keyframes bubble-float {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-3px);
    opacity: 0.9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .avatar-ring,
  .avatar-inner,
  .fish-swim,
  .bubble-1,
  .bubble-2 {
    animation: none;
  }
}
</style>
