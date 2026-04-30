<script setup lang="ts">
const database = useDatabase()
const { updateCoordinate, renameCoordinate } = useCoordinatesDB(database)

const props = defineProps<{
  coordinate: VerseCoordinate
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'close'): void
}>()

const toast = useToast()

const form = ref<VerseCoordinate>({ ...props.coordinate })

const editItem = async (item: VerseCoordinate) => {
  try {
    const nameChanged = props.coordinate.name !== item.name
    if (nameChanged) {
      await renameCoordinate(props.coordinate.name, item)
    }
    else {
      await updateCoordinate(item)
    }
    toast.add({ title: 'コーデをへんしゅうしました' })
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
    <CoordinateForm
      v-model="form"
      :disable-name="true"
      @update:model-value="editItem"
      @cancel="emit('close')"
    >
      <template #update>
        へんしゅう
      </template>
      <template #cancel>
        やめる
      </template>
    </CoordinateForm>
  </div>
</template>
