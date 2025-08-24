<script setup lang="ts">
import { consola } from 'consola'

const database = useDatabase()
const toast = useToast()

const props = defineProps<{
  coordinate: VerseCoordinate
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update-items'): void
}>()

/** コレクションに該当コーデを追加／削除する */
const updateCollectionStatus = (collectionName: string, value: boolean) => {
  const db = database.value.db
  if (!db) {
    return
  }
  const transaction = db.transaction(['collections'], 'readwrite')
  const objectStore = transaction.objectStore('collections')
  // 複製する
  const collection = database.value.collections.find((collection) => {
    return collection.name === collectionName
  })
  if (!collection) {
    return
  }
  const newCollection: VerseCollection = {
    ...collection,
    // チェックした時は配列に追加、外した時は配列から削除
    coordinates: value
      ? [...collection.coordinates, props.coordinate.name]
      : collection.coordinates.filter(name => name !== props.coordinate.name),
  }
  const request = objectStore.put(newCollection)
  request.addEventListener('success', () => {
    consola.success('IDBRequest<IDBValidKey> success')
    emit('update-items')
  })
  request.addEventListener('error', () => {
    consola.error('IDBRequest<IDBValidKey> add error')
    toast.add({
      title: 'こうしんできませんでした',
    })
  })
}
</script>

<template>
  <div class="add">
    <!-- 各コレクションへの登録状況 -->
    <div
      v-for="collection in database.collections"
      :key="`collection-${collection.name}`"
      class="mb-4"
    >
      <UCheckbox
        size="xl"
        :label="collection.name"
        :model-value="collection.coordinates.includes(props.coordinate.name)"
        @update:model-value="(value) => updateCollectionStatus(collection.name, value)"
      >
        <template #label>
          {{ collection.name }}
        </template>
      </UCheckbox>
    </div>

    <!-- コレクションを登録していない場合 -->
    <UAlert
      v-if="database.collections.length === 0"
      title="コレクションのしょうかい"
      variant="outline"
      color="info"
      icon="solar:lightbulb-outline"
      :ui="{
        root: 'bg-white mb-4',
        icon: 'size-8',
      }"
    >
      <template #description>
        <div class="mt-2">
          コレクションをつかうと、おきにいりのコーデをまとめてリストにすることができるよ
        </div>
      </template>
    </UAlert>

    <UButton
      label="とじる"
      color="neutral"
      variant="outline"
      block
      @click="emit('close')"
    />
  </div>
</template>
