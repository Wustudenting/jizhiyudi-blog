<template>
  <div ref="el" :style="{ height: `${height}px` }"></div>
</template>

<script>
/**
 * 固定顺序的分类色板（前 5 槽）。浅色 / 深色是同一批色相在各自表面上重新取阶，
 * 不是简单反色。**顺序本身就是色盲安全机制，别随手调换。**
 *
 * 单独放一个普通 <script> 块是为了能具名导出给调用方 ——
 * 表格视图之类的地方也要用同一份颜色，不能另抄一遍。
 */
export const DONUT_PALETTE = {
  light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4'],
  dark: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181'],
}
</script>

<script setup>
/**
 * 环形图：看「各占多少」的构成关系。
 *
 * 设计约束（来自可视化规范，改动前请先确认）：
 * - 环形图只用于「一眼看构成」，段数 ≤ 6；要比较具体数值请用条形图
 * - 分类配色是**固定顺序**，不循环、不按数值大小重新上色 ——
 *   颜色跟着「方向」走，某个方向数据变了不该让它换颜色
 * - 5 个色槽跑过验证器：浅色/深色两套都全项通过（浅色下青、黄、品红对比度
 *   低于 3:1，触发宽免条款 —— 所以必须带图例 + 直接标注，不能只靠颜色区分）
 * - 段与段之间留 2px 表面色缝隙；hover 才浮起，不常驻动效
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from '../composables/useTheme'

// 按需引入，别把整个 echarts 打进包里
echarts.use([PieChart, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer])

const props = defineProps({
  items: { type: Array, required: true }, // [{ name, value }]，最多 5 项
  /** 圆心的总数说明，不传则不显示 */
  centerLabel: { type: String, default: '' },
  unit: { type: String, default: '' },
  height: { type: Number, default: 320 },
})

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const el = ref(null)
let chart = null

const buildOption = () => {
  const dark = isDark.value
  const colors = dark ? DONUT_PALETTE.dark : DONUT_PALETTE.light
  // 轴/标签一律用文本色，不用系列色
  const ink = dark ? '#e2e8f0' : '#1e293b'
  const inkMuted = dark ? '#94a3b8' : '#64748b'
  // 段之间的缝隙要跟卡片底色一致，否则会看成描边
  const surface = dark ? '#18212f' : '#ffffff'

  const total = props.items.reduce((n, i) => n + i.value, 0)

  return {
    animationDuration: 600,
    color: colors,
    title: {
      show: !!props.centerLabel,
      text: String(total),
      subtext: props.centerLabel,
      left: '50%',
      top: '36%',
      textAlign: 'center',
      textStyle: { color: ink, fontSize: 26, fontWeight: 600 },
      subtextStyle: { color: inkMuted, fontSize: 12 },
      itemGap: 2,
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: dark ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.97)',
      borderColor: dark ? 'rgba(129,140,248,0.35)' : 'rgba(99,102,241,0.2)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: dark ? '#e2e8f0' : '#1e293b', fontSize: 12 },
      formatter: (p) => `${p.name}<br/><b>${p.value}${props.unit}</b>（${p.percent}%）`,
    },
    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 16,
      // 图例文字用文本色：系列色由旁边那个小圆点承担，文字本身不上色
      textStyle: { color: inkMuted, fontSize: 12 },
    },
    series: [
      {
        type: 'pie',
        // 空心环：中心留给总数，也让扇形更细，符合「细标记」的要求
        radius: ['52%', '74%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: surface,
          borderWidth: 2, // 段间 2px 表面色缝隙
          borderRadius: 2,
        },
        label: {
          show: true,
          // 百分比直接标在外圈 —— 颜色对比度不足时的宽免条件就是「有可见标注」
          color: inkMuted,
          fontSize: 12,
          formatter: '{d}%',
        },
        labelLine: {
          length: 10,
          length2: 10,
          lineStyle: { color: dark ? '#334155' : '#cbd5e1' },
        },
        emphasis: {
          scale: true,
          scaleSize: 6,
          itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.25)' },
        },
        // 颜色按 item.slot 取固定色槽，不按数组下标 —— 数据变了颜色也不会串。
        // 传 slot 是调用方的责任（方向 ↔ 槽位的对应关系是业务语义，组件不该猜）。
        data: props.items.map((i, idx) => ({
          name: i.name,
          value: i.value,
          itemStyle: { color: colors[Number.isInteger(i.slot) ? i.slot : idx] },
        })),
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

watch(() => [props.items, props.centerLabel, theme.value], render, { deep: true })
</script>
