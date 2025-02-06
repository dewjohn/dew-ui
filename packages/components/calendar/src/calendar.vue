<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import type {
  CalendarDateCell,
  CalendarDateCellType,
  CalendarDateType,
} from './calendar'
import DewButton from '@dew-ui/components/button'
import { createNameSpace } from '@dew-ui/utils/create'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import {
  calendarEmits,
  calendarProps,
} from './calendar'
import 'dayjs/locale/zh-cn'

defineOptions({
  name: 'DewCalendar',
})
const props = defineProps(calendarProps)
const emit = defineEmits(calendarEmits)
dayjs.locale('zh-cn')
const bem = createNameSpace('calendar')
const bemTable = createNameSpace('calendar-table')
const bemTableCell = createNameSpace('calendar-table-cell')

const selectedDay = ref<Dayjs>() // 标识用户选中的是哪一个
const now = dayjs()

// 根据用户的属性计算当前的日期出来
const date = computed(() => {
  if (!props.modelValue) {
    return now
  }
  else {
    return dayjs(props.modelValue)
  }
})

const prevMonthDay = computed(() => date.value.subtract(1, 'month').date(1))
const nextMonthDay = computed(() => date.value.add(1, 'month').date(1))
const prevYearDay = computed(() => date.value.subtract(1, 'year').date(1))
const nextYearDay = computed(() => date.value.add(1, 'year').date(1))

function pickDay(day: Dayjs) {
  selectedDay.value = day
  emit('update:modelValue', day.toDate())
}

function getCellClass({ text, type }: CalendarDateCell) {
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

function formatter(text: number, type: CalendarDateCellType): Dayjs {
  switch (type) {
    case 'prev':
      return date.value.startOf('month').subtract(1, 'month').date(text)
    case 'current':
      return date.value.date(text)
    case 'next':
      return date.value.startOf('month').add(1, 'month').date(text)
  }
}

function handlePick({ text, type }: CalendarDateCell) {
  // 根据text和type获取日期来更新date
  const day = formatter(text, type)
  pickDay(day)
}

function selectDate(type: CalendarDateType) {
  const map: Record<CalendarDateType, Dayjs> = {
    'prev-month': prevMonthDay.value,
    'next-month': nextMonthDay.value,
    'prev-year': prevYearDay.value,
    'next-year': nextYearDay.value,
    'today': now,
  }
  const day = map[type]
  pickDay(day)
}

// 0-6 0是周日
const firstDayOfWeek = dayjs().startOf('week').day()

const weekMaping = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
]
const weekDays = computed(() => {
  return [
    ...weekMaping.slice(firstDayOfWeek),
    ...weekMaping.slice(0, firstDayOfWeek),
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
      type: 'prev',
    }))
  // 获取当前月有多少天
  const days = date.value.daysInMonth()
  const currentMonthDays: CalendarDateCell[] = Array.from({ length: days }).map(
    (_, idx) => ({
      text: idx + 1,
      type: 'current',
    }),
  )
  list = [...prevMonthDays, ...currentMonthDays]

  const remaining = 42 - list.length
  const nextMonthDays: CalendarDateCell[] = Array.from({
    length: remaining,
  }).map((_, idx) => ({
    text: idx + 1,
    type: 'next',
  }))

  list = [...list, ...nextMonthDays]

  return Array.from({ length: 6 }).map((_, idx) => {
    const startOfLine = idx * 7
    return list.slice(startOfLine, startOfLine + 7) // 0 + 7 7 + 14
  })
})

const currentDate = computed(() => {
  return `${date.value.year()}年${date.value.month() + 1}月${date.value.date()}日`
})

function getSlotData({ text, type }: CalendarDateCell) {
  const day = formatter(text, type)
  return {
    isSelected: day.isSame(selectedDay.value),
    day: day.format('YYYY-MM-DD'),
    date: day.toDate(),
    type,
  }
}
</script>

<template>
  <div :class="bem.b()">
    <div :class="bem.e('header')">
      <div :class="bem.e('title')">
        {{ currentDate }}
      </div>
      <div :class="bem.e('button-group')">
        <DewButton @click="selectDate('prev-year')">
          前一年
        </DewButton>
        <DewButton @click="selectDate('prev-month')">
          上个月
        </DewButton>
        <DewButton @click="selectDate('today')">
          今天
        </DewButton>
        <DewButton @click="selectDate('next-month')">
          下个月
        </DewButton>
        <DewButton @click="selectDate('next-year')">
          下个年
        </DewButton>
      </div>
    </div>
    <div :class="bem.e('body')">
      <table :class="bemTable.b()" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th v-for="(day, index) in weekDays" :key="index">
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rid) in rows" :key="rid">
            <td
              v-for="(cell, cid) in row"
              :key="cid"
              :class="[
                bemTableCell.b(),
                bemTableCell.e(cell.type),
                getCellClass(cell),
              ]"
              @click="handlePick(cell)"
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

<style scoped></style>
