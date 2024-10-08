<script setup lang="ts">
useSeoMeta({
  title: 'Verse Closet',
  ogTitle: 'Verse Closet',
  description: 'コーデアイテムかんりツール「Verse Closet」',
  ogDescription: 'コーデアイテムかんりツール「Verse Closet」',
  ogImage: 'icon.png',
  twitterCard: 'summary',
})

const runtimeConfig = useRuntimeConfig()
const database = useDatabase()

// IndexedDB初期化
const request = window.indexedDB.open(runtimeConfig.public.dbName, runtimeConfig.public.dbVersion)
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
  const objectStore = db.createObjectStore('coordinates', { keyPath: 'name' })
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
  const transaction = db.transaction(['coordinates'], 'readonly')
  const objectStore = transaction.objectStore('coordinates')
  const request = objectStore.getAll()
  request.addEventListener('success', (event) => {
    // @ts-expect-error event.target.result => IDBRequest.result
    database.value.allCoordinates = event.target?.result || []
  })
}
</script>

<template>
  <UApp>
    <AppHeader
      @register="updateItems"
    />

    <div v-if="database.db === null">
      Loading...
    </div>

    <CoordinateList
      @delete="updateItems"
    />
  </UApp>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";

:root {
  font-family: "Zen Maru Gothic", serif;
  --vc-pink: #ff9df2;
  --vc-pink-light: #ffcef8;
  --vc-cyan: #67d9ff;
  --vc-cyan-light: #b3ecff;

  color: #444;
  background: url('bg_texture.png'), linear-gradient(45deg, #ffcde6, #dbffff, #ffffd9);
  background-size: 100%;
  background-attachment: fixed;
}
</style>
