<template>
  <label :class="bem.b()">
    <span :class="bem.e('input')">
      <input
        type="checkbox"
        v-model="model"
        ref="inputRef"
        :disabled="disabled"
        :value="label"
        @change="handleChange"
      />
    </span>
    <span v-if="$slots.default || label" :class="bem.e('label')">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script setup lang="ts">
import { createNameSpace } from '@dew-ui/utils/create'
import { checkboxEmit, checkboxProps } from './checkbox'
import { computed, onMounted, ref, watch } from 'vue'
defineOptions({
  name: 'dew-checkbox'
})
const bem = createNameSpace('checkbox')
const props = defineProps(checkboxProps)
const emit = defineEmits(checkboxEmit)
const inputRef = ref<HTMLInputElement>()
const model = computed({
  get() {
    return props.modelValue
  },
  set(val: string | number | boolean) {
    emit('update:modelValue', val)
  }
})

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement
  const value = target.checked ? true : false
  emit('change', value)
}

// 半选状态
function indeterminate(val: boolean) {
  inputRef.value!.indeterminate = val
}

watch(() => props.indeterminate, indeterminate)

onMounted(() => {
  indeterminate(props.indeterminate)
})
</script>

<style scoped></style>
