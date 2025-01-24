import { defineComponent, h, onMounted, onUpdated, ref } from 'vue'
import { virtualItemProps } from './props'

export default defineComponent({
  name: 'virtual-item',
  props: virtualItemProps,
  emits: ['itemResize'],
  setup(props, { emit }) {
    const root = ref<HTMLElement | null>(null)
    function dispatch() {
      emit('itemResize', props.uniqueKey, root.value?.offsetHeight)
    }
    onMounted(() => {
      dispatch()
    })
    onUpdated(() => {
      dispatch()
    })
    return () => {
      const { component: Component, source, uniqueKey } = props
      return (
        Component && (
          <div key={uniqueKey} ref={root}>
            <Component source={source}></Component>
          </div>
        )
      )
    }
  }
})
