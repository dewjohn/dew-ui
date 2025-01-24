<script setup lang="ts">
import { FormInstance } from '@dew-ui/components/form'
import { Key, TreeOption } from '@dew-ui/components/tree'
import { UploadRawFile } from '@dew-ui/components/upload'
import { AddCircle } from '@vicons/ionicons5'
import { DefineComponent, reactive, ref } from 'vue'
import { Random } from 'mockjs'
import ItemComponent from './Item.vue'

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

function handleClickButton(e: MouseEvent) {
  console.log('点击按钮', e)
}

const value = ref<Key[]>([])
const check = ref(true)
const inputValue = ref('hello')

const handleBlur = (e: FocusEvent) => {
  console.log('blur', e)
}

const handleFocus = (e: FocusEvent) => {
  console.log('focus', e)
}

const formState = reactive({ username: '', password: '' })
const formRef = ref<FormInstance>()

const handleFormValidate = () => {
  formRef.value?.validate((valid, errors) => {
    console.log(valid, errors)
  })
}
const handleBeforeUpload = (rawFile: UploadRawFile) => {
  return true
}

const currentDate = ref(new Date())
const totalCount = 1000
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
    index
  })
}
const mockItems = ref(mockData)
</script>

<template>
  <!-- icon 组件 -->
  <dew-icon :color="'red'" :size="40"><AddCircle></AddCircle></dew-icon>

  <br />

  <!-- button 组件 -->
  <dew-button type="danger" style="margin-right: 10px" :loading="true"
    >默认按钮</dew-button
  >
  <dew-button size="small" type="danger" style="margin-right: 10px"
    >小按钮</dew-button
  >
  <dew-button size="medium" type="danger" style="margin-right: 10px"
    >中按钮</dew-button
  >
  <dew-button size="large" type="danger" style="margin-right: 10px"
    >大按钮</dew-button
  >
  <dew-button
    size="medium"
    type="primary"
    :round="true"
    :loading="true"
    @click="handleClickButton"
    @mousedown="handleClickButton"
  >
    <template #icon>
      <dew-icon><AddCircle></AddCircle></dew-icon></template
    >图标按钮</dew-button
  >

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

  <!-- input 组件 -->
  <br />
  {{ inputValue }}
  <dew-input
    v-model="inputValue"
    @blur="handleBlur"
    @focus="handleFocus"
    placeholder="占位符"
    :show-password="true"
    :clearable="true"
  >
    <template #prepend>前缀</template>
    <template #prefixIcon>
      <dew-icon>
        <AddCircle></AddCircle>
      </dew-icon>
    </template>
    <!-- <template #suffixIcon>
      <dew-icon>
        <AddCircle></AddCircle>
      </dew-icon>
    </template> -->
    <template #append>后缀</template>
  </dew-input>
  <br />
  <!-- form 组件 -->
  <dew-form
    :model="formState"
    ref="formRef"
    :rules="{
      username: {
        min: 6,
        max: 10,
        message: '用户名6-10位',
        trigger: ['change', 'blur']
      }
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
          trigger: ['change', 'blur']
        }
      ]"
    >
      <dew-input
        placeholder="请输入用户名"
        v-model="formState.username"
      ></dew-input>
      <!-- <template #label>用户名插槽</template> -->
    </dew-form-item>

    <dew-form-item
      prop="password"
      label="密码"
      :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
    >
      <dew-input
        placeholder="请输入密码"
        type="password"
        v-model="formState.password"
      ></dew-input>
    </dew-form-item>
    <dew-button @click="handleFormValidate">校验</dew-button>
  </dew-form>

  <!--  上传组件-->
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
    :estimateSize="80"
    :dataComponent="ItemComponent as DefineComponent<{}, {}, any>"
  ></dew-virtual-scroll-list>
</template>

<style scoped lang="scss">
.virtual-list {
  width: 100%;
  height: 500px;
  overflow-y: scroll;
  border: 3px solid rgb(143, 184, 214);
}
</style>
