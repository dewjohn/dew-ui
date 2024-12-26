<template>
  <div
    :class="[
      bem.b(),
      bem.is('success', validateState === 'success'),
      bem.is('error', validateState === 'error')
    ]"
  >
    <label :class="bem.e('label')">
      <slot name="label">{{ label }}</slot>
    </label>
    <div :class="bem.e('content')">
      <slot></slot>
      <div :class="bem.e('error')">
        <slot name="error">{{ validateMessage }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNameSpace } from '@dew-ui/utils/create'
import { computed, inject, onMounted, provide, ref, toRefs } from 'vue'
import {
  Arrayable,
  FormItemContext,
  FormItemContextKey,
  formItemProps,
  FormItemRule,
  FormItemValidateState
} from './form-item'
import { FormContextKey } from './form'
import AsyncValidator, { Values } from 'async-validator'

defineOptions({
  name: 'dew-form-item'
})

const bem = createNameSpace('form-item')
const props = defineProps(formItemProps)
const formContext = inject(FormContextKey)

const validateState = ref<FormItemValidateState>('')
const validateMessage = ref('')

const converArray = (rules: Arrayable<FormItemRule> | undefined) => {
  return rules ? (Array.isArray(rules) ? rules : [rules]) : []
}

const _rules = computed(() => {
  const mergeRules: FormItemRule[] = converArray(props.rules) // formItem上写的规则
  const formRules = formContext?.rules // form上写的规则
  if (formRules && props.prop) {
    const formRule = formRules[props.prop]
    if (formRule) {
      mergeRules.push(...converArray(formRule))
    }
  }
  return mergeRules
})

const getRuleFilter = (trigger: string) => {
  // blur change ''
  const rules = _rules.value
  return rules.filter(rule => {
    if (!rule.trigger || !trigger) return true // 这种情况意味着无论如何都要校验
    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger)
    } else {
      return rule.trigger === trigger
    }
  })
}

const onValidationSuccessed = () => {
  validateState.value = 'success'
  validateMessage.value = ''
}

const onValidationFailed = (err: Values) => {
  validateState.value = 'error'
  const { errors } = err
  validateMessage.value = errors ? errors[0].message : ''
}

const validate: FormItemContext['validate'] = async (trigger, callback?) => {
  // 拿到触发的时机，校验是否可以通过调用callback或者调用promise.then方法
  const rules = getRuleFilter(trigger)

  const modelName = props.prop!
  const validator = new AsyncValidator({
    [modelName]: rules
  })
  const model = formContext!.model!
  return validator
    .validate({
      [modelName]: model[modelName]
    })
    .then(() => {
      onValidationSuccessed()
    })
    .catch(err => {
      onValidationFailed(err)
      return Promise.reject(err)
    })
}

const context: FormItemContext = {
  ...props,
  validate
}

provide(FormItemContextKey, context)

onMounted(() => {
  formContext?.addField(context) // 将自己的上下文给父级
})
</script>

<style scoped></style>
