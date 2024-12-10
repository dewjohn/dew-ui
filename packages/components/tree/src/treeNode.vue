<template>
  <div :class="bem.b()">
    <div
      :class="bem.e('content')"
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
      <span> {{ node?.label }} </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import SwitcherIcon from './icon/Switcher'
import LoadingIcon from './icon/Loading'
import DewIcon from '@dew-ui/components/icon'
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
</script>

<style scoped></style>
