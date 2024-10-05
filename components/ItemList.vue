<script setup lang="ts">
const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'error'): void
}>()

const database = useDatabase()
</script>

<template>
  <div class="item-list">
    <ItemDetail
      v-for="item in database.allItems"
      :key="item.name"
      :item="item"
      @delete="emit('delete')"
      @error="emit('error')"
    />
  </div>
</template>

<style scoped>
.item-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
}
</style>
