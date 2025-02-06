<script setup lang="ts">
import type { UploadFile, UploadFiles, UploadRawFile } from './upload'
import type { UploadContentProps } from './upload-content'
import { computed, ref, watch } from 'vue'
import { uploadFileEmit, uploadProps } from './upload'
import UploadContent from './upload-content.vue'

defineOptions({
  name: 'DewUpload',
})

const props = defineProps(uploadProps)
const emit = defineEmits(uploadFileEmit)
const uploadFiles = ref<UploadFiles>(props.FileList)

watch(uploadFiles, (newVal) => {
  // 监控文件变化 发射事件
  emit('update:fileList', newVal)
})

function findFile(rawFile: UploadRawFile) {
  return uploadFiles.value.find(file => file.uid === rawFile.uid)
}

const uploadContentProps = computed<UploadContentProps>(() => ({
  ...props,
  onStart: (rawFile) => {
    // 上传之前的逻辑
    const uploadFile: UploadFile = {
      uid: rawFile.uid,
      name: rawFile.name,
      percentage: 0,
      raw: rawFile,
      size: rawFile.size,
      status: 'start',
    }
    uploadFile.url = URL.createObjectURL(rawFile)
    uploadFiles.value = [...uploadFiles.value, uploadFile]
    props.onChange(uploadFile)
  },
  onProgress: (e, rawFile) => {
    const uploadFile = findFile(rawFile)!
    uploadFile.status = 'uploading'
    uploadFile.percentage = e.percentage
    props.onProgress(e, uploadFile, uploadFiles.value)
  },
  onRemove: async (rawFile) => {
    const uploadFile = findFile(rawFile)!
    const r = await props.beforeRemove(uploadFile, uploadFiles.value)
    if (r !== false) {
      const fileList = uploadFiles.value
      fileList.splice(fileList.indexOf(uploadFile), 1)
      props.onRemove(uploadFile, uploadFiles.value)
    }
  },
  onError: (err, rawFile) => {
    const uploadFile = findFile(rawFile)!
    uploadFile.status = 'error'
    const fileList = uploadFiles.value
    fileList.splice(fileList.indexOf(uploadFile), 1)
    props.onError(err, uploadFile, uploadFiles.value)
  },
  onSuccess: (res, rawFile) => {
    const uploadFile = findFile(rawFile)!
    uploadFile.status = 'success'
    props.onSuccess(res, uploadFile, uploadFiles.value)
  },
}))
</script>

<template>
  <UploadContent v-bind="uploadContentProps">
    <slot />
  </UploadContent>
</template>
