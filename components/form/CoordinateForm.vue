<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

const props = defineProps<{
  modelValue: VerseCoordinate
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VerseCoordinate): void
  (e: 'cancel'): void
}>()

/** 編集中のコーデ情報 */
const form = ref<VerseCoordinate>(props.modelValue)
// TODO: OTHERを追加する & 初期値をpropsから決定する
const formSeparate = ref<'true' | 'false'>('true')
const formFile = ref<File | undefined>(props.modelValue.file)

/** 存在するアイテム種別 */
const coordinateItemTypes = ref<CoordinateItemType[]>(
  [...props.modelValue.itemType],
)

/** セパレートタイプ切り替え時に存在しないアイテムの所持数を0にする */
watch(formSeparate, (separateType) => {
  if (separateType === 'true') {
    coordinateItemTypes.value = ['tops', 'bottoms', 'shoes', 'accessory']
  }
  else {
    coordinateItemTypes.value = ['onepiece', 'shoes', 'accessory']
  }
  console.log('新しいitemTypes', coordinateItemTypes.value)
  const itemTypes = Object.keys(form.value.items) as CoordinateItemType[]
  itemTypes.forEach((itemType) => {
    if (!coordinateItemTypes.value.includes(itemType)) {
      form.value.items[itemType].number = 0
    }
  })
})

/** コーデ情報を確定する */
const update = () => {
  const item: VerseCoordinate = {
    ...form.value,
    tags: [...form.value.tags],
    pool: [...form.value.pool],
    itemType: [...coordinateItemTypes.value],
    items: {
      tops: { ...form.value.items.tops },
      bottoms: { ...form.value.items.bottoms },
      onepiece: { ...form.value.items.onepiece },
      shoes: { ...form.value.items.shoes },
      accessory: { ...form.value.items.accessory },
    },
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
      label="コーデのなまえ"
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
      label="ブランド"
    >
      <USelect
        v-model="form.brandName"
        size="xl"
        class="w-full"
        :items="runtimeConfig.public.brandNameList"
      />
    </UFormField>

    <UFormField
      class="form-field"
      label="バージョン"
    >
      <USelectMenu
        v-model="form.pool"
        size="xl"
        class="w-full"
        :items="runtimeConfig.public.cardPoolList"
        multiple
      >
        <template #default>
          <UBadge
            v-for="pool in form.pool"
            :key="`register-pool-${pool}`"
            :label="pool"
            variant="outline"
          />
        </template>
      </USelectMenu>
    </UFormField>

    <UFormField
      class="form-field"
      label="レアリティ"
    >
      <UButtonGroup>
        <UButton
          v-for="num in [1, 2, 3, 4]"
          :key="`register-rarity-${num}`"
          size="xl"
          :variant="form.rarity === num ? 'solid' : 'outline'"
          class="form-field-rarity"
          @click="form.rarity = num"
        >
          <img
            v-for="i in num"
            :key="`register-rarity-${num}-star-${i}`"
            src="/star_icon.png"
            alt="★"
          >
        </UButton>
      </UButtonGroup>
    </UFormField>

    <UFormField
      class="form-field"
      label="画像"
    >
      <ImageSelector v-model="formFile" />
    </UFormField>

    <UFormField
      class="form-field"
      label="タイプ"
    >
      <URadioGroup
        v-model="formSeparate"
        orientation="horizontal"
        size="xl"
        :items="[
          {
            label: 'セパレート',
            value: 'true',
          },
          {
            label: 'ワンピース',
            value: 'false',
          },
        ]"
      />
    </UFormField>

    <!-- 各コーデの所持状況登録 -->
    <div
      v-for="itemType in coordinateItemTypes"
      :key="`register-itemType-${itemType}`"
    >
      <UCheckbox
        size="xl"
        :label="itemType"
        :model-value="form.items[itemType].number > 0"
        @update:model-value="(value) => form.items[itemType].number = value ? 1 : 0"
      >
        <template #label>
          <CoordinateItemIcon
            :type="itemType"
            :number="form.items[itemType].number"
            label
          />
        </template>
      </UCheckbox>
    </div>

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
  // max-height: 90vh;
  // overflow: auto;

  :deep(.form-field-rarity) {
    display: flex;

    img {
      flex-shrink: 0;
      height: 1.25rem;
      width: 1.25rem;

      &:not(:last-child) {
        margin-right: -0.75rem;
      }
    }
  }

  .form-file {
    border-color: var(--color-gray-300);
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1rem 0;
  }
}
</style>
