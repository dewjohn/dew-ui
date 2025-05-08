<script setup lang="ts">
import DewCheckbox from '@dew-ui/components/checkbox'
import DewIcon from '@dew-ui/components/icon'
import LoadingIcon from '@dew-ui/components/internal-icon/Loading'
import SwitcherIcon from '@dew-ui/components/internal-icon/Switcher'
import { createNameSpace } from '@dew-ui/utils/create'
import { computed } from 'vue'
import { treeNodeEmits } from './tree'
import DewTreeNodeContext from './tree-node-context'
import { treeNodeProps } from './treeNode'

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
  if (props.node.disabled)
    return
  emit('select', props.node)
}
function handleChange(val: boolean) {
  emit('check', props.node, val)
}
</script>

<template>
  <div
    :class="[
      bem.b(),
      bem.is('selected', isSelected),
      bem.is('disabled', node.disabled),
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
          bem.is('leaf', node.isLeaf),
        ]"
        @click="onClickExpand"
      >
        <DewIcon size="16">
          <SwitcherIcon v-if="!isLoading" />
          <LoadingIcon v-else />
        </DewIcon>
      </span>
      <DewCheckbox
        v-if="showCheckbox"
        :model-value="checked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="handleChange"
      />
      <span :class="bem.e('label')" @click="handleSelected">
        <DewTreeNodeContext :node="node" />
      </span>
    </div>
  </div>
</template>

<style scoped></style>
