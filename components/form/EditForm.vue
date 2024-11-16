<script setup lang="ts">
import { consola } from 'consola'

const database = useDatabase()

const props = defineProps<{
  coordinate: VerseCoordinate
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'close'): void
}>()

const toast = useToast()

const form = ref<VerseCoordinate>({ ...props.coordinate })

const editItem = (item: VerseCoordinate) => {
  if (!database.value.db) {
    return
  }
  // コーデ名の変更をチェック
  const nameChanged = props.coordinate.name !== item.name
  console.log('nameChanged', nameChanged)
  const transaction = database.value.db.transaction(['coordinates'], 'readwrite')
  const objectStore = transaction.objectStore('coordinates')

  if (nameChanged) {
    // コーデのなまえが変更されている場合はaddしてremove
    const originalName = props.coordinate.name
    const request = objectStore.add(item)
    request.addEventListener('success', () => {
      consola.success('IDBRequest<IDBValidKey> add success')
      const request = objectStore.delete(originalName)
      request.addEventListener('success', () => {
        consola.success('IDBRequest<IDBValidKey> delete success')
        toast.add({
          title: 'コーデを編集しました',
        })
        emit('edit')
      })
      request.addEventListener('error', () => {
        consola.error('IDBRequest<IDBValidKey> add error')
        toast.add({
          title: 'エラーが発生しました',
        })
        emit('close')
      })
    })
    request.addEventListener('error', () => {
      consola.error('IDBRequest<IDBValidKey> add error')
      toast.add({
        title: 'エラーが発生しました',
      })
      emit('close')
    })
  }
  else {
    // コーデのなまえが変更されていない場合はputする
    const request = objectStore.put(item)
    request.addEventListener('success', () => {
      consola.success('IDBRequest<IDBValidKey> put success')
      toast.add({
        title: 'コーデを編集しました',
      })
      emit('edit')
    })
    request.addEventListener('error', () => {
      consola.error('IDBRequest<IDBValidKey> add error')
      toast.add({
        title: 'エラーが発生しました',
      })
      emit('close')
    })
  }
}
</script>

<template>
  <div class="register">
    <CoordinateForm
      v-model="form"
      @update:model-value="editItem"
      @cancel="emit('close')"
    >
      <template #update>
        へんしゅう
      </template>
      <template #cancel>
        やめる
      </template>
    </CoordinateForm>
  </div>
</template>
