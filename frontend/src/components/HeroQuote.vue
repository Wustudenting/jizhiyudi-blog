<template>
  <!--
    一言卡片。整块 `v-if="quote"` —— 接口挂了就什么都不渲染，
    不留一个空卡片在 hero 里占位。
  -->
  <figure
    v-if="quote"
    class="glass-card hero-quote mt-8 max-w-xl rounded-[1.5rem] px-5 py-4 sm:mt-10"
  >
    <div class="flex items-start gap-3">
      <svg
        class="hero-quote-mark h-5 w-5 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M9.5 8C7 8 5 10 5 12.5S7 17 9.5 17c.3 0 .7 0 1-.1-.6 1.3-1.9 2.3-3.5 2.6v2c3.9-.4 7-3.7 7-7.6V12C14 9.8 12 8 9.5 8Zm9 0C16 8 14 10 14 12.5S16 17 18.5 17c.3 0 .7 0 1-.1-.6 1.3-1.9 2.3-3.5 2.6v2c3.9-.4 7-3.7 7-7.6V12C23 9.8 21 8 18.5 8Z"
        />
      </svg>

      <div class="min-w-0 flex-1">
        <p class="hero-quote-text m-0 text-sm font-medium leading-6 sm:text-base sm:leading-7">
          {{ quote.text }}
        </p>
        <p v-if="quote.from" class="hero-quote-from mt-2 text-xs">—— {{ quote.from }}</p>
      </div>

      <button
        type="button"
        class="hero-quote-refresh mt-0.5 shrink-0 rounded-full p-1.5 transition hover:rotate-90"
        :disabled="loading"
        title="换一句"
        aria-label="换一句"
        @click="load"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          :class="{ 'animate-spin': loading }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  </figure>
</template>

<script setup>
import { ref, onMounted } from 'vue'

/**
 * 「一言」随机句子，数据来自 hitokoto.cn 的公开接口。
 *
 * 这个接口是纯客户端的、支持 CORS、无需鉴权。它挂掉的概率不高但确实存在
 * （网络抖动 / 被墙 / 接口改版），而首页不该因为一个装饰性卡片而报错，
 * 所以失败时直接让整块消失（`quote` 保持 null，模板的 v-if 兜住）。
 */

const quote = ref(null)
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    const res = await fetch('https://v1.hitokoto.cn/')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    // 字段含义见接口文档：hitokoto 是正文，from_who 是作者（常为 null），
    // from 是出处（书名/作品名）。作者比出处具体，优先显示作者。
    quote.value = {
      text: data.hitokoto,
      from: data.from_who || data.from || '',
    }
  } catch (err) {
    // 首次失败保持 null（卡片不渲染）；刷新失败则保留上一次的句子
    console.warn('[hitokoto] 一言接口不可用：', err.message)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.hero-quote {
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
}

.hero-quote-text {
  color: #0f172a;
}

.hero-quote-from {
  color: #64748b;
}

.hero-quote-mark {
  color: #0891b2;
  opacity: 0.7;
  transition: opacity 0.3s, transform 0.3s;
}

.hero-quote-refresh {
  color: #64748b;
}

.hero-quote-refresh:hover:not(:disabled) {
  color: #0891b2;
}

.hero-quote-refresh:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* ---- 黑夜：沿用改造前本站的深色配色（slate 文字 + indigo 点缀）---- */
.dark .hero-quote-text {
  color: #f1f5f9;
}

.dark .hero-quote-from {
  color: #94a3b8;
}

.dark .hero-quote-mark {
  color: #a5b4fc;
}

.dark .hero-quote-refresh {
  color: #94a3b8;
}

.dark .hero-quote-refresh:hover:not(:disabled) {
  color: #a5b4fc;
}
</style>
