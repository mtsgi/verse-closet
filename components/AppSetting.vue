<script setup lang="ts">
import licenseNuxt from '../node_modules/nuxt/LICENSE?raw'
import licenseVue from '../node_modules/vue/LICENSE?raw'
import licenseNuxtUI from '../node_modules/@nuxt/ui/LICENSE.md?raw'
// import licenseNuxtESLint from '../node_modules/@nuxt/eslint/LICENSE?raw'
import licenseVitePWANuxt from '../node_modules/@vite-pwa/nuxt/LICENSE?raw'
// import licenseSass from '../node_modules/sass/LICENSE?raw'

const database = useDatabase()
const runtimeConfig = useRuntimeConfig()
const toast = useToast()

const openRightsModal = ref(false)
const openPrivacyPolicy = ref(false)
const showDeleteButton = ref(false)
const openDeleteModal = ref(false)

const rights = [
  { name: 'Nuxt', text: licenseNuxt },
  { name: 'Vue', text: licenseVue },
  { name: 'Nuxt UI', text: licenseNuxtUI },
  // { name: 'Nuxt ESLint', text: licenseNuxtESLint },
  { name: '@vite-pwa/nuxt', text: licenseVitePWANuxt },
  // { name: 'Dart Sass', text: licenseSass },
] as const

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

    <UModal
      v-model:open="openRightsModal"
      title="権利表記"
      class="modal"
      :ui="{ footer: 'justify-end' }"
    >
      <UButton block>
        権利表記
      </UButton>

      <template #body>
        <div
          v-for="right in rights"
          :key="`right-${right.name}`"
        >
          <h3 class="text-l font-semibold mb-2">
            {{ right.name }}
          </h3>
          <div>
            <p
              v-for="(line, i) in right.text.split('\n')"
              :key="`right-${right.name}-line${i}`"
            >
              {{ line }}
            </p>
          </div>
          <USeparator class="my-4" />
        </div>
        権利表記ここまで
      </template>

      <template #footer>
        <UButton
          label="とじる"
          color="neutral"
          variant="outline"
          block
          @click="openRightsModal = false"
        />
      </template>
    </UModal>

    <UModal
      v-model:open="openPrivacyPolicy"
      title="プライバシーポリシー"
      class="modal"
      :ui="{ footer: 'justify-end' }"
    >
      <UButton block>
        プライバシーポリシー
      </UButton>

      <template #body>
        このアプリでは、Google Analyticsを使用しています。このツールにより収集されたデータは、Googleのプライバシーポリシーに基づいて管理されます。詳細についてはGoogleのプライバシーポリシー(https://policies.google.com/privacy)をご覧ください。
      </template>

      <template #footer>
        <UButton
          label="とじる"
          color="neutral"
          variant="outline"
          block
          @click="openPrivacyPolicy = false"
        />
      </template>
    </UModal>

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
}
</style>
