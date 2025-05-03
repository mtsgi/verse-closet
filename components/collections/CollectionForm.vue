<script setup lang="ts">
const props = defineProps<{
  modelValue: VerseCollection
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VerseCollection): void
  (e: 'cancel'): void
}>()

/** 編集中のコレクション情報 */
const form = ref<VerseCollection>(props.modelValue)
const formFile = ref<File | undefined>(props.modelValue.file)

/** コレクション情報を確定する */
const update = () => {
  const item: VerseCollection = {
    ...form.value,
    coordinates: [...form.value.coordinates],
    file: formFile.value || undefined,
  }
  emit('update:modelValue', item)
}
</script>

<template>
  <UForm
    class="register"
    :state="form"
  >
    <UFormField
      class="form-field"
      label="コレクションのなまえ"
    >
      <UInput
        v-model="form.name"
        type="text"
        size="xl"
        class="w-full"
        :required="true"
      />
    </UFormField>

    <UFormField
      class="form-field"
      label="画像"
    >
      <ImageSelector v-model="formFile" />
    </UFormField>

    <UFormField
      class="form-field"
      label="メモ"
    >
      <UTextarea
        v-model="form.memo"
        :rows="2"
        autoresize
        class="w-full"
      />
    </UFormField>

    <div class="buttons">
      <VerseButton
        @click="update"
      >
        <slot name="update">
          update
        </slot>
      </VerseButton>
      <VerseButton
        color="blue"
        @click="emit('cancel')"
      >
        <slot name="cancel">
          cancel
        </slot>
      </VerseButton>
    </div>
  </UForm>
</template>

<style lang="scss" scoped>
.register {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem 0;

  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1rem 0;
  }
}
</style>
