<script setup lang="ts">
const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'error'): void;
}>()

const database = useDatabase()

const deleteItem = (key: string) => {
  const db = database.value.db
  if (!db) { return }
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

const showFile = (file: File) => {
  const objectURL = URL.createObjectURL(file)
  window.open(objectURL)
}
</script>

<template>
  <div class="item-list">
    <div class="item" v-for="item in database.allItems">
      {{ item.name }}

      <button v-if="item.file" @click="showFile(item.file)">File</button>
      <button @click="deleteItem(item.name)">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.item-list {
  display: flex;
  flex-direction: column;
}
</style>
