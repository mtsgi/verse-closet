<script setup lang="ts">
const database = useDatabase()
const runtimeConfig = useRuntimeConfig()

const deleteDB = () => {
  const request = window.indexedDB.deleteDatabase(runtimeConfig.public.dbName)
  request.addEventListener('success', () => {
    alert('データベースを削除しました')
    database.value.db = null
    database.value.allCoordinates = []
  })
}
</script>

<template>
  <div class="setting">
    データベースの削除
    <UButton
      color="error"
      block
      @click="deleteDB"
    >
      削除
    </UButton>
  </div>
</template>
