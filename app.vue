<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const database = useDatabase()

// IndexedDB初期化
const request = window.indexedDB.open('VerseCloset', runtimeConfig.public.dbVersion)
request.addEventListener('success', (event) => {
  console.log('IDBOpenDBRequest success', event.target)
  const db = request.result
  database.value.db = db
  updateItems()
})

// 新規作成時 objectStoreを作成する
request.addEventListener('upgradeneeded', (event) => {
  console.log('IDBOpenDBRequest upgradeneeded', event.target)
  const db = request.result
  database.value.db = db
  const objectStore = db.createObjectStore('items', { keyPath: 'name' })
  objectStore.createIndex('name', 'name', { unique: true })
  // objectStoreの作成が完了した時
  objectStore.transaction.addEventListener('complete', () => {
    console.log('IDBTransaction complete')
  })
})

/** allItemsを更新する */
const updateItems = () => {
  const db = database.value.db
  if (!db) {
    return
  }
  const transaction = db.transaction(['items'], 'readonly')
  const objectStore = transaction.objectStore('items')
  const request = objectStore.getAll()
  request.addEventListener('success', (event) => {
    // @ts-expect-error event.target.result => IDBRequest.result
    database.value.allItems = event.target?.result || []
  })
}
</script>

<template>
  <UApp>
    <AppHeader />

    <USeparator icon="i-ph-diamond" />

    <div v-if="database.db === null">
      Loading...
    </div>

    <RegisterForm
      v-if="database.db"
      :db="database.db"
      @register="updateItems"
    />

    <USeparator icon="i-ph-diamond" />

    <ItemList
      @delete="updateItems"
    />
  </UApp>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";
</style>
