<script setup lang="ts">
const database = useDatabase()
const runtimeConfig = useRuntimeConfig()
const toast = useToast()

const openModal = ref(false)

const deleteDB = () => {
  const request = window.indexedDB.deleteDatabase(runtimeConfig.public.dbName)
  openModal.value = false
  request.addEventListener('success', () => {
    toast.add({ title: 'データベースを削除しました' })
    database.value.db = null
    database.value.allCoordinates = []
  })
}
</script>

<template>
  <div class="setting">
    <UModal
      v-model:open="openModal"
      title="本当に削除しますか？"
      description="すべてのデータが削除されます"
      :ui="{ footer: 'justify-end' }"
    >
      <UButton
        icon="solar:trash-bin-minimalistic-2-linear"
        color="error"
        block
      >
        データベースの削除
      </UButton>

      <template #footer>
        <UButton
          label="やめる"
          color="neutral"
          variant="outline"
          @click="openModal = false"
        />
        <UButton
          label="削除する"
          color="error"
          @click="deleteDB"
        />
      </template>
    </UModal>
  </div>
</template>
