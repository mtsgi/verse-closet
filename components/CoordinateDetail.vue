<script setup lang="ts">
const props = defineProps<{
  coordinate: VerseCoordinate
  dispType: 'default' | 'compact' | 'gallery'
}>()

const emit = defineEmits<{
  (e: 'update-items'): void
  (e: 'error'): void
}>()

const modalOpen = ref<boolean>(false)

const imageURL = computed(() => {
  if (props.coordinate.file) {
    return URL.createObjectURL(props.coordinate.file)
  }
  return null
})

/** フルコーデそろってるか？ */
const completed = computed(() => {
  return props.coordinate.itemType.every((item) => {
    return props.coordinate.items[item].number > 0
  })
})
</script>

<template>
  <div
    class="coordinate"
    :class="`--${props.dispType}`"
    @click="modalOpen = true"
  >
    <!-- 画像 -->
    <div class="image">
      <img
        v-if="imageURL"
        :src="imageURL"
        :alt="props.coordinate.name"
      >
      <div
        v-else
        class="no-image"
      >
        <UIcon
          name="icon-park-solid:full-dress-longuette"
          size="50"
        />
      </div>

      <!-- フルコーデ -->
      <div
        v-if="completed"
        class="completed"
      >
        <UIcon
          name="solar:verified-check-bold-duotone"
          :size="20"
        />
      </div>
    </div>

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
      <div class="brand">
        {{ props.coordinate.brandName }}
      </div>
    </div>

    <!-- 名前 -->
    <div class="name">
      {{ props.coordinate.name }}
    </div>

    <!-- フルコーデ -->
    <div
      v-if="props.dispType === 'compact'"
      class="comp"
    >
      <UIcon
        v-if="completed"
        class="completed"
        name="solar:verified-check-bold-duotone"
        :size="20"
      />
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
      <div class="pool">
        {{ props.coordinate.pool.join(", ") }}
      </div>
    </div>

    <CoordinateModal
      v-model="modalOpen"
      :coordinate="props.coordinate"
      @close-modal="modalOpen = false"
      @update-items="emit('update-items')"
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
      box-shadow: 0 1rem 1rem -0.75rem var(--vc-cyan-light);
    }

    .no-image {
      color: var(--vc-cyan-light);
    }

    .completed {
      position: absolute;
      top: 0.25rem;
      left: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      border: 2px solid var(--vc-pink-light);
      border-radius: 0.25rem;
      background: var(--color-white);

      > span {
        color: var(--vc-pink);
      }
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

        &:not(:last-child) {
          margin-right: -0.5rem;
        }
      }
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

  .comp {
    .completed {
      vertical-align: sub;
      color: var(--vc-pink);
    }
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

  &.--compact {
    grid-template-columns: auto 1fr auto auto;
    grid-template-rows: 1.5rem;

    .image,
    .rarity .brand,
    .items .pool {
      display: none;
    }
  }

  &.--gallery {
    position: relative;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;

    .image {
      justify-self: center;
      display: grid;
      place-items: center;
      max-height: 10rem;
      max-width: 10rem;
      min-height: 10rem;
      min-width: 10rem;
      box-shadow: none;
      border: none;
      width: auto;
      height: auto;

      img {
        width: auto;
        height: auto;
        max-height: 10rem;
        max-width: 10rem;
        min-height: 10rem;
        min-width: 10rem;
      }
    }

    .name {
      margin-top: 0.5rem;
    }

    .rarity,
    .items {
      display: none;
    }
  }
}
</style>
