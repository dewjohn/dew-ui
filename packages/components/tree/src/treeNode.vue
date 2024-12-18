<template>
  <div
    :class="[
      bem.b(),
      bem.is('selected', isSelected),
      bem.is('disabled', node.disabled)
    ]"
  >
    <div
      :class="[bem.e('content')]"
      :style="{ paddingLeft: `${node.level * 16}px` }"
    >
      <span
        :class="[
          bem.e('expand-icon'),
          { expanded: expanded && !node.isLeaf },
          bem.is('leaf', node.isLeaf)
        ]"
        @click="onClickExpand"
      >
        <dew-icon size="16">
          <SwitcherIcon v-if="!isLoading" />
          <LoadingIcon v-else />
        </dew-icon>
      </span>
      <dew-checkbox
        v-if="showCheckbox"
        :model-value="checked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="handleChange"
      ></dew-checkbox>
      <span @click="handleSelected" :class="bem.e('label')">
        <DewTreeNodeContext :node="node"></DewTreeNodeContext>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import SwitcherIcon from './icon/Switcher'
import LoadingIcon from './icon/Loading'
import DewIcon from '@dew-ui/components/icon'
import DewCheckbox from '@dew-ui/components/checkbox'
import DewTreeNodeContext from './tree-node-context'
import { createNameSpace } from '@dew-ui/utils/create'
import { treeNodeEmits, treeNodeProps } from './tree'
import { computed } from 'vue'
const props = defineProps(treeNodeProps)
const emit = defineEmits(treeNodeEmits)
const bem = createNameSpace('tree-node')

function onClickExpand() {
  emit('toggle', props.node)
}

const isLoading = computed(() => {
  return props.loadingKeys?.has(props.node.key)
})

const isSelected = computed(() => {
  return props.selectedKeys.includes(props.node.key)
})

function handleSelected() {
  if (props.node.disabled) return
  emit('select', props.node)
}
function handleChange(val: boolean) {
  emit('check', props.node, val)
}
</script>

<style scoped></style>
