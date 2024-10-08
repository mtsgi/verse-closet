<script setup lang="ts">
const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'error'): void
}>()

const database = useDatabase()
</script>

<template>
  <div class="item-list">
    <CoordinateDetail
      v-for="coordinate in database.allCoordinates"
      :key="coordinate.name"
      :coordinate="coordinate"
      @delete="emit('delete')"
      @error="emit('error')"
    />
  </div>
</template>

<style scoped>
.item-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
</style>
