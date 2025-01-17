<template>
  <div :class="bem.b()">
    <div :class="bem.e('header')">
      <div :class="bem.e('title')">{{ currentDate }}</div>
      <div :class="bem.e('button-group')">
        <dew-button @click="selectDate('prev-year')">前一年</dew-button>
        <dew-button @click="selectDate('prev-month')">上个月</dew-button>
        <dew-button @click="selectDate('today')">今天</dew-button>
        <dew-button @click="selectDate('next-month')">下个月</dew-button>
        <dew-button @click="selectDate('next-year')">下个年</dew-button>
      </div>
    </div>
    <div :class="bem.e('body')">
      <table :class="bemTable.b()" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th v-for="day in weekDays">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rid) in rows" :key="rid">
            <td
              v-for="(cell, cid) in row"
              :key="cid"
              @click="handlePick(cell)"
              :class="[
                bemTableCell.b(),
                bemTableCell.e(cell.type),
                getCellClass(cell)
              ]"
            >
              <slot name="data-cell" :data="getSlotData(cell)">
                {{ cell.text }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNameSpace } from '@dew-ui/utils/create'
import DewButton from '@dew-ui/components/button'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import 'dayjs/locale/zh-cn'
import { computed, ref } from 'vue'
import {
  CalendarDateCell,
  CalendarDateCellType,
  CalendarDateType,
  calendarEmits,
  calendarProps
} from './calendar'
dayjs.locale('zh-cn')
defineOptions({
  name: 'dew-calendar'
})
const bem = createNameSpace('calendar')
const bemTable = createNameSpace('calendar-table')
const bemTableCell = createNameSpace('calendar-table-cell')

const props = defineProps(calendarProps)
const emit = defineEmits(calendarEmits)

const selectedDay = ref<Dayjs>() // 标识用户选中的是哪一个
const now = dayjs()

const prevMonthDay = computed(() => date.value.subtract(1, 'month').date(1))
const nextMonthDay = computed(() => date.value.add(1, 'month').date(1))
const prevYearDay = computed(() => date.value.subtract(1, 'year').date(1))
const nextYearDay = computed(() => date.value.add(1, 'year').date(1))

const pickDay = (day: Dayjs) => {
  selectedDay.value = day
  emit('update:modelValue', day.toDate())
}

const getCellClass = ({ text, type }: CalendarDateCell) => {
  const clazz: string[] = [type]
  const date = formatter(text, type)
  if (date.isSame(selectedDay.value, 'day')) {
    clazz.push(bemTableCell.is('selected', true))
  }
  if (date.isSame(now, 'day')) {
    clazz.push(bemTableCell.is('today', true))
  }
  return clazz
}

const formatter = (text: number, type: CalendarDateCellType): Dayjs => {
  switch (type) {
    case 'prev':
      return date.value.startOf('month').subtract(1, 'month').date(text)
    case 'current':
      return date.value.date(text)
    case 'next':
      return date.value.startOf('month').add(1, 'month').date(text)
  }
}

const handlePick = ({ text, type }: CalendarDateCell) => {
  // 根据text和type获取日期来更新date
  const day = formatter(text, type)
  pickDay(day)
}

const selectDate = (type: CalendarDateType) => {
  const map: Record<CalendarDateType, Dayjs> = {
    'prev-month': prevMonthDay.value,
    'next-month': nextMonthDay.value,
    'prev-year': prevYearDay.value,
    'next-year': nextYearDay.value,
    today: now
  }
  const day = map[type]
  pickDay(day)
}

// 根据用户的属性计算当前的日期出来
const date = computed(() => {
  if (!props.modelValue) {
    return now
  } else {
    return dayjs(props.modelValue)
  }
})

// 0-6 0是周日
const firstDayOfWeek = dayjs().startOf('week').day()

const weekMaping = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
]
const weekDays = computed(() => {
  return [
    ...weekMaping.slice(firstDayOfWeek),
    ...weekMaping.slice(0, firstDayOfWeek)
  ]
})

const rows = computed(() => {
  // 根据用户提供的日期 计算出42个来
  let list: CalendarDateCell[] = []

  // 1.获取本月的第一天是星期几
  const firstDayOfMonth = date.value.startOf('month').day()

  const lastDay = date.value.subtract(1, 'month').endOf('month').date() // 上个月最后一天

  const count = firstDayOfMonth - firstDayOfWeek // 计算这个月第一天（星期几） - 一周是从周日还是周一开始的 = 需补全的天数

  // 得到补齐的天数分别是多少号
  const prevMonthDays: CalendarDateCell[] = Array.from({ length: count })
    .map((_, idx) => lastDay - (count - idx - 1))
    .map(_ => ({
      text: _,
      type: 'prev'
    }))
  // 获取当前月有多少天
  const days = date.value.daysInMonth()
  const currentMonthDays: CalendarDateCell[] = Array.from({ length: days }).map(
    (_, idx) => ({
      text: idx + 1,
      type: 'current'
    })
  )
  list = [...prevMonthDays, ...currentMonthDays]

  let remaining = 42 - list.length
  const nextMonthDays: CalendarDateCell[] = Array.from({
    length: remaining
  }).map((_, idx) => ({
    text: idx + 1,
    type: 'next'
  }))

  list = [...list, ...nextMonthDays]

  console.log(list)
  return Array.from({ length: 6 }).map((_, idx) => {
    const startOfLine = idx * 7
    return list.slice(startOfLine, startOfLine + 7) // 0 + 7 7 + 14
  })
})

const currentDate = computed(() => {
  return `${date.value.year()}年${date.value.month() + 1}月${date.value.date()}日`
})

const getSlotData = ({ text, type }: CalendarDateCell) => {
  const day = formatter(text, type)
  return {
    isSelected: day.isSame(selectedDay.value),
    day: day.format('YYYY-MM-DD'),
    date: day.toDate(),
    type
  }
}
</script>

<style scoped></style>
