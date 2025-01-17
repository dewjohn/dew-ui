import { withInstall } from '@dew-ui/utils/with-Install'
import _Calendar from './src/calendar.vue'

const Calendar = withInstall(_Calendar)

export default Calendar

// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    DewCalendar: typeof Calendar
  }
}

export * from './src/calendar'
