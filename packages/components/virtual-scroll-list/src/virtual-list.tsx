import type { RangeOptions, updateType } from './props'
import { defineComponent, h, onBeforeMount, ref } from 'vue'
import { virtualProps } from './props'
import { initVirtual } from './virtual'
import VirtualItem from './virtual-item'

export default defineComponent({
  name: 'dew-virtual-scroll-list',
  props: virtualProps,
  setup(props) {
    // 默认情况下我们希望显示30条数据，其他的要用“空白”来代替，给内部盒子一个非常高的高度
    // 用上下padding来撑开
    // 需要先定义一下数据的显示范围，还有上padding和下padding的一个大小
    const range = ref<RangeOptions | null>(null)
    const root = ref<HTMLElement | null>()
    let virtualIns: ReturnType<typeof initVirtual>
    const update: updateType = (newRange: RangeOptions) => {
      range.value = newRange
    }
    const getUniqueIdFormDataSource = () => {
      const { dataSources, dataKey } = props
      return dataSources.map(
        dataSource => (dataSource as any)[dataKey],
      ) as string[]
    }
    const installVirtual = () => {
      // 初始化逻辑
      virtualIns = initVirtual(
        {
          keeps: props.keeps,
          buffer: Math.round(props.keeps / 3),
          uniqueIds: getUniqueIdFormDataSource(),
          estimateSize: props.estimateSize,
        },
        update,
      )
    }

    onBeforeMount(() => {
      installVirtual()
    })

    function onScroll() {
      if (root.value) {
        const offset = root.value.scrollTop
        virtualIns.handleScroll(offset)
      }
    }

    function generateComponent() {
      const slots = []
      const { start, end } = range.value!
      const { dataSources, dataComponent: PropsComponent, dataKey } = props
      for (let index = start; index <= end; index++) {
        const dataSource = dataSources[index]
        const uniqueKey = (dataSource as any)[dataKey]
        if (dataSource) {
          slots.push(
            <VirtualItem
              uniqueKey={uniqueKey}
              source={dataSource}
              onItemResize={onItemResize}
              component={PropsComponent}
            >
            </VirtualItem>,
          )
        }
      }
      return slots
    }
    function onItemResize(id: string | number, size: number) {
      virtualIns.saveSize(id, size)
    }
    return () => {
      const { padFront, padBehind } = range.value!
      const paddinStyle = {
        padding: `${padFront}px 0 ${padBehind}px 0`,
      }
      return (
        <div onScroll={onScroll} ref={root}>
          <div class="wrapper" style={paddinStyle}>
            {generateComponent()}
          </div>
        </div>
      )
    }
  },
})
