<template>
  <div @click="handleClick" :class="[bem.b()]">
    <template v-if="drag">
      <UploadDrag @file="uploadFiles">
        <slot></slot>
      </UploadDrag>
    </template>
    <template v-else>
      <slot></slot>
    </template>
    <input
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multile"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { genId, UploadRawFile } from './upload'
import { createNameSpace } from '@dew-ui/utils/create'
import { uploadContentProps } from './upload-content'
import UploadDrag from './upload-drag.vue'
import { httpRequest } from './ajax'

defineOptions({
  name: 'dew-upload',
  inheritAttrs: false
})
const bem = createNameSpace('upload')
const props = defineProps(uploadContentProps)
const inputRef = ref<HTMLInputElement>()

async function upload(file: UploadRawFile) {
  // 输入框清空
  inputRef.value!.value = '' // 上传之前清空
  let result = await props.beforeUpload(file)

  if (result === false) return props.onRemove(file) // 停止上传

  const { method, name, action, headers, data } = props
  httpRequest({
    method,
    file,
    name,
    action,
    headers,
    data,
    onError: e => {
      props.onError(e, file)
    },
    onSuccess: res => {
      props.onSuccess(res, file)
    },
    onProgress: e => {
      props.onProgress(e, file)
    }
  })
}

const uploadFiles = (files: FileList) => {
  for (let i = 0; i < files.length; i++) {
    const rawFile = files[i] as UploadRawFile
    rawFile.uid = genId()
    props.onStart(rawFile)
    upload(rawFile)
  }
}

const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files!
  uploadFiles(files)
}

const handleClick = () => {
  inputRef.value!.value = ''
  inputRef.value!.click()
}
</script>
