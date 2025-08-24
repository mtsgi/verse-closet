<script setup lang="ts">
import { consola } from 'consola'

const database = useDatabase()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const toast = useToast()

const defaultCollection: VerseCollection = {
  name: 'おきにいり',
  coordinates: [],
  memo: '',
  createdAt: new Date(),
}

const form = ref<VerseCollection>({ ...defaultCollection })

const addCollection = (item: VerseCollection) => {
  if (!database.value.db) {
    return
  }
  // 登録日時を現在日時にする
  item.createdAt = new Date()
  consola.log('item', item)

  const transaction = database.value.db.transaction(['collections'], 'readwrite')
  const objectStore = transaction.objectStore('collections')
  const request = objectStore.add(item)
  request.addEventListener('success', () => {
    consola.success('IDBRequest<IDBValidKey> success')
    toast.add({
      title: 'コレクションをとうろくしました',
    })
    emit('close')
  })
  request.addEventListener('error', () => {
    consola.error('IDBRequest<IDBValidKey> error')
    toast.add({
      title: 'コレクションをとうろくできませんでした',
    })
    emit('close')
  })
}
</script>

<template>
  <div class="register">
    <CollectionForm
      v-model="form"
      @update:model-value="addCollection"
      @cancel="emit('close')"
    >
      <template #update>
        つくる
      </template>
      <template #cancel>
        やめる
      </template>
    </CollectionForm>
  </div>
</template>
