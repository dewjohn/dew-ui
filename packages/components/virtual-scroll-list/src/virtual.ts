import type { RangeOptions, updateType, VirtualOptions } from './props'

enum CALC_TYPE {
  INIT = 'INIT',
  FIXED = 'FIXED',
  DYNAMIC = 'DYNAMIC',
}

export function initVirtual(param: VirtualOptions, update: updateType) {
  const range: RangeOptions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0,
  }
  let firstRangeAvg = 0
  let offsetValue = 0 // 没有触发滚动之前的变量
  let fixedSizeVal = 0 // 默认值是0
  let calcType = CALC_TYPE.INIT
  const sizes = new Map<string | number, number>()

  function isFixed() {
    return calcType === CALC_TYPE.FIXED
  }

  function getEstimateSize() {
    // 优化平均值
    return isFixed() ? fixedSizeVal : firstRangeAvg || param.estimateSize
  }
  function getIndexOffset(idx: number) {
    if (!idx)
      return 0
    let offset = 0
    for (let i = 0; i < idx; i++) {
      const indexSize = sizes.get(param.uniqueIds[i])
      offset += typeof indexSize === 'number' ? indexSize : getEstimateSize()
    }
    return offset
  }
  function getPadFront() {
    if (isFixed()) {
      return fixedSizeVal * range.start
    }
    else {
      return getIndexOffset(range.start)
    }
  }
  function getPadBehind() {
    const lastIndex = param.uniqueIds.length - 1
    return (lastIndex - range.end) * getEstimateSize()
  }
  function updateRange(start: number, end: number) {
    range.start = start
    range.end = end
    range.padFront = getPadFront()
    range.padBehind = getPadBehind()
    update({ ...range })
  }
  function checkRange(start: number, end: number) {
    const total = param.uniqueIds.length // 所有数据
    const keeps = param.keeps
    if (total < keeps) {
      start = 0
      end = total - 1
      // 最后滑动到了100条 但是要显示71 - 100
      // start = 90 - end=100
    }
    else if (end - start < keeps - 1) {
      start = end - keeps + 1
    }
    updateRange(start, end)
  }

  function getScrollOvers() {
    // 根据划过的偏移量 / 每项高度 = 划过个数
    if (isFixed()) {
      return Math.floor(offsetValue / getEstimateSize())
    }
    else {
      // 精确找到滚动了多少个
      // 获取最接近的滚动的那一项，计算每一项的偏移量，看与哪一项最接近
      let low = 0
      let high = param.uniqueIds.length
      let middle = 0
      let middleOffset = 0
      while (low <= high) {
        middle = low + Math.floor((high - low) / 2)
        middleOffset = getIndexOffset(middle)
        if (middleOffset === offsetValue) {
          return middle
        }
        else if (middleOffset < offsetValue) {
          low = middle + 1
        }
        else if (middleOffset > offsetValue) {
          high = middle - 1
        }
      }
      return low > 0 ? --low : 0
    }
  }

  function getEndByStart(start: number) {
    const computedEnd = start + param.keeps - 1
    const end = Math.min(computedEnd, param.uniqueIds.length - 1)
    return end
  }

  function handleScrollFront() {
    // 核心就是向上滑动要不要更新start
    // 获取划过了多少个
    const overs = getScrollOvers()
    if (overs > range.start) {
      // 从30开始展示，展示30条，目前位于40，向上划到了35，是在展示范围内
      return
    }
    // 划过了8个，但是开始是15，缓冲区是10个
    const start = Math.max(overs - param.buffer, 0)
    checkRange(start, getEndByStart(start))
  }

  function handleScrollBehind() {
    const overs = getScrollOvers() // 滚动了1000像素 / 每项80高 = 划过了多少项
    if (overs < range.start + param.buffer) {
      // 向下加载的时候看一下是否在缓冲区中
      return
    }
    checkRange(overs, getEndByStart(overs))
  }

  function handleScroll(offset: number) {
    // 分辨向上滚动还是向下
    const direction = offset < offsetValue ? 'FRONT' : 'BEHIND'
    offsetValue = offset
    if (direction === 'FRONT') {
      handleScrollFront()
    }
    if (direction === 'BEHIND') {
      handleScrollBehind()
    }
  }

  function saveSize(id: string | number, size: number) {
    sizes.set(id, size)
    if (calcType === CALC_TYPE.INIT) {
      // 第一个元素加载完毕后默认认为是固定高度
      fixedSizeVal = size
    }
    else if (calcType === CALC_TYPE.FIXED && fixedSizeVal !== size) {
      calcType = CALC_TYPE.DYNAMIC
      fixedSizeVal = 0 // 默认采用estimateSize
    }
    if (calcType === CALC_TYPE.DYNAMIC) {
      // 根据已经加载的数据算一个平均值，来撑开滚动条
      // 根据当前展示的数据 来计算一个滚动条的值
      if (sizes.size < Math.min(param.keeps, param.uniqueIds.length)) {
        firstRangeAvg = Math.round([...sizes.values()].reduce((acc, cur) => acc + cur, 0) / sizes.size)
      }
    }
  }

  checkRange(0, param.keeps - 1)
  return {
    handleScroll,
    saveSize,
  }
}
