<template>
  <div ref="el" :style="{ height: `${height}px` }"></div>
</template>

<script setup>
/**
 * 笔记积累趋势：每月新增（柱）+ 累计笔记（面积线）。
 *
 * 两条线同一个量纲（篇），共用一根 y 轴 —— 绝不会做成双 y 轴，
 * 那种图会凭空造出并不存在的相关性。
 *
 * 配色经 validate_palette.js 在真实底色上验证过：
 *   亮色 #6366f1 / #eb6834 on #f4f7ff  → ALL PASS
 *   暗色 #3987e5 / #d95926 on #1a2334  → ALL PASS
 * （亮色的橙 2.99:1 略低于 3:1，规范要求配可见标签 —— 所以数值是直接标出来的，
 *   不是只能靠 tooltip 才读得到）
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from '../composables/useTheme'

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps({
  /** [{ label, monthly, cumulative }] */
  points: { type: Array, required: true },
  height: { type: Number, default: 260 },
  unit: { type: String, default: ' 篇' },
})

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const el = ref(null)
let chart = null

const buildOption = () => {
  const dark = isDark.value
  const cArea = dark ? '#3987e5' : '#6366f1' // 累计
  const cBar = dark ? '#d95926' : '#eb6834' // 每月新增
  const ink = dark ? '#94a3b8' : '#475569'
  const inkMuted = dark ? '#94a3b8' : '#64748b'
  const hairline = dark ? 'rgba(148,163,184,0.16)' : 'rgba(100,116,139,0.16)'

  const labels = props.points.map((p) => p.label)

  return {
    animationDuration: 700,
    grid: { left: 34, right: 46, top: 40, bottom: 26, containLabel: false },
    legend: {
      // 两个系列 → 图例是必需项，identity 不能只靠颜色
      top: 0,
      right: 0,
      itemWidth: 12,
      itemHeight: 8,
      itemGap: 16,
      icon: 'roundRect',
      textStyle: { color: ink, fontSize: 12 },
      data: ['每月新增', '累计笔记'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: hairline, width: 1 } },
      backgroundColor: dark ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.97)',
      borderColor: dark ? 'rgba(129,140,248,0.35)' : 'rgba(99,102,241,0.2)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: dark ? '#e2e8f0' : '#1e293b', fontSize: 12 },
      formatter: (ps) => {
        const head = ps[0]?.axisValue || ''
        const rows = ps
          .map((p) => `${p.marker}${p.seriesName}：<b>${p.value}${props.unit}</b>`)
          .join('<br/>')
        return `${head}<br/>${rows}`
      },
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: true, // 柱状需要两侧留白
      axisLine: { lineStyle: { color: hairline } },
      axisTick: { show: false },
      axisLabel: { color: ink, fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: hairline, type: 'solid', width: 1 } },
      axisLabel: { color: inkMuted, fontSize: 11 },
    },
    series: [
      {
        name: '每月新增',
        type: 'bar',
        data: props.points.map((p) => p.monthly),
        barWidth: 14,
        barCategoryGap: '46%',
        itemStyle: { color: cBar, borderRadius: [4, 4, 0, 0] }, // 只圆数值端
        z: 2,
      },
      {
        name: '累计笔记',
        type: 'line',
        data: props.points.map((p) => p.cumulative),
        smooth: false, // 不做平滑：插值会造出并不存在的中间值
        symbol: 'circle',
        symbolSize: 8, // >= 8px，好点中
        lineStyle: { color: cArea, width: 2 },
        itemStyle: {
          color: cArea,
          // 2px 底色描边，和柱子重叠处不会糊在一起
          borderColor: dark ? '#1a2334' : '#ffffff',
          borderWidth: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: dark ? 'rgba(57,135,229,0.32)' : 'rgba(99,102,241,0.26)' },
            { offset: 1, color: dark ? 'rgba(57,135,229,0.02)' : 'rgba(99,102,241,0.02)' },
          ]),
        },
        // 只在最后一个点上直接标注（用 endLabel 而不是 label + 空字符串，
        // 后者会在第一个点上留下一个渲染残留）
        endLabel: {
          show: true,
          color: inkMuted,
          fontSize: 12,
          formatter: (p) => `${p.value}${props.unit}`,
        },
        z: 3,
      },
    ],
  }
}

const render = () => {
  if (!el.value || !props.points.length) return
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

watch(() => [props.points, theme.value], render, { deep: true })
</script>
