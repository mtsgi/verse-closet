<script setup lang="ts">
import { consola } from 'consola'

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

/** 削除確認モーダルの表示状態 */
const openDeleteModal = ref(false)
/** 編集フォームの表示状態 */
const openEditForm = ref<boolean>(false)
/** コレクション登録フォームの表示状態 */
const openCollectionForm = ref<boolean>(false)

/** 編集が完了したら閉じる処理 */
const onEdit = () => {
  emit('update-items')
  openEditForm.value = false
  emit('close-modal')
}

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
    consola.success('IDBRequest<IDBValidKey> success')
    emit('update-items')
  })
  request.addEventListener('error', () => {
    consola.error('IDBRequest<IDBValidKey> add error')
    toast.add({
      title: 'エラーが発生しました',
    })
    emit('close-modal')
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
      title: 'コーデをさくじょしました',
    })
    consola.success('IDBRequest<undefined> success')
    emit('update-items')
    emit('close-modal')
  })
  request.addEventListener('error', () => {
    toast.add({
      title: 'エラーがはっせいしました',
    })
    consola.error('IDBRequest<undefined> error')
    emit('error')
  })
}
</script>

<template>
  <UModal
    :open="props.modelValue"
    :title="props.coordinate.name"
    :close="true"
    class="modal coordinate-modal"
    @update:open="(value: boolean) => emit('update:modelValue', value)"
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
        <UBadge
          v-if="props.coordinate.brandName"
          class="font-bold rounded-full"
        >
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
        class="coordinate-image"
        :src="imageURL"
        :alt="props.coordinate.name"
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
        v-if="props.coordinate.memo"
        class="coordinate-memo"
        color="neutral"
        variant="soft"
        :description="props.coordinate.memo"
      />

      <div class="buttons">
        <UDrawer
          v-model:open="openCollectionForm"
          title="コレクションについか"
        >
          <UButton
            icon="icon-park-solid:healthy-recognition"
            size="lg"
            color="primary"
            variant="outline"
            block
          >
            コレクションについか
          </UButton>

          <template #body>
            <AddToCollectionForm
              :coordinate="props.coordinate"
              @update-items="emit('update-items')"
              @close="openCollectionForm = false"
            />
          </template>
        </UDrawer>
      </div>

      <div class="buttons">
        <UDrawer
          v-model:open="openEditForm"
          title="コーデへんしゅう"
        >
          <UButton
            icon="solar:pen-linear"
            size="lg"
            variant="soft"
            block
          >
            へんしゅう
          </UButton>

          <template #body>
            <CoordinateEditForm
              :coordinate="props.coordinate"
              @edit="onEdit"
              @close="openEditForm = false"
            />
          </template>
        </UDrawer>

        <UModal
          v-model:open="openDeleteModal"
          :title="`本当に「${props.coordinate.name}」をけしますか？`"
          description="この操作はとりけすことができません"
          :ui="{ footer: 'justify-end' }"
        >
          <UButton
            icon="solar:trash-bin-minimalistic-2-linear"
            size="lg"
            color="error"
            variant="soft"
            block
          >
            けす
          </UButton>

          <template #footer>
            <UButton
              label="やめる"
              color="neutral"
              variant="outline"
              block
              @click="openDeleteModal = false"
            />
            <UButton
              label="けす"
              color="error"
              block
              @click="deleteItem(props.coordinate.name)"
            />
          </template>
        </UModal>
      </div>

      <!-- <UCollapsible>
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
          <UCard class="coordinate-detail">
            <pre>{{ JSON.stringify(props.coordinate, null, 4) }}</pre>
          </UCard>
        </template>
      </UCollapsible> -->
    </template>
  </UModal>
</template>

<style lang="scss">
.coordinate-modal {
  .coordinate-rarity {
    display: inline-flex;
    min-width: 1.25rem;
    margin-right: 0.5rem;
    margin-bottom: 1px;
    vertical-align: bottom;

    img {
      flex-shrink: 0;
      height: 1.25rem;
      width: 1.25rem;

      &:not(:last-child) {
        margin-right: -0.5rem;
      }
    }
  }

  .coordinate-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .coordinate-image {
    border-radius: 0.75rem;
    margin: 0 auto 1.5rem auto;
    max-height: 50vh;
    box-shadow: 0 1rem 1rem -0.75rem var(--vc-cyan-light);
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

  .coordinate-detail {
    background: var(--ui-bg-elevated);

    pre {
      font: inherit;
      font-size: 0.8rem;
    }
  }
}
</style>
