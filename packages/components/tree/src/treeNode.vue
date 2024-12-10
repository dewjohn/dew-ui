<template>
  <div :class="bem.b()">
    <div
      :class="bem.e('content')"
      :style="{ paddingLeft: `${node.level * 16}px` }"
    >
      <span
        :class="[bem.e('expand-icon'), { expanded: expanded && !node.isLeaf }]"
      >
        <dew-icon size="16" color="pink"><Switcher /></dew-icon>
      </span>
      <span> {{ node?.label }} </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Switcher from './icon/Switcher'
import DewIcon from '@dew-ui/components/icon'
import { createNameSpace } from '@dew-ui/utils/create'
import { treeNodeProps } from './tree'
defineProps(treeNodeProps)
const bem = createNameSpace('tree-node')
</script>

<style scoped></style>
