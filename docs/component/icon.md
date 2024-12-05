# Icon 图标

dew-ui 推荐使用 xicons 作为图标库

```
pnpm instatll@vicons/ionicons5
```

## 使用图标

- 如果你想像用例一样直接使用，你需要全局注册组件，才能够直按在项目里使用。

<script setup lang="ts">
import { CashOutline } from '@vicons/ionicons5'
</script>

<dew-icon color="red" size="40">
  <CashOutline/>
</dew-icon>

<dew-icon color="green" size="60">
  <CashOutline/>
</dew-icon>

<dew-icon color="blue" size="80">
  <CashOutline/>
</dew-icon>

```vue
<script setup lang="ts">
import { CashOutline } from '@vicons/ionicons5'
</script>

<template>
  <dew-icon :color="'yellow'" :size="40">
    <CashOutline></CashOutline>
  </dew-icon>
</template>
```

## API

### Icon Props

| 名称  | 类型             | 默认值    | 说明     |
| ----- | ---------------- | --------- | -------- |
| color | string           | undefined | 图标颜色 |
| size  | number \| string | undefined | 图标大小 |
