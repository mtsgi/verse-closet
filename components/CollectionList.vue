<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update-items'): void
}>()

const database = useDatabase()

/** 追加フォームの表示状態 */
const openForm = ref<boolean>(false)

const onClose = () => {
  emit('update-items')
  openForm.value = false
}
</script>

<template>
  <div class="collection-list">
    <CollectionDetail
      v-for="collection in database.collections"
      :key="collection.name"
      :collection="collection"
      @update-items="emit('update-items')"
    />
  </div>

  <div class="buttons">
    <UDrawer
      v-model:open="openForm"
      title="コレクションをつくる"
    >
      <VerseButton>
        コレクションをつくる
      </VerseButton>

      <template #body>
        <CollectionRegisterForm
          @close="onClose"
        />
      </template>
    </UDrawer>
  </div>

  <div
    v-if="database.db !== null"
    class="alerts"
  >
    <UAlert
      v-if="database.collections.length === 0"
      title="コレクションのしょうかい"
      variant="outline"
      color="info"
      icon="solar:lightbulb-outline"
      :ui="{
        root: 'bg-white shadow-md',
        icon: 'size-8',
      }"
    >
      <template #description>
        <div class="mt-2">
          コレクションをつかうと、おきにいりのコーデをまとめてリストにすることができるよ
        </div>
      </template>
    </UAlert>
  </div>
</template>

<style lang="scss" scoped>
.collection-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.alerts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
}
</style>
