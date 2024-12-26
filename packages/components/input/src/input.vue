<template>
  <div :class="[bem.b()]">
    <div :class="bem.e('group')">
      <div v-if="slots.prepend" :class="bem.be('group', 'prepend')">
        <slot name="prepend"></slot>
      </div>

      <div :class="[bem.e('wrapper')]">
        <span v-if="slots.prefixIcon" :class="bem.e('prefix')">
          <slot name="prefixIcon"></slot>
        </span>

        <input
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          v-bind="attrs"
          :class="bem.e('inner')"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          ref="inputRef"
          @input="handleInput"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus"
        />

        <dew-icon v-if="showPasswordVisible" @click="handlePasswordVisible">
          e
        </dew-icon>

        <dew-icon v-if="showClearVisible" @click="handleClearVisible">
          x
        </dew-icon>

        <span v-if="slots.suffixIcon" :class="bem.e('suffix')">
          <slot name="suffixIcon"></slot>
        </span>
      </div>

      <div v-if="slots.append" :class="bem.be('group', 'append')">
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNameSpace } from '@dew-ui/utils/create'
import {
  computed,
  inject,
  nextTick,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watch
} from 'vue'
import { inputEmits, inputProps } from './input'
import { FormItemContextKey } from '../../form'

const formItemContext = inject(FormItemContextKey)

defineOptions({
  name: 'dew-input',
  inheritAttrs: false
})

const bem = createNameSpace('input')
const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)

const slots = useSlots()
const attrs = useAttrs()

const inputRef = ref<HTMLInputElement>()
const passwordVisible = ref(false)

const setNativeInputValue = () => {
  const inputEle = inputRef.value
  if (!inputEle) {
    return
  }
  inputEle.value = String(props.modelValue)
}

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('input', value)
  emit('update:modelValue', value) // 触发事件可以双向绑定
}

const handleChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value) // 触发事件可以双向绑定
}

const handleBlur = (e: FocusEvent) => {
  formItemContext?.validate('blur').catch(() => {})
  emit('blur', e)
}

const handleFocus = (e: FocusEvent) => {
  emit('focus', e)
}

const focus = async () => {
  await nextTick() // 重新获取焦点
  inputRef.value?.focus()
}

const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
  focus()
}

const handleClearVisible = () => {
  emit('input', '')
  emit('update:modelValue', '')
  focus()
}

const showPasswordVisible = computed(() => {
  return (
    props.modelValue && props.showPassword && !props.disabled && !props.readonly
  )
})

const showClearVisible = computed(() => {
  return (
    props.modelValue && props.clearable && !props.disabled && !props.readonly
  )
})

// 监控modelValue值变化
watch(
  () => props.modelValue,
  () => {
    formItemContext?.validate('change').catch(() => {})
    setNativeInputValue()
  }
)

onMounted(() => setNativeInputValue())
</script>

<style scoped></style>
