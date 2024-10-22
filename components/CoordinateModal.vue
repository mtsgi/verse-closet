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
    :title="props.coordinate.name"
    :close="true"
    class="coordinate-modal"
    @update:open="value => emit('update:modelValue', value)"
  >
    <template #title>
      <div class="coordinate-rarity">
        <img
          v-for="i in props.coordinate.rarity"
          :key="`item-detail-rarity-star-${i}`"
          src="/star_icon.png"
          alt="★"
        >
      </div>
      {{ props.coordinate.name }}
    </template>
    <template #body>
      <div class="coordinate-badges">
        <UBadge class="font-bold rounded-full">
          {{ props.coordinate.brandName }}
        </UBadge>
        <UBadge
          v-for="pool in props.coordinate.pool"
          :key="`item-detail-pool-${pool}`"
          class="font-bold rounded-full"
          variant="outline"
        >
          {{ pool }}
        </UBadge>
      </div>

      <!-- 画像 -->
      <img
        v-if="imageURL"
        :src="imageURL"
        :alt="props.coordinate.name"
        class="coordinate-image"
      >

      <!-- 各コーデの所持状況更新 -->
      <div
        v-for="itemType in props.coordinate.itemType"
        :key="`coordinateModal-itemType-${itemType}`"
        class="coordinate-item"
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

      <!-- メモ -->
      <UAlert
        class="coordinate-memo"
        color="neutral"
        variant="soft"
        :description="props.coordinate.memo"
      />

      <div class="buttons">
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
      </div>

      <UCollapsible>
        <UButton
          label="詳細データを見る"
          color="neutral"
          variant="ghost"
          trailing-icon="i-heroicons-chevron-down-20-solid"
          :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          }"
          block
        />

        <template #content>
          <UCard>
            {{ props.coordinate }}
          </UCard>
        </template>
      </UCollapsible>
    </template>
  </UModal>
</template>

<style lang="scss">
.coordinate-modal {
  overflow: auto;
  max-height: 100%;

  .coordinate-rarity {
    display: inline-flex;
    margin-right: 1rem;
    margin-bottom: 1px;
    vertical-align: bottom;

    img {
      flex-shrink: 0;
      height: 1.25rem;
      width: 1.25rem;
      margin-right: -0.5rem;
    }
  }

  .coordinate-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .coordinate-image {
    border-radius: 0.5rem;
    margin: 0 auto 1rem auto;
    max-height: 50vh;
  }

  .coordinate-item {
    margin-bottom: 1rem;
  }

  .coordinate-memo {
    margin-bottom: 1rem;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
