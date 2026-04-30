<script setup lang="ts">
const database = useDatabase()
const { initDB } = useIndexedDB()
const { refreshCoordinates } = useCoordinatesDB(database)
const { refreshCollections } = useCollectionsDB(database)

const tab = ref<'coordinates' | 'collections'>('coordinates')

onMounted(async () => {
  await initDB()
})

/** 全ストアを再取得する */
const refreshAll = async () => {
  await Promise.all([refreshCoordinates(), refreshCollections()])
}
</script>

<template>
  <NuxtPwaManifest />

  <UApp>
    <AppHeader
      @update-items="refreshAll"
    />

    <AppTabs v-model="tab" />

    <CoordinateList
      v-if="tab === 'coordinates'"
      @update-items="refreshAll"
    />

    <CollectionList
      v-if="tab === 'collections'"
      @update-items="refreshAll"
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
  background: url('/bg_texture.png');
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
