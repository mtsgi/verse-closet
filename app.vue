<script setup lang="ts">
import { consola } from 'consola'

const runtimeConfig = useRuntimeConfig()
const database = useDatabase()

const tab = ref<'coordinates' | 'collections'>('coordinates')

// IndexedDB初期化
const request = window.indexedDB.open(runtimeConfig.public.dbName, runtimeConfig.public.dbVersion)
request.addEventListener('success', (event) => {
  const db = request.result
  database.value.db = db
  consola.success(`IDBOpenDBRequest success (version: ${db.version})`, event.target)
  updateItems()
})

// 新規作成時 objectStoreを作成する
request.addEventListener('upgradeneeded', (event) => {
  consola.success(`IDBOpenDBRequest upgradeneeded (version: ${event.oldVersion} -> ${event.newVersion})`, event.target)
  const db = request.result
  database.value.db = db

  // Indexed DBバージョンごとに差分を適用
  if (event.oldVersion < 1) {
    // バージョン1: 'coordinates' オブジェクトストアを作成
    if (!db.objectStoreNames.contains('coordinates')) {
      const coordinatesStore = db.createObjectStore('coordinates', { keyPath: 'name' })
      coordinatesStore.createIndex('name', 'name', { unique: true })
      consola.success('Coordinates store created', coordinatesStore)
    }
  }

  if (event.oldVersion < 2) {
    // バージョン2: 'collections' オブジェクトストアを作成
    if (!db.objectStoreNames.contains('collections')) {
      const collectionsStore = db.createObjectStore('collections', { keyPath: 'name' })
      collectionsStore.createIndex('name', 'name', { unique: true })
      consola.success('Collections store created', collectionsStore)
    }
  }
})

/** databaseのストアを更新する */
const updateItems = () => {
  const db = database.value.db
  if (!db) {
    return
  }
  // コーデの情報を更新
  const coordinateTransaction = db.transaction(['coordinates'], 'readonly')
  const coordinateObjectStore = coordinateTransaction.objectStore('coordinates')
  const request = coordinateObjectStore.getAll()
  request.addEventListener('success', (event) => {
    // @ts-expect-error event.target.result => IDBRequest.result
    database.value.coordinates = event.target?.result || []
  })

  const collectionTransaction = db.transaction(['collections'], 'readonly')
  const collectionObjectStore = collectionTransaction.objectStore('collections')
  const collectionRequest = collectionObjectStore.getAll()
  collectionRequest.addEventListener('success', (event) => {
    // @ts-expect-error event.target.result => IDBRequest.result
    database.value.collections = event.target?.result || []
  })
}
</script>

<template>
  <NuxtPwaManifest />

  <UApp>
    <AppHeader
      @update-items="updateItems"
    />

    <AppTabs v-model="tab" />

    <CoordinateList
      v-if="tab === 'coordinates'"
      @update-items="updateItems"
    />

    <CollectionList
      v-if="tab === 'collections'"
      @update-items="updateItems"
    />

    <LoadingSkeleton v-if="database.db === null" />
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
  background-color: transparent;
  background: linear-gradient(45deg, #ffcde6, #dbffff, #ffffd9);
  background-size: 100%;
  background-attachment: fixed;
}

body {
  font-family: unset;
  background-color: transparent;
  min-height: 100dvh;
  background: url('./bg_texture.png');
  background-size: 20rem 8rem;
  animation: bgtexture 30s infinite linear;
}

.modal {
  overflow: auto;
  max-height: 100%;
}

@keyframes bgtexture {
  from { background-position: 0 0; }
  to { background-position: 20rem 8rem; }
}
</style>
