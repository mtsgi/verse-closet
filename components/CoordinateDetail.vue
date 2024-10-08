<script setup lang="ts">
const props = defineProps<{
  coordinate: VerseCoordinate
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'error'): void
}>()

const modalOpen = ref<boolean>(false)

const onDelete = () => {
  emit('delete')
  modalOpen.value = false
}

const imageURL = computed(() => {
  if (props.coordinate.file) {
    return URL.createObjectURL(props.coordinate.file)
  }
  return null
})
</script>

<template>
  <div
    class="coordinate"
    @click="modalOpen = true"
  >
    <!-- 画像 -->
    <div
      v-if="imageURL"
      rel="noopener noreferrer"
      class="image"
    >
      <img
        :src="imageURL"
        :alt="props.coordinate.name"
      >
    </div>
    <div
      v-else
      class="image"
    />

    <!-- レアリティとブランド名 -->
    <div class="rarity">
      <div class="stars">
        <img
          v-for="i in props.coordinate.rarity"
          :key="`item-detail-rarity-star-${i}`"
          src="/star_icon.png"
          alt="★"
        >
      </div>
      {{ props.coordinate.brandName }}
    </div>

    <!-- 名前 -->
    <div class="name">
      {{ props.coordinate.name }}
    </div>

    <!-- 各アイテムの所持状況 -->
    <div class="items">
      <div class="icons">
        <CoordinateItemIcon
          v-for="type in props.coordinate.itemType"
          :key="`item-detail-item-type-${type}`"
          :type="type"
          :number="props.coordinate.items[type].number"
        />
      </div>
      {{ props.coordinate.pool }}
    </div>

    <CoordinateModal
      v-model="modalOpen"
      :coordinate="coordinate"
      @delete="onDelete"
      @error="emit('error')"
    />
  </div>
</template>

<style lang="scss" scoped>
.coordinate {
  display: grid;
  gap: 0 0.5rem;
  align-items: center;
  grid-template-columns: 6rem 1fr;
  grid-template-rows: 2rem 2rem 2rem;
  font-size: 0.8rem;

  .image {
    grid-column: 1 / 2;
    grid-row: 1 / -1;
    width: 6rem;
    height: 6rem;
    background: #f0f0f0;
    object-fit: cover;
    border-radius: 0.5rem;

    img {
      width: 6rem;
      height: 6rem;
      object-fit: cover;
      border-radius: 0.5rem;
    }
  }

  .rarity {
    display: flex;
    align-items: center;

    .stars {
      flex-grow: 1;
      display: flex;
      align-items: center;

      > img {
        height: 1.5rem;
        width: 1.5rem;
        margin-right: -0.5rem;
      }
    }
  }

  .name {
    font-weight: bold;
    font-size: 1rem;
  }

  .items {
    display: flex;
    align-items: center;

    .icons {
      flex-grow: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
}
</style>
