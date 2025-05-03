<script setup lang="ts">
import { consola } from 'consola'

const props = defineProps<{
  modelValue: boolean
  collection: VerseCollection
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

/** 編集が完了したら閉じる処理 */
const onEdit = () => {
  emit('update-items')
  openEditForm.value = false
  emit('close-modal')
}

const collectionCoordinates = computed<VerseCoordinate[]>(() => {
  const result: VerseCoordinate[] = []
  props.collection.coordinates.forEach((coordinateName) => {
    const coordinate = database.value.coordinates.find(
      coordinate => coordinate.name === coordinateName,
    )
    if (coordinate) {
      result.push(coordinate)
    }
  })
  return result
})

const deleteItem = (key: string) => {
  const db = database.value.db
  if (!db) {
    return
  }
  const transaction = db.transaction(['collections'], 'readwrite')
  const objectStore = transaction.objectStore('collections')
  const request = objectStore.delete(key)
  request.addEventListener('success', () => {
    toast.add({
      title: 'コレクションをさくじょしました',
    })
    consola.success('IDBRequest<IDBValidKey> success')
    emit('update-items')
    emit('close-modal')
  })
  request.addEventListener('error', () => {
    toast.add({
      title: 'エラーがはっせいしました',
    })
    consola.error('IDBRequest<IDBValidKey> error')
    emit('error')
  })
}
</script>

<template>
  <UModal
    :open="props.modelValue"
    :title="props.collection.name"
    :close="true"
    class="modal collection-modal"
    @update:open="(value: boolean) => emit('update:modelValue', value)"
  >
    <template #title>
      {{ props.collection.name }}
    </template>

    <template #body>
      <!-- メモ -->
      <UAlert
        v-if="props.collection.memo"
        class="coordinate-memo mb-4"
        color="neutral"
        variant="soft"
        :description="props.collection.memo"
      />

      <CoordinateDetail
        v-for="coordinate in collectionCoordinates"
        :key="coordinate.name"
        :coordinate="coordinate"
        :disp-type="'default'"
        class="mb-4"
        @update-items="emit('update-items')"
        @error="emit('error')"
      />

      <!-- コレクションにコーデを登録していない場合 -->
      <UAlert
        v-if="props.collection.coordinates.length === 0"
        title="コレクションにコーデをついかしよう"
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
            「コーデ」のがめんからコレクションについかすることができるよ
          </div>
        </template>
      </UAlert>

      <div class="buttons">
        <UDrawer
          v-model:open="openEditForm"
          title="コレクションへんしゅう"
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
            <CollectionEditForm
              :collection="props.collection"
              @edit="onEdit"
              @close="openEditForm = false"
            />
          </template>
        </UDrawer>

        <UModal
          v-model:open="openDeleteModal"
          :title="`本当に「${props.collection.name}」をけしますか？`"
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
              @click="deleteItem(props.collection.name)"
            />
          </template>
        </UModal>
      </div>
    </template>
  </UModal>
</template>

<style lang="scss" scoped>
.collection-modal {
  .buttons {
    display: flex;
    gap: 1rem;
  }

  .collection-detail {
    font-size: 0.8rem;
    background: var(--ui-bg-elevated);

    pre {
      font: inherit;
      font-size: 0.8rem;
    }
  }
}
</style>
