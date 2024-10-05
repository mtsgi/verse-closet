<script setup lang="ts">
const props = defineProps<{
  db: IDBDatabase
}>()

const emit = defineEmits<{
  (e: 'register'): void
  (e: 'error'): void
}>()

const formName = ref<string>('')
const formFile = useTemplateRef<HTMLInputElement>('formFile')

const addItem = () => {
  const file = formFile.value?.files?.item(0) || undefined
  const item: CoordinateItem = {
    name: formName.value,
    file,
  }

  const transaction = props.db.transaction(['items'], 'readwrite')
  const objectStore = transaction.objectStore('items')
  const request = objectStore.add(item)
  request.addEventListener('success', () => {
    console.log('IDBRequest<IDBValidKey> success')
    emit('register')
  })
  request.addEventListener('error', () => {
    console.log('IDBRequest<IDBValidKey> error')
    emit('error')
  })
}
</script>

<template>
  <div class="register">
    <UInput
      v-model="formName"
      type="text"
    />
    <input
      ref="formFile"
      type="file"
      accept="image/*"
    >
    <UButton @click="addItem">
      Add
    </UButton>
  </div>
</template>

<style lang="scss" scoped>
.register {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
}
</style>
