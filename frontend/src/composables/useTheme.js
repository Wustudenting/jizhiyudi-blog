import { ref } from 'vue'

/**
 * 全站主题切换。
 *
 * 用 `class` 策略（不是跟随系统）：<html class="dark"> 由这里控制，
 * Tailwind 的 `dark:` 变体才会生效（见 tailwind.config.js 的 darkMode: 'class'）。
 *
 * 模块级单例 —— 所有组件 import 到的是同一个 ref，切换时全站同步。
 */

const STORAGE_KEY = 'blog-theme'

let mediaQuery = null

const readInitial = () => {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  // 没存过就跟随系统偏好
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref(readInitial())

const apply = () => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', theme.value === 'dark')
  // 让原生控件（滚动条、表单）也跟着变色
  root.style.colorScheme = theme.value
}

/** 在 main.js 里调用一次 */
export function initTheme() {
  apply()
  // 用户没手动选过时，跟随系统变化
  mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
  mediaQuery?.addEventListener?.('change', (e) => {
    if (localStorage.getItem(STORAGE_KEY)) return
    theme.value = e.matches ? 'dark' : 'light'
    apply()
  })
}

export function useTheme() {
  const setTheme = (next) => {
    theme.value = next
    localStorage.setItem(STORAGE_KEY, next)
    apply()
  }

  const toggleTheme = () => setTheme(theme.value === 'dark' ? 'light' : 'dark')

  return { theme, setTheme, toggleTheme }
}
