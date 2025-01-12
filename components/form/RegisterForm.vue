<script setup lang="ts">
import { consola } from 'consola'

const database = useDatabase()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'error'): void
}>()

const toast = useToast()

const defaultItemState: CoordinateItemState<'tops'> = {
  type: 'tops',
  number: 0,
  bp: 0,
  id: '',
  name: '',
}
const defaultCoordinate: VerseCoordinate = {
  name: '',
  rarity: 1,
  brandName: '',
  pool: [],
  itemType: ['tops', 'bottoms', 'shoes', 'accessory'],
  items: {
    tops: { ...defaultItemState, type: 'tops' },
    bottoms: { ...defaultItemState, type: 'bottoms' },
    onepiece: { ...defaultItemState, type: 'onepiece' },
    shoes: { ...defaultItemState, type: 'shoes' },
    accessory: { ...defaultItemState, type: 'accessory' },
  },
  tags: [],
  memo: '',
}

const form = ref<VerseCoordinate>({ ...defaultCoordinate })

const addItem = (item: VerseCoordinate) => {
  if (!database.value.db) {
    return
  }
  console.log('item', item)

  const transaction = database.value.db.transaction(['coordinates'], 'readwrite')
  const objectStore = transaction.objectStore('coordinates')
  const request = objectStore.add(item)
  request.addEventListener('success', () => {
    consola.success('IDBRequest<IDBValidKey> success')
    toast.add({
      title: 'コーデをとうろくしました',
    })
    emit('close')
  })
  request.addEventListener('error', () => {
    consola.error('IDBRequest<IDBValidKey> error')
    emit('error')
  })
}
</script>

<template>
  <div class="register">
    <CoordinateForm
      v-model="form"
      @update:model-value="addItem"
      @cancel="emit('close')"
    >
      <template #update>
        とうろく
      </template>
      <template #cancel>
        やめる
      </template>
    </CoordinateForm>
  </div>
</template>
