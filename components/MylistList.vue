<script setup lang="ts">
const database = useDatabase()
</script>

<template>
  <div
    v-if="database.db !== null"
    class="alerts"
  >
    <UAlert
      v-if="database.mylists.length === 0"
      title="マイリストのしょうかい"
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
          マイリストをつかうと、おきにいりのコーデをまとめてリストにすることができるよ
        </div>
      </template>
    </UAlert>
  </div>
</template>

<style lang="scss" scoped>
.alerts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
}
</style>
