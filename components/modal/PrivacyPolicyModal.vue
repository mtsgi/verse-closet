<script setup lang="ts">
const model = defineModel<boolean>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <UModal
    v-model:open="model"
    title="プライバシーポリシー"
    class="modal"
    :ui="{ footer: 'justify-end' }"
  >
    <UButton
      block
      variant="outline"
    >
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
        @click="emit('update:modelValue', false)"
      />
    </template>
  </UModal>
</template>
