<script setup lang="ts">
const database = useDatabase()
const runtimeConfig = useRuntimeConfig()
const toast = useToast()

const openDataTransferModal = ref(false)
const openRightsModal = ref(false)
const openPrivacyPolicy = ref(false)
const showDeleteButton = ref(false)
const openDeleteModal = ref(false)

const deleteDB = () => {
  const request = window.indexedDB.deleteDatabase(runtimeConfig.public.dbName)
  openDeleteModal.value = false
  request.addEventListener('success', () => {
    toast.add({ title: 'データベースを削除しました' })
    database.value.db = null
    database.value.coordinates = []
    database.value.collections = []
  })
}
</script>

<template>
  <div class="setting">
    <label>データひきつぎ</label>

    <DataTransferModal
      v-model="openDataTransferModal"
    />

    <label>バージョン情報</label>

    <div>
      Verse Closet バージョン {{ runtimeConfig.public.appVersion }}
    </div>

    <UButton
      to="https://github.com/mtsgi/verse-closet"
      target="_blank"
      icon="mdi:github"
      variant="soft"
      block
    >
      GitHubで見る
    </UButton>

    <RightsModal
      v-model="openRightsModal"
    />

    <PrivacyPolicyModal
      v-model="openPrivacyPolicy"
    />

    <!-- <label>さくじょ</label> -->

    <UModal
      v-if="showDeleteButton"
      v-model:open="openDeleteModal"
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
          @click="openDeleteModal = false"
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
  text-align: center;

  label {
    font-weight: bold;
  }
}
</style>
