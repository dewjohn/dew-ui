<template>
  <i :class="bem.b()" :style="style">
    <slot></slot>
  </i>
</template>

<script setup lang="ts">
import { createNameSpace } from '@dew-ui/utils/create';
import { iconProps } from './icon';
import { computed } from 'vue';

defineOptions({
  name: 'dew-icon'
})

const bem = createNameSpace('icon')

// 计算属性 来计算一个样式来处理
const props = defineProps(iconProps)
const style = computed(() => {
  if (!props.color && !props.size) return {}
  return {
    ...(props.color ? { color: props.color } : {}),
    ...(props.size ? { 'font-size': props.size + 'px' } : {})
  }
})


</script>