import { createNameSpace } from '@dew-ui/utils/create'
import {
  computed,
  defineComponent,
  h,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'

export default defineComponent({
  name: 'DewVirtualList',
  props: {
    size: {
      type: Number,
      default: 35
    },
    remain: {
      type: Number,
      default: 8
    },
    items: {
      type: Array,
      default: []
    }
  },
  setup(props, { slots }) {
    const bem = createNameSpace('vl')
    const wrapperRef = ref<HTMLDivElement>()
    const barRef = ref<HTMLDivElement>()
    const offset = ref(0)
    const state = reactive({
      // 计算显示的区域
      start: 0,
      end: props.remain
    })
    // 为了美观多补几条数据
    const prev = computed(() => {
      return Math.min(state.start, props.remain)
    })
    const next = computed(() => {
      return Math.min(props.remain, props.items.length - state.end)
    })

    // 这里应该多展示 上8条下8条，保证用户在快速滚动的时候 不会白屏
    const visibleData = computed(() => {
      // 上下都补点
      return props.items.slice(state.start - prev.value, state.end + next.value)
    })

    const handleScroll = () => {
      // 根据当前滚动的距离，来算过去了多少个数据
      const scrollTop = wrapperRef.value!.scrollTop
      // 滑过去了多少个
      state.start = Math.floor(scrollTop / props.size)
      // 最多显示8条
      state.end = state.start + props.remain
      // 滚过去了多少个(偏移量)
      offset.value = state.start * props.size - props.size * prev.value // 当前位置减去上面补的那几条
    }

    function initWrapper() {
      wrapperRef.value!.style.height = props.remain * props.size + 'px'
      barRef.value!.style.height = props.items.length * props.size + 'px'
    }

    watch(() => props.items, initWrapper)

    onMounted(() => initWrapper())

    return () => {
      return (
        <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
          {/* 模拟总长度，感觉好像很多数据 */}
          <div class={bem.e('scroll-bar')} ref={barRef}></div>
          {/* 更新列表从哪里显示到哪里,一直展示8条数据 */}
          <div
            class={bem.e('scroll-list')}
            style={{ transform: `translate3d(0,${offset.value}px, 0)` }}
          >
            {visibleData.value.map((node, idx) => slots.default!({ node }))}
          </div>
        </div>
      )
    }
  }
})
