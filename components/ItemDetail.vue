<script setup lang="ts">
const props = defineProps<{
  item: CoordinateItem
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'error'): void
}>()

const database = useDatabase()

const deleteItem = (key: string) => {
  const db = database.value.db
  if (!db) {
    return
  }
  const transaction = db.transaction(['items'], 'readwrite')
  const objectStore = transaction.objectStore('items')
  const request = objectStore.delete(key)
  request.addEventListener('success', () => {
    console.log('IDBRequest<undefined> success')
    emit('delete')
  })
  request.addEventListener('error', () => {
    console.log('IDBRequest<undefined> error')
    emit('error')
  })
}

const imageURL = computed(() => {
  if (props.item.file) {
    return URL.createObjectURL(props.item.file)
  }
  return null
})
</script>

<template>
  <div class="item">
    <!-- 画像 -->
    <a
      v-if="imageURL"
      :href="imageURL"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        :src="imageURL"
        :alt="props.item.name"
        class="image"
      >
    </a>
    <div
      v-else
      class="image"
    />

    <!-- 名前 -->
    <div class="name">
      {{ props.item.name }}
    </div>

    <!-- 操作 -->
    <UButton
      icon="i-heroicons-trash"
      size="lg"
      variant="soft"
      @click="deleteItem(props.item.name)"
    />
  </div>
</template>

<style lang="scss" scoped>
.item {
  display: grid;
  gap: 0.5rem;
  align-items: center;
  grid-template-columns: 4rem 1fr auto;

  .image {
    width: 4rem;
    height: 4rem;
    background: #f0f0f0;
    object-fit: cover;
    border-radius: 0.5rem;
  }
}
</style>
