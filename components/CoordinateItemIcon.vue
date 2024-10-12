<script setup lang="ts">
const props = defineProps<{
  /** コーデアイテムの種類 */
  type: CoordinateItemType
  /** 所持数 */
  number: number
  /** ラベルを表示するか？ */
  label?: boolean
}>()

const iconName = computed(() => {
  switch (props.type) {
    case 'tops':
      return 'icon-park-solid:t-shirt'
    case 'bottoms':
      return 'icon-park-solid:short-skirt'
    case 'onepiece':
      return 'icon-park-solid:full-dress-longuette'
    case 'shoes':
      return 'icon-park-solid:high-heeled-shoes'
    case 'accessory':
      return 'icon-park-solid:bow'
    default:
      return 'q'
  }
})

const labelText = computed(() => {
  switch (props.type) {
    case 'tops':
      return 'トップス'
    case 'bottoms':
      return 'ボトムス'
    case 'onepiece':
      return 'ワンピース'
    case 'shoes':
      return 'シューズ'
    case 'accessory':
      return 'アクセ'
    default:
      return ''
  }
})
</script>

<template>
  <div class="item-wrapper">
    <div
      class="item"
      :class="{
        [`--${props.type}`]: true,
        '--active': props.number > 0,
      }"
    >
      <UIcon :name="iconName" />
    </div>

    <span
      v-if="props.label"
      class="label"
    >
      {{ labelText }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.item-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item {
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  color: #ffffff;
  background: #f0f0f0;
  width: 1.5rem;
  height: 1.5rem;

  &.--onepiece {
    width: 3.5rem;
  }

  &.--active {
    background: linear-gradient(135deg, var(--vc-cyan), var(--vc-pink));
  }
}
</style>
