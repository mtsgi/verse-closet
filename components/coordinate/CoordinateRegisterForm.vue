<script setup lang="ts">
const database = useDatabase()
const { addCoordinate } = useCoordinatesDB(database)

const emit = defineEmits<{
  (e: 'close'): void
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

const onSubmit = async (item: VerseCoordinate) => {
  try {
    await addCoordinate(item)
    toast.add({ title: 'コーデをとうろくしました' })
  }
  catch {
    toast.add({ title: 'コーデをとうろくできませんでした' })
  }
  emit('close')
}
</script>

<template>
  <div class="register">
    <CoordinateForm
      v-model="form"
      @update:model-value="onSubmit"
      @cancel="emit('close')"
    >
      <template #update>
        とうろく
      </template>
      <template #cancel>
        やめる
      </template>
    </CoordinateForm>
  </div>
</template>
