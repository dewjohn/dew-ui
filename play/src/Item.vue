<script setup lang="ts">
defineProps({
  source: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="item" :data-index="source.index">
    <div
      class="head" :style="{
        color: 'rebeccapurple',
        fontWeight: 'bold',
        marginBottom: '20px',
        fontSize: '35px',
      }"
    >
      <span>{{ source.index }}</span>
      <span>{{ source.name }}</span>
    </div>
    <div class="body" :style="{ fontSize: '18px' }">
      <span>{{ source.desc }}</span>
    </div>
  </div>
</template>

<style scoped></style>
