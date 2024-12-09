<script setup lang="ts">
import { AddCircle } from '@vicons/ionicons5'
import { ref } from 'vue'

function createData(level = 4, parentKey = ''): any {
  if (!level) return []
  const arr = new Array(6 - level).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      name: createLabel(level),
      key,
      children: createData(level - 1, key)
    }
  })
}

function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}

const data = ref(createData())
console.log(data.value)
</script>

<template>
  <!-- icon 组件 -->
  <dew-icon :color="'yellow'" :size="40"><AddCircle></AddCircle></dew-icon>

  <!-- 树组件，传递一个树形组件 -->
  <dew-tree
    :data="data"
    label-filed="name"
    key-filed="key"
    children-field="children"
  ></dew-tree>
</template>

<style scoped></style>
