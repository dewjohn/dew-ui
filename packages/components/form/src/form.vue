<script setup lang="ts">
import type { Values } from 'async-validator'
import type { FormContext } from './form'
import type { FormItemContext } from './form-item'
import { createNameSpace } from '@dew-ui/utils/create'
import { provide } from 'vue'
import { FormContextKey, formProps } from './form'

defineOptions({
  name: 'DewForm',
})

const props = defineProps(formProps)

const bem = createNameSpace('form')

const fields: FormItemContext[] = [] // 收集儿子校验方法
const addField: FormContext['addField'] = (context) => {
  fields.push(context)
}

// 在父级中调用所有子item的校验方法
async function validate(callback?: (valid: boolean, fields?: Values) => void) {
  let errors: Values = {}
  for (const field of fields) {
    try {
      await field.validate('')
    }
    catch (error) {
      errors = {
        ...errors,
        ...(error as Values).fields,
      }
    }
  }
  if (Object.keys(errors).length === 0) {
    return callback?.(true)
  }
  else {
    if (callback) {
      callback?.(false, errors)
    }
    else {
      return Promise.reject(errors)
    }
  }
}

const context = {
  ...props,
  addField,
}
provide(FormContextKey, context)

// 将form表单的校验方法暴露给用户，用户可以通过ref来进行检测
defineExpose({
  validate,
})
</script>

<template>
  <form :class="[bem.b()]">
    <slot />
  </form>
</template>

<style scoped></style>
