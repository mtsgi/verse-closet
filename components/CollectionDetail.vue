<script setup lang="ts">
const props = defineProps<{
  collection: VerseCollection
}>()

const emit = defineEmits<{
  (e: 'update-items'): void
  (e: 'error'): void
}>()

const modalOpen = ref<boolean>(false)

const imageURL = computed(() => {
  if (props.collection.file) {
    return URL.createObjectURL(props.collection.file)
  }
  return null
})
</script>

<template>
  <div
    class="collection"
    @click="modalOpen = true"
  >
    <!-- 画像 -->
    <div class="image">
      <img
        v-if="imageURL"
        :src="imageURL"
        :alt="props.collection.name"
      >
      <div
        v-else
        class="no-image"
      >
        <UIcon
          name="icon-park-solid:healthy-recognition"
          size="50"
        />
      </div>
    </div>

    <!-- 名前 -->
    <div class="name">
      {{ props.collection.name }}
    </div>

    <!-- コーデの数 -->
    <div class="count">
      {{ props.collection.coordinates.length }} コーデ
    </div>
  </div>

  <CollectionModal
    v-model="modalOpen"
    :collection="props.collection"
    @close-modal="modalOpen = false"
    @update-items="emit('update-items')"
    @error="emit('error')"
  />
</template>

<style lang="scss" scoped>
.collection {
  display: grid;
  gap: 0 0.5rem;
  grid-template-columns: 6rem 1fr;
  grid-template-rows: 2rem 1fr;

  .image {
    display: grid;
    place-items: center;
    grid-column: 1 / 2;
    grid-row: 1 / -1;
    width: 6rem;
    height: 6rem;
    background: rgba($color: #ffffff, $alpha: 0.5);
    box-shadow: inset 0 0 0 3px rgba($color: #ffffff, $alpha: 0.5);
    object-fit: cover;
    border-radius: 0.5rem;
    position: relative;

    img {
      width: 6rem;
      height: 6rem;
      object-fit: cover;
      border-radius: 0.5rem;
      box-shadow: 0 1rem 1rem -0.75rem var(--vc-pink-light);
    }

    .no-image {
      color: var(--vc-pink-light);
    }
  }

  .name {
    font-weight: 600;
    font-size: 1rem;
    white-space: nowrap;
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .count {
    font-size: 0.8rem;
  }
}
</style>
