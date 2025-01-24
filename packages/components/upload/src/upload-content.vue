<script setup lang="ts">
import type { UploadRawFile } from './upload'
import { createNameSpace } from '@dew-ui/utils/create'
import { ref } from 'vue'
import { httpRequest } from './ajax'
import { genId } from './upload'
import { uploadContentProps } from './upload-content'
import UploadDrag from './upload-drag.vue'

defineOptions({
  name: 'DewUpload',
  inheritAttrs: false,
})
const props = defineProps(uploadContentProps)
const bem = createNameSpace('upload')
const inputRef = ref<HTMLInputElement>()

async function upload(file: UploadRawFile) {
  // 输入框清空
  inputRef.value!.value = '' // 上传之前清空
  const result = await props.beforeUpload(file)

  if (result === false)
    return props.onRemove(file) // 停止上传

  const { method, name, action, headers, data } = props
  httpRequest({
    method,
    file,
    name,
    action,
    headers,
    data,
    onError: (e) => {
      props.onError(e, file)
    },
    onSuccess: (res) => {
      props.onSuccess(res, file)
    },
    onProgress: (e) => {
      props.onProgress(e, file)
    },
  })
}

function uploadFiles(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    const rawFile = files[i] as UploadRawFile
    rawFile.uid = genId()
    props.onStart(rawFile)
    upload(rawFile)
  }
}

function handleChange(e: Event) {
  const files = (e.target as HTMLInputElement).files!
  uploadFiles(files)
}

function handleClick() {
  inputRef.value!.value = ''
  inputRef.value!.click()
}
</script>

<template>
  <div :class="[bem.b()]" @click="handleClick">
    <template v-if="drag">
      <UploadDrag @file="uploadFiles">
        <slot />
      </UploadDrag>
    </template>
    <template v-else>
      <slot />
    </template>
    <input
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multile"
      @change="handleChange"
    >
  </div>
</template>
