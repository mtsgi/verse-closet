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
    <label>バージョン情報</label>

    <div>
      バージョン {{ runtimeConfig.public.appVersion }}
    </div>

    <UButton
      to="https://github.com/mtsgi/verse-closet"
      target="_blank"
      icon="mdi:github"
      variant="outline"
      block
    >
      GitHubで見る
    </UButton>

    <label>さくじょ</label>

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
          block
          @click="openModal = false"
        />
        <UButton
          label="削除する"
          color="error"
          block
          @click="deleteDB"
        />
      </template>
    </UModal>
  </div>
</template>

<style lang="scss" scoped>
.setting {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
