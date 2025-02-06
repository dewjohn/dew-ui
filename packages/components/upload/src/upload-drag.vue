<script setup lang="ts">
import { ref } from 'vue'
import { uploadDragFileEmit } from './upload'

const emit = defineEmits(uploadDragFileEmit)
const isOver = ref(false)
function onDrop(e: DragEvent) {
  e.stopPropagation()
  emit('file', Array.from(e.dataTransfer!.files) as any as FileList)
}

function onDragover() {
  isOver.value = true
}
</script>

<template>
  <div
    @dragover.prevent="onDragover"
    @dragleave.prevent="$event => (isOver = false)"
    @drag.prevent="onDrop"
  >
    <slot />
  </div>
</template>
