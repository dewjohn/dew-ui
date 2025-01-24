<script setup lang="ts">
import { createNameSpace } from '@dew-ui/utils/create'
import { computed } from 'vue'
import { iconProps } from './icon'

defineOptions({
  name: 'DewIcon',
})

// 计算属性 来计算一个样式来处理
const props = defineProps(iconProps)

const bem = createNameSpace('icon')

const style = computed(() => {
  if (!props.color && !props.size)
    return {}
  return {
    ...(props.color ? { color: props.color } : {}),
    ...(props.size ? { 'font-size': `${props.size}px` } : {}),
  }
})
</script>

<template>
  <i :class="bem.b()" :style="style">
    <slot />
  </i>
</template>
