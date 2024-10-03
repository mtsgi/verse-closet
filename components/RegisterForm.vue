<script setup lang="ts">
const props = defineProps<{
  db: IDBDatabase;
}>()

const emit = defineEmits<{
  (e: 'register'): void;
  (e: 'error'): void;
}>()

const formName = ref<string>('name')
const formFile = useTemplateRef<HTMLInputElement>('formFile')

const addItem = () => {
  const file = formFile.value?.files?.item(0) || undefined
  const item: CoordinateItem = {
    name: formName.value,
    file
  }

  const transaction = props.db.transaction(['items'], 'readwrite')
  const objectStore = transaction.objectStore('items')
  const request = objectStore.add(item)
  request.addEventListener('success', (event) => {
    console.log('IDBRequest<IDBValidKey> success')
    emit('register')
  })
  request.addEventListener('error', (event) => {
    console.log('IDBRequest<IDBValidKey> error')
    emit('error')
  })
}
</script>

<template>
  <div class="register">
    <input type="text" v-model="formName" />
    <input type="file" ref="formFile" accept="image/*" />
    <button @click="addItem">Add</button>
  </div>
</template>

<style scoped>
.register {
  display: flex;
  flex-direction: column;
}
</style>
