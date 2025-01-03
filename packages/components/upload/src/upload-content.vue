<template>
  <div @click="handleClick" :class="[bem.b()]">
    <slot></slot>
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
import { genId, uploadProps, UploadRawFile } from './upload'
import { createNameSpace } from '@dew-ui/utils/create'
import { uploadContentProps } from './upload-content'

defineOptions({
  name: 'dew-upload'
})
const bem = createNameSpace('upload')
const props = defineProps(uploadContentProps)
const inputRef = ref<HTMLInputElement>()

async function upload(file: UploadRawFile) {
  inputRef.value!.value = ''
  let result = await props.beforeUpload(file)

  if (result === false) return props.onRemove(file)
}

const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files!
  for (let i = 0; i < files.length; i++) {
    const rawFile = files[i] as UploadRawFile
    rawFile.uid = genId()
    props.onStart(rawFile)
    upload(rawFile)
  }
}

const handleClick = () => {
  inputRef.value!.value = ''
  inputRef.value!.click()
}
</script>
