<script setup lang="ts">
import { consola } from 'consola'

const database = useDatabase()

const props = defineProps<{
  collection: VerseCollection
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'close'): void
}>()

const toast = useToast()

const form = ref<VerseCollection>({ ...props.collection })

const editItem = (item: VerseCollection) => {
  if (!database.value.db) {
    return
  }
  // コレクション名の変更をチェック
  const nameChanged = props.collection.name !== item.name
  // console.log('nameChanged', nameChanged)
  const transaction = database.value.db.transaction(['collections'], 'readwrite')
  const objectStore = transaction.objectStore('collections')

  if (nameChanged) {
    // コレクションのなまえが変更されている場合はaddしてremove
    const originalName = props.collection.name
    const request = objectStore.add(item)
    request.addEventListener('success', () => {
      consola.success('IDBRequest<IDBValidKey> add success')
      const request = objectStore.delete(originalName)
      request.addEventListener('success', () => {
        consola.success('IDBRequest<IDBValidKey> delete success')
        toast.add({
          title: 'コレクションをへんしゅうしました',
        })
        emit('edit')
      })
      request.addEventListener('error', () => {
        consola.error('IDBRequest<IDBValidKey> add error')
        toast.add({
          title: 'エラーがはっせいしました',
        })
        emit('close')
      })
    })
    request.addEventListener('error', () => {
      consola.error('IDBRequest<IDBValidKey> add error')
      toast.add({
        title: 'エラーがはっせいしました',
      })
      emit('close')
    })
  }
  else {
    // コレクションのなまえが変更されていない場合はputする
    const request = objectStore.put(item)
    request.addEventListener('success', () => {
      consola.success('IDBRequest<IDBValidKey> put success')
      toast.add({
        title: 'コレクションをへんしゅうしました',
      })
      emit('edit')
    })
    request.addEventListener('error', () => {
      consola.error('IDBRequest<IDBValidKey> put error')
      toast.add({
        title: 'エラーがはっせいしました',
      })
      emit('close')
    })
  }
}
</script>

<template>
  <div class="register">
    <CollectionForm
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
    </CollectionForm>
  </div>
</template>
