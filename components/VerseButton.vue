<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <UButton
    size="xl"
    class="verse-button"
    @click="event => emit('click', event)"
  >
    <slot name="default" />
  </UButton>
</template>

<style lang="scss">
.verse-button {
  justify-content: center;
  font-weight: bold;
}
</style>
