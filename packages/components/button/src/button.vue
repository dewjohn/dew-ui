<script setup lang="ts">
import type { VNodeChild } from 'vue'
import DewIcon from '@dew-ui/components/icon'
import { createNameSpace } from '@dew-ui/utils/create'
import { useAttrs, useSlots } from 'vue'
import LoadingIcon from '../../internal-icon/Loading'
import { buttonEmit, buttonProps } from './button'

defineOptions({
  name: 'DewButton',
  inheritAttrs: false,
})
defineProps(buttonProps)
const emit = defineEmits(buttonEmit)
const bem = createNameSpace('button')
const attrs = useAttrs()

interface ButtonSlots {
  default?: () => VNodeChild
  icon?: () => VNodeChild
}

const slots = useSlots() as ButtonSlots

function emitClick(e: MouseEvent) {
  emit('click', e)
}

function emitMouseDown(e: MouseEvent) {
  emit('mousedown', e)
}
</script>

<template>
  <button
    v-bind="attrs"
    :class="[
      bem.b(),
      bem.m(type),
      bem.m(size),
      bem.is('round', round),
      bem.is('loading', loading),
      bem.is('disabled', disabled),
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="emitClick"
    @mousedown="emitMouseDown"
  >
    <template v-if="iconPlacement === 'left' && slots.icon">
      <DewIcon>
        <LoadingIcon v-if="loading" />
        <template v-else-if="slots.icon">
          <component :is="slots.icon" />
        </template>
      </DewIcon>
    </template>
    <slot />
    <template v-if="iconPlacement === 'right'">
      <DewIcon>
        <LoadingIcon v-if="loading" />
        <template v-else-if="slots.icon">
          <component :is="slots.icon" />
        </template>
      </DewIcon>
    </template>
  </button>
</template>

<style scoped></style>
