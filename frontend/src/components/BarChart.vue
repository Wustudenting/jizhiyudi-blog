<template>
  <div ref="el" :style="{ height: `${chartHeight}px` }"></div>
</template>

<script setup>
/**
 * 通用横向条形图。
 *
 * 设计约束（来自可视化规范，改动前请先确认）：
 * - 单一数据系列 → 单一颜色，绝不用「颜色深浅」再编码一遍数值
 * - 细条 + 4px 圆角数据端（只圆数值那一头，基线那头方），条与条之间留缝
 * - 坐标轴/网格是发丝级、退到背景里；数值标签用文本色，不用系列色
 * - 行级 hover 热区（axis 触发），比条形本身大，好点中
 * - 数值直接标在条尾，不依赖 tooltip 才能读到
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from '../composables/useTheme'

// 按需引入，避免把整个 echarts 打进包里
echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps({
  items: { type: Array, required: true }, // [{ name, value }]
  /** 亮色系列色 */
  color: { type: String, default: '#6366f1' },
  /** 暗色系列色。默认是验证器在暗色卡片底 #1a2334 上跑过的蓝（>=3:1，亮度在暗色带内） */
  darkColor: { type: String, default: '#3987e5' },
  unit: { type: String, default: '' },
  /** 每行高度，用来算总高；16 行以内图表自己撑开，不出现内部滚动条 */
  rowHeight: { type: Number, default: 34 },
  /** 数值轴最大值，不传则自适应 */
  max: { type: Number, default: null },
  /** 名字列宽度 */
  nameWidth: { type: Number, default: 96 },
})

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const el = ref(null)
let chart = null

const chartHeight = computed(() => props.items.length * props.rowHeight + 16)

const buildOption = () => {
  const dark = isDark.value
  const series = dark ? props.darkColor : props.color
  // 轴/标签一律用文本色，不用系列色
  const ink = dark ? '#94a3b8' : '#475569'
  const inkMuted = dark ? '#94a3b8' : '#64748b'

  return {
  animationDuration: 600,
  grid: { left: props.nameWidth, right: 44, top: 6, bottom: 6, containLabel: false },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      shadowStyle: { color: dark ? 'rgba(129,140,248,0.10)' : 'rgba(99,102,241,0.06)' },
    },
    backgroundColor: dark ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.97)',
    borderColor: dark ? 'rgba(129,140,248,0.35)' : 'rgba(99,102,241,0.2)',
    borderWidth: 1,
    padding: [8, 12],
    textStyle: { color: dark ? '#e2e8f0' : '#1e293b', fontSize: 12 },
    formatter: (p) => {
      const d = p[0]
      return `${d.name}<br/><b>${d.value}${props.unit}</b>`
    },
  },
  xAxis: {
    type: 'value',
    max: props.max || undefined,
    show: false, // 数值已在条尾直接标注，坐标轴是冗余的
  },
  yAxis: {
    type: 'category',
    // 从下往上画，最大的在最上面
    data: props.items.map((i) => i.name).reverse(),
    axisLine: { show: false },
    axisTick: { show: false },
    // 名字过长时截断，避免把绘图区挤没（完整名字仍在 tooltip 里）
    axisLabel: {
      color: ink,
      fontSize: 12,
      width: props.nameWidth - 12,
      overflow: 'truncate',
    },
  },
  series: [
    {
      type: 'bar',
      data: props.items.map((i) => i.value).reverse(),
      barWidth: 10, // 细条
      barCategoryGap: '52%', // 条与条之间留出呼吸空间
      itemStyle: {
        color: series,
        borderRadius: [0, 4, 4, 0], // 只圆数值端，基线端保持方
      },
      label: {
        show: true,
        position: 'right',
        color: inkMuted, // 文本色，不是系列色
        fontSize: 12,
        formatter: (p) => `${p.value}${props.unit}`,
      },
      emphasis: { itemStyle: { color: series, opacity: 0.85 } },
    },
  ],
  }
}

const render = () => {
  if (!el.value) return
  if (!chart) chart = echarts.init(el.value)
  chart.setOption(buildOption(), true)
  chart.resize()
}

const handleResize = () => chart?.resize()

onMounted(() => {
  render()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
  chart = null
})

watch(
  () => [props.items, props.color, props.darkColor, props.max, theme.value],
  render,
  { deep: true },
)
</script>
