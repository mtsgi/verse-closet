<script setup lang="ts">
const database = useDatabase()
const { updateCollection, renameCollection } = useCollectionsDB(database)

const props = defineProps<{
  collection: VerseCollection
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'close'): void
}>()

const toast = useToast()

const form = ref<VerseCollection>({ ...props.collection })

const editItem = async (item: VerseCollection) => {
  try {
    const nameChanged = props.collection.name !== item.name
    if (nameChanged) {
      await renameCollection(props.collection.name, item)
    }
    else {
      await updateCollection(item)
    }
    toast.add({ title: 'コレクションをへんしゅうしました' })
    emit('edit')
  }
  catch {
    toast.add({ title: 'エラーがはっせいしました' })
    emit('close')
  }
}
</script>

<template>
  <div class="register">
    <CollectionForm
      v-model="form"
      @update:model-value="editItem"
      @cancel="emit('close')"
    >
      <template #update>
        へんしゅう
      </template>
      <template #cancel>
        やめる
      </template>
    </CollectionForm>
  </div>
</template>
