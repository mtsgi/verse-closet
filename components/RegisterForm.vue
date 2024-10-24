<script setup lang="ts">
const database = useDatabase()
const runtimeConfig = useRuntimeConfig()

const emit = defineEmits<{
  (e: 'register'): void
  (e: 'error'): void
}>()

const toast = useToast()

const defaultItemState: CoordinateItemState<'tops'> = {
  type: 'tops',
  number: 0,
  bp: 0,
  id: '',
  name: '',
}
const defaultCoordinate: VerseCoordinate = {
  name: '',
  rarity: 1,
  brandName: '',
  pool: [],
  itemType: ['tops', 'bottoms', 'shoes', 'accessory'],
  items: {
    tops: { ...defaultItemState, type: 'tops' },
    bottoms: { ...defaultItemState, type: 'bottoms' },
    onepiece: { ...defaultItemState, type: 'onepiece' },
    shoes: { ...defaultItemState, type: 'shoes' },
    accessory: { ...defaultItemState, type: 'accessory' },
  },
  tags: [],
  memo: '',
}

const form = ref<VerseCoordinate>({ ...defaultCoordinate })
const formSeparate = ref<'true' | 'false'>('true')
const formFile = useTemplateRef<HTMLInputElement>('formFile')

/** コーデのセパレートタイプによって存在するアイテム種別を返す */
const coordinateItemTypes = computed<CoordinateItemType[]>(() => {
  if (formSeparate.value === 'true') {
    return ['tops', 'bottoms', 'shoes', 'accessory']
  }
  else {
    return ['onepiece', 'shoes', 'accessory']
  }
})

/** セパレートタイプ切り替え時に存在しないアイテムの所持数を0にする */
watch(coordinateItemTypes, (value) => {
  console.log('新しいitemtypes', value)
  const itemTypes = Object.keys(form.value.items) as CoordinateItemType[]
  itemTypes.forEach((itemType) => {
    if (!value.includes(itemType)) {
      form.value.items[itemType].number = 0
    }
  })
})

const addItem = () => {
  if (!database.value.db) {
    return
  }
  console.log('file', formFile.value?.files?.item(0))
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
    file: formFile.value?.files?.item(0) || undefined,
  }

  const transaction = database.value.db.transaction(['coordinates'], 'readwrite')
  const objectStore = transaction.objectStore('coordinates')
  const request = objectStore.add(item)
  request.addEventListener('success', () => {
    console.log('IDBRequest<IDBValidKey> success')
    toast.add({
      title: 'コーデを追加しました',
    })
    emit('register')
  })
  request.addEventListener('error', () => {
    console.log('IDBRequest<IDBValidKey> error')
    emit('error')
  })
}
</script>

<template>
  <div class="register">
    <label>コーデのなまえ</label>
    <UInput
      v-model="form.name"
      type="text"
      size="xl"
    />

    <label>ブランド</label>
    <USelect
      v-model="form.brandName"
      size="xl"
      :items="runtimeConfig.public.brandNameList"
    />

    <label>バージョン</label>
    <UInputMenu
      v-model="form.pool"
      size="xl"
      :items="runtimeConfig.public.cardPoolList"
      multiple
    />

    <label>レアリティ</label>
    <UButtonGroup>
      <UButton
        v-for="num in [1, 2, 3, 4]"
        :key="`register-rarity-${num}`"
        size="xl"
        :variant="form.rarity === num ? 'solid' : 'outline'"
        @click="form.rarity = num"
      >
        <UIcon
          v-for="i in num"
          :key="`register-rarity-${num}-star-${i}`"
          name="solar:star-bold"
        />
      </UButton>
    </UButtonGroup>

    <label>画像</label>
    <input
      ref="formFile"
      type="file"
      accept="image/*"
      class="form-file"
    >

    <label>タイプ</label>
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

    <label>所持状況</label>
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

    <label>メモ</label>
    <UTextarea
      v-model="form.memo"
      :rows="2"
      autoresize
    />

    <div class="buttons">
      <VerseButton
        size="xl"
        class="font-bold rounded-full"
        @click="addItem"
      >
        追加する
      </VerseButton>
      <VerseButton
        size="xl"
        class="font-bold rounded-full"
        variant="outline"
        @click="emit('register')"
      >
        とじる
      </VerseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  // max-height: 90vh;
  // overflow: auto;

  .form-file {
    border-color: var(--color-gray-300);
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
  }
}
</style>
