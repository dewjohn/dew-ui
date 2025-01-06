<template>
  <div
    @dragover.prevent="onDragover"
    @dragleave.prevent="$event => (isOver = false)"
    @drag.prevent="onDrop"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOver = ref(false)
const emit = defineEmits()

const onDrop = (e: DragEvent) => {
  e.stopPropagation()
  emit('file', Array.from(e.dataTransfer!.files))
  console.log(e.dataTransfer?.files)
}

const onDragover = () => {
  isOver.value = true
}
</script>
