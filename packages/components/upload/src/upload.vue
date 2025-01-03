<template>
  <UploadContent>
    <slot> </slot>
  </UploadContent>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UploadContent from './upload.vue'
import { UploadContentProps } from './upload-content'
import { uploadProps } from './upload'
defineOptions({
  name: 'dew-upload'
})

const props = defineProps(uploadProps)

const UploadContentProps = computed<UploadContentProps>(() => ({
  ...props,
  onStart: rawFile => {},
  onProgress: e => {},
  onRemove: UploadRawFile => {},
  onError: err => {},
  onSuccess: res => {}
}))
</script>
