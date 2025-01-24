<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits()
const isOver = ref(false)
function onDrop(e: DragEvent) {
  e.stopPropagation()
  emit('file', Array.from(e.dataTransfer!.files))
  console.log(e.dataTransfer?.files)
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
