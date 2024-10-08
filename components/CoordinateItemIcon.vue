<script setup lang="ts">
const props = defineProps<{
  /** コーデアイテムの種類 */
  type: CoordinateItemType
  /** 所持数 */
  number: number
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
</script>

<template>
  <div
    class="item"
    :class="{
      [`--${props.type}`]: true,
      '--active': props.number > 0,
    }"
  >
    <UIcon :name="iconName" />
  </div>
</template>

<style lang="scss" scoped>
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
