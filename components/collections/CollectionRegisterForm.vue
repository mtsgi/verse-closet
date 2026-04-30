<script setup lang="ts">
const database = useDatabase()
const { addCollection } = useCollectionsDB(database)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const toast = useToast()

const defaultCollection: VerseCollection = {
  name: 'おきにいり',
  coordinates: [],
  memo: '',
  createdAt: new Date(),
}

const form = ref<VerseCollection>({ ...defaultCollection })

const onSubmit = async (item: VerseCollection) => {
  try {
    await addCollection(item)
    toast.add({ title: 'コレクションをとうろくしました' })
  }
  catch {
    toast.add({ title: 'コレクションをとうろくできませんでした' })
  }
  emit('close')
}
</script>

<template>
  <div class="register">
    <CollectionForm
      v-model="form"
      @update:model-value="onSubmit"
      @cancel="emit('close')"
    >
      <template #update>
        つくる
      </template>
      <template #cancel>
        やめる
      </template>
    </CollectionForm>
  </div>
</template>
