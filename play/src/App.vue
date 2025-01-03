<script setup lang="ts">
import { FormInstance } from '@dew-ui/components/form'
import { Key, TreeOption } from '@dew-ui/components/tree'
import { UploadRawFile } from '@dew-ui/components/upload'
import { AddCircle } from '@vicons/ionicons5'
import { reactive, ref } from 'vue'

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
  return false
}
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
  <br />
  <!-- button 组件 -->
  <dew-button
    size="medium"
    type="danger"
    :round="true"
    :loading="true"
    :disabled="true"
    icon-placement="right"
    >按钮组件</dew-button
  >
  <dew-button
    size="medium"
    type="danger"
    :round="true"
    @click="handleClickButton"
    @mousedown="handleClickButton"
  >
    <template #icon>
      <dew-icon><AddCircle></AddCircle></dew-icon></template
    >图标按钮</dew-button
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
  <dew-upload multiple :before-upload="handleBeforeUpload">
    <dew-button>点我上传</dew-button>
  </dew-upload>
</template>

<style scoped></style>
