<script setup lang="ts">
type AppTabType = 'coordinates' | 'collections'

// タブの種類を定義
defineModel<AppTabType>()

const emit = defineEmits<{
  (e: 'update:model-value', value: AppTabType): void
}>()

const updateValue = (value: string | number) => {
  emit('update:model-value', value as AppTabType)
}
</script>

<template>
  <div class="tabs">
    <UTabs
      :model-value="modelValue"
      :items="[
        { value: 'coordinates', label: 'コーデいちらん', icon: 'icon-park-solid:full-dress-longuette' },
        { value: 'collections', label: 'コレクション', icon: 'icon-park-solid:healthy-recognition' },
      ]"
      :ui="{
        list: 'shadow-md bg-white',
      }"
      @update:model-value="updateValue"
    />
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  padding: 0 1rem;
  margin-bottom: 1rem;
}
</style>
