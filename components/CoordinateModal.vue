<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  coordinate: VerseCoordinate
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close-modal'): void
  (e: 'update-items'): void
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

/** アイテムの所持数を更新する */
const updateItemNumber = (itemType: CoordinateItemType, value: boolean) => {
  const db = database.value.db
  if (!db) {
    return
  }
  const transaction = db.transaction(['coordinates'], 'readwrite')
  const objectStore = transaction.objectStore('coordinates')
  // 複製する
  const item: VerseCoordinate = {
    ...props.coordinate,
    tags: [...props.coordinate.tags],
    pool: [...props.coordinate.pool],
    itemType: [...props.coordinate.itemType],
    items: {
      tops: { ...props.coordinate.items.tops },
      bottoms: { ...props.coordinate.items.bottoms },
      onepiece: { ...props.coordinate.items.onepiece },
      shoes: { ...props.coordinate.items.shoes },
      accessory: { ...props.coordinate.items.accessory },
    },
  }
  // 対象のアイテムの個数を更新する
  item.items[itemType].number = value ? 1 : 0
  const request = objectStore.put(item)
  request.addEventListener('success', () => {
    emit('update-items')
  })
}

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
    emit('update-items')
    emit('close-modal')
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
    class="coordinate-modal"
    @update:open="value => emit('update:modelValue', value)"
  >
    <template #body>
      <img
        v-if="imageURL"
        :src="imageURL"
        :alt="props.coordinate.name"
      >

      <!-- 各コーデの所持状況更新 -->
      <div
        v-for="itemType in props.coordinate.itemType"
        :key="`coordinateModal-itemType-${itemType}`"
      >
        <UCheckbox
          size="xl"
          :label="itemType"
          :model-value="props.coordinate.items[itemType].number > 0"
          @update:model-value="(value) => updateItemNumber(itemType, value)"
        >
          <template #label>
            <CoordinateItemIcon
              :type="itemType"
              :number="props.coordinate.items[itemType].number"
              label
            />
          </template>
        </UCheckbox>
      </div>

      <UButton
        icon="i-heroicons-pencil"
        size="lg"
        variant="soft"
        block
        disabled
      >
        編集する
      </UButton>

      <UButton
        icon="i-heroicons-trash"
        size="lg"
        color="error"
        variant="soft"
        block
        @click="deleteItem(props.coordinate.name)"
      >
        削除する
      </UButton>

      <UCard>
        {{ props.coordinate }}
      </UCard>
    </template>
  </UModal>
</template>

<style lang="scss">
.coordinate-modal {
  overflow: auto;
  max-height: 100%;
}
</style>
