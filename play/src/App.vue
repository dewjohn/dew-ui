<script setup lang="ts">
import { Key, TreeOption } from '@dew-ui/components/tree'
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

// function createData() {
//   return [
//     {
//       label: nextLabel(),
//       key: 1,
//       isLeaf: false
//     },
//     {
//       label: nextLabel(),
//       key: 2,
//       isLeaf: false
//     }
//   ]
// }

function nextLabel(currentLabel?: string | number): string {
  if (!currentLabel) return 'Out of Tao, One is born'
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two'
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three'
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe'
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born'
  }
  return ''
}

function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}

const data = ref(createData())
// const data = ref<TreeOption[]>([
//   {
//     key: '0',
//     label: '0',
//     children: [
//       {
//         key: '0-0',
//         label: '0-0'
//       },
//       {
//         disabled: true, // 这个节点被禁用了
//         key: '0-1',
//         label: '0-1',
//         children: [
//           {
//             label: '0-1-0',
//             key: '0-1-0'
//           },
//           {
//             label: '0-1-1',
//             key: '0-1-1'
//           }
//         ]
//       }
//     ]
//   }
// ])
const handleLoad = (node: TreeOption) => {
  return new Promise<TreeOption[]>((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false
        }
      ])
    }, 1000)
  })
}

function handleChange(val: boolean) {
  console.log(val)
}
const value = ref<Key[]>([])
const check = ref(true)
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
    :on-load="handleLoad"
    v-model:selected-keys="value"
    selectable
    show-checkbox
    :default-checked-keys="['40']"
  >
    <template #default="{ node }">{{ node.key }} - {{ node.label }}</template>
  </dew-tree>

  <!-- checkbox 组件 -->
  {{ check }}
  <dew-checkbox
    v-model="check"
    :indeterminate="true"
    label="节点1"
    @change="handleChange"
    >节点2</dew-checkbox
  >
</template>

<style scoped></style>
