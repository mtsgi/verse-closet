<script setup lang="ts">
const props = defineProps<{
  color?: 'pink' | 'blue'
  shape?: 'default' | 'dia'
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <UButton
    size="xl"
    class="verse-button"
    :class="[`--${props.color}`, `--${props.shape}`]"
    @click="event => emit('click', event)"
  >
    <slot
      v-if="$slots['default']"
      name="default"
    />
  </UButton>
</template>

<style lang="scss">
.verse-button {
  --verse-button-color: #ff5fba;

  &.--dia {
    transform-origin: center center;
    transform: rotate(45deg);
    padding: calc(var(--spacing) * 1.5);
    border-radius: 2px;

    > span {
      color: #ffffff;
      text-shadow: none;
      transform-origin: center center;
      transform: rotate(-45deg);
    }
  }

  &.--blue {
    --verse-button-color: #67d5f0;
  }

  border-radius: calc(infinity * 1px);
  justify-content: center;
  background-color: var(--verse-button-color);
  background-image: url('/verse-closet/bg_texture.png');
  background-size: 20rem 8rem;
  box-shadow:
    inset 0 -1rem 2rem 0 rgba($color: #ffffff, $alpha: 0.75),
    0 0 0 2px #ffffff,
    0 0 0 4px var(--verse-button-color);
  font-weight: 900;
  color: var(--verse-button-color);
  text-shadow:
    0 0 1px #ffffff,
    0 0 1px #ffffff,
    0 0 1px #ffffff,
    0 0 1px #ffffff,
    0 0 1px #ffffff,
    0 0 1px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 2px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff,
    0 0 3px #ffffff;
}
</style>
