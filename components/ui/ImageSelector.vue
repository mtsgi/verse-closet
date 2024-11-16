<script setup lang="ts">
const model = defineModel<File>()
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const imageURL = ref<string>(model.value ? URL.createObjectURL(model.value) : '')

const selectImage = () => {
  inputRef.value?.click()
}

const clearImage = () => {
  model.value = undefined
  imageURL.value = ''
}

const onChange = () => {
  const file = inputRef.value?.files?.item(0) || undefined
  model.value = file
  if (file) {
    imageURL.value = URL.createObjectURL(file)
  }
}
</script>

<template>
  <div class="image-selector">
    <img
      v-if="imageURL"
      :src="imageURL"
      :alt="model?.name"
      class="image"
      @click="selectImage"
    >
    <div
      v-else
      class="image --noimage"
      @click="selectImage"
    >
      未選択
    </div>

    <UButton
      :variant="model ? 'outline' : 'solid'"
      class="filename"
      @click="selectImage"
    >
      {{ model?.name || 'ファイルをえらんでね' }}
    </UButton>

    <UButton
      icon="solar:close-circle-linear"
      variant="ghost"
      color="neutral"
      @click="clearImage"
    />

    <input
      ref="inputRef"
      type="file"
      accept="image/*"
      class="input"
      @change="onChange"
    >
  </div>
</template>

<style lang="scss" scoped>
.image-selector {
  display: grid;
  grid-template-columns: 6rem 1fr auto;
  align-items: center;
  gap: 0.5em;

  .image {
    width: 6rem;
    height: 6rem;
    object-fit: cover;
    border-radius: 0.5rem;

    &.--noimage {
      display: grid;
      place-items: center;
      background-color: #f0f0f0;
    }
  }

  :deep(.filename) {
    white-space: nowrap;
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .input {
    display: none;
  }
}
</style>
