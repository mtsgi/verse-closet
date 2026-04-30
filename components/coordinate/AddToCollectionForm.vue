<script setup lang="ts">
const database = useDatabase()
const toast = useToast()
const { updateCollectionCoordinates } = useCollectionsDB(database)

const props = defineProps<{
  coordinate: VerseCoordinate
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update-items'): void
}>()

/** コレクションに該当コーデを追加／削除する */
const updateCollectionStatus = async (collectionName: string, value: boolean) => {
  try {
    await updateCollectionCoordinates(collectionName, props.coordinate.name, value)
    emit('update-items')
  }
  catch {
    toast.add({ title: 'こうしんできませんでした' })
  }
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
        @update:model-value="(value) => updateCollectionStatus(collection.name, Boolean(value))"
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
