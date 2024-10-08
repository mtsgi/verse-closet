<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  coordinate: VerseCoordinate
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'delete'): void
  (e: 'error'): void
}>()

const database = useDatabase()
const toast = useToast()

const imageURL = computed(() => {
  if (props.coordinate.file) {
    return URL.createObjectURL(props.coordinate.file)
  }
  return null
})

const deleteItem = (key: string) => {
  const db = database.value.db
  if (!db) {
    return
  }
  const transaction = db.transaction(['coordinates'], 'readwrite')
  const objectStore = transaction.objectStore('coordinates')
  const request = objectStore.delete(key)
  request.addEventListener('success', () => {
    toast.add({
      title: 'コーデを削除しました',
    })
    console.log('IDBRequest<undefined> success')
    emit('delete')
  })
  request.addEventListener('error', () => {
    console.log('IDBRequest<undefined> error')
    emit('error')
  })
}
</script>

<template>
  <UModal
    :open="props.modelValue"
    title="コーデの詳細"
    :close="true"
    @update:open="value => emit('update:modelValue', value)"
  >
    <template #body>
      <img
        v-if="imageURL"
        :src="imageURL"
        :alt="props.coordinate.name"
      >
      <UButton
        icon="i-heroicons-trash"
        size="lg"
        variant="soft"
        block
        @click="deleteItem(props.coordinate.name)"
      />
      {{ props.coordinate }}
    </template>
  </UModal>
</template>
