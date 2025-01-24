<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { FormInstance } from '@dew-ui/components/form'
import type { Key, TreeOption } from '@dew-ui/components/tree'
import type { UploadRawFile } from '@dew-ui/components/upload'
import type { DefineComponent } from 'vue'
import { AddCircle } from '@vicons/ionicons5'
import { Random } from 'mockjs'
import { reactive, ref } from 'vue'
import ItemComponent from './Item.vue'

function createData(level = 4, parentKey = ''): any {
  if (!level)
    return []
  const arr = Array.from({ length: 6 - level }).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      name: createLabel(level),
      key,
      children: createData(level - 1, key),
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
  if (!currentLabel)
    return 'Out of Tao, One is born'
  if (currentLabel === 'Out of Tao, One is born')
    return 'Out of One, Two'
  if (currentLabel === 'Out of One, Two')
    return 'Out of Two, Three'
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe'
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born'
  }
  return ''
}

function createLabel(level: number): string {
  if (level === 4)
    return '道生一'
  if (level === 3)
    return '一生二'
  if (level === 2)
    return '二生三'
  if (level === 1)
    return '三生万物'
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
function handleLoad(node: TreeOption) {
  return new Promise<TreeOption[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false,
        },
      ])
    }, 1000)
  })
}

function handleChange(val: boolean) {
  console.log(val)
}

function handleClickButton(e: MouseEvent) {
  console.log('点击按钮', e)
}

const value = ref<Key[]>([])
const check = ref(true)
const inputValue = ref('hello')

function handleBlur(e: FocusEvent) {
  console.log('blur', e)
}

function handleFocus(e: FocusEvent) {
  console.log('focus', e)
}

const formState = reactive({ username: '', password: '' })
const formRef = ref<FormInstance>()

function handleFormValidate() {
  formRef.value?.validate((valid, errors) => {
    console.log(valid, errors)
  })
}
function handleBeforeUpload(_rawFile: UploadRawFile) {
  return true
}

const currentDate = ref(new Date())
const totalCount = 100
interface DataType {
  id: number
  name: string
  desc: string
  index: number
}
const mockData: Array<DataType> = []
let index = 0
while (index++ !== totalCount) {
  mockData.push({
    id: index,
    name: Random.name(),
    desc: Random.csentence(20, 120),
    index,
  })
}
const mockItems = ref(mockData)
</script>

<template>
  <!-- icon 组件 -->
  <dew-icon color="red" :size="40">
    <AddCircle />
  </dew-icon>

  <br>

  <!-- button 组件 -->
  <dew-button type="danger" style="margin-right: 10px" :loading="true">
    默认按钮
  </dew-button>
  <dew-button size="small" type="danger" style="margin-right: 10px">
    小按钮
  </dew-button>
  <dew-button size="medium" type="danger" style="margin-right: 10px">
    中按钮
  </dew-button>
  <dew-button size="large" type="danger" style="margin-right: 10px">
    大按钮
  </dew-button>
  <dew-button
    size="medium"
    type="primary"
    :round="true"
    :loading="true"
    @click="handleClickButton"
    @mousedown="handleClickButton"
  >
    <template #icon>
      <dew-icon><AddCircle /></dew-icon>
    </template>图标按钮
  </dew-button>

  <!-- 树组件，传递一个树形组件 -->
  <dew-tree
    v-model:selected-keys="value"
    :data="data"
    label-filed="name"
    key-filed="key"
    children-field="children"
    :on-load="handleLoad"
    selectable
    show-checkbox
    :default-checked-keys="['40']"
  >
    <template #default="{ node }">
      {{ node.key }} - {{ node.label }}
    </template>
  </dew-tree>

  <!-- checkbox 组件 -->
  {{ check }}
  <dew-checkbox
    v-model="check"
    :indeterminate="true"
    label="节点1"
    @change="handleChange"
  >
    节点2
  </dew-checkbox>

  <!-- input 组件 -->
  <br>
  {{ inputValue }}
  <dew-input
    v-model="inputValue"
    placeholder="占位符"
    :show-password="true"
    :clearable="true"
    @blur="handleBlur"
    @focus="handleFocus"
  >
    <template #prepend>
      前缀
    </template>
    <template #prefixIcon>
      <dew-icon>
        <AddCircle />
      </dew-icon>
    </template>
    <!-- <template #suffixIcon>
      <dew-icon>
        <AddCircle></AddCircle>
      </dew-icon>
    </template> -->
    <template #append>
      后缀
    </template>
  </dew-input>
  <br>
  <!-- form 组件 -->
  <dew-form
    ref="formRef"
    :model="formState"
    :rules="{
      username: {
        min: 6,
        max: 10,
        message: '用户名6-10位',
        trigger: ['change', 'blur'],
      },
    }"
  >
    <dew-form-item
      prop="username"
      label="用户名"
      :rules="[
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
          min: 6,
          max: 10,
          message: '用户名至少6-10位',
          trigger: ['change', 'blur'],
        },
      ]"
    >
      <dew-input
        v-model="formState.username"
        placeholder="请输入用户名"
      />
      <!-- <template #label>用户名插槽</template> -->
    </dew-form-item>

    <dew-form-item
      prop="password"
      label="密码"
      :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
    >
      <dew-input
        v-model="formState.password"
        placeholder="请输入密码"
        type="password"
      />
    </dew-form-item>
    <dew-button @click="handleFormValidate">
      校验
    </dew-button>
  </dew-form>

  <!--  上传组件 -->
  <dew-upload multiple :before-upload="handleBeforeUpload" drag>
    <dew-button>点我上传</dew-button>
  </dew-upload>

  <!-- 日历组件 -->
  <dew-calendar v-model="currentDate">
    <template #data-cell="{ data }">
      <p :clas="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split('-').slice(1).join('-') }}
        {{ data.isSelected ? '√' : '' }}
      </p>
    </template>
  </dew-calendar>

  <!-- 虚拟列表 -->
  <dew-virtual-scroll-list
    class="virtual-list"
    :data-sources="mockItems"
    data-key="id"
    :keeps="30"
    :estimate-size="80"
    :data-component="ItemComponent as DefineComponent<{}, {}, any>"
  />
</template>

<style scoped lang="scss">
.virtual-list {
  width: 100%;
  height: 500px;
  overflow-y: scroll;
  border: 3px solid rgb(143, 184, 214);
}
</style>
