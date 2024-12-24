<template>
  <button
    :class="[
      bem.b(),
      bem.m(type),
      bem.m(size),
      bem.is('round', round),
      bem.is('loading', loading),
      bem.is('disabled', disabled)
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="emitClick"
    @mousedown="emitMouseDown"
  >
    <template v-if="iconPlacement === 'left'">
      <dew-icon>
        <LoadingIcon v-if="loading"></LoadingIcon>
        <template v-else-if="slots.icon">
          <component :is="slots.icon"></component>
        </template>
      </dew-icon>
    </template>
    <slot></slot>
    <template v-if="iconPlacement === 'right'">
      <dew-icon>
        <LoadingIcon v-if="loading"></LoadingIcon>
        <template v-else-if="slots.icon">
          <component :is="slots.icon"></component>
        </template>
      </dew-icon>
    </template>
  </button>
</template>

<script setup lang="ts">
import { createNameSpace } from '@dew-ui/utils/create'
import { buttonEmit, buttonProps } from './button'
import LoadingIcon from '../../internal-icon/Loading'
import DewIcon from '@dew-ui/components/icon'
import { useSlots, VNodeChild } from 'vue'
defineOptions({
  name: 'dew-button',
  inheritAttrs: false
})
const bem = createNameSpace('button')
const props = defineProps(buttonProps)
const emit = defineEmits(buttonEmit)

interface ButtonSlots {
  default?: () => VNodeChild
  icon?: () => VNodeChild
}

const slots = useSlots() as ButtonSlots

const emitClick = (e: MouseEvent) => {
  emit('click', e)
}

const emitMouseDown = (e: MouseEvent) => {
  emit('mousedown', e)
}
</script>

<style scoped></style>
