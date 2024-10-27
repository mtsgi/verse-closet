<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'update-items'): void
}>()

/** 設定画面の表示状態 */
const openSetting = ref<boolean>(false)
/** 追加フォームの表示状態 */
const openForm = ref<boolean>(false)

const onRegister = () => {
  emit('update-items')
  openForm.value = false
}
</script>

<template>
  <header>
    <UDrawer v-model:open="openSetting">
      <UButton
        icon="solar:settings-minimalistic-linear"
        size="xl"
        color="neutral"
        variant="ghost"
      />

      <template #body>
        <AppSetting />
      </template>
    </UDrawer>

    <div class="divider" />

    <img
      class="icon"
      src="/icon.png"
      alt="Verse Closet"
    >

    <div class="divider" />

    <UDrawer
      v-model:open="openForm"
      title="コーデとうろく"
    >
      <UButton
        icon="solar:add-square-linear"
        size="xl"
        color="neutral"
        variant="ghost"
      />

      <template #body>
        <RegisterForm
          @register="onRegister"
        />
      </template>
    </UDrawer>
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: linear-gradient(90deg, var(--vc-pink-light), var(--vc-cyan-light));
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.25);

  .divider {
    flex-grow: 1;
  }

  .icon {
    border-radius: 1rem;
    border: 0.25rem solid rgba(255, 255, 255, 0.75);
    filter: drop-shadow(0 0.25rem 0.25rem rgba(0, 0, 0, 0.25));
    width: 5rem;
    height: 5rem;
    margin-top: 0;
    margin-bottom: -1.5rem;
  }
}
</style>
