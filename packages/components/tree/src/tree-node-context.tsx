import { defineComponent, inject } from 'vue'
import { treeInjectKey, treeNodeContextProps } from './tree'

export default defineComponent({
  name: 'DewTreeNodeContext',
  props: treeNodeContextProps,
  setup(props) {
    const treeContext = inject(treeInjectKey)
    const node = props.node
    return () => {
      return treeContext?.slot.default
        ? treeContext?.slot.default({ node })
        : node?.label
    }
  }
})
