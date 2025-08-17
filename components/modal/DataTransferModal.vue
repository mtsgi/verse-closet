<script setup lang="ts">
import { consola } from 'consola'

const database = useDatabase()

const model = defineModel<boolean>()
const toast = useToast()
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const importConfirm = ref<SerializedDatabase | null>(null)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
    reader.readAsDataURL(file)
  })
}

const toFile = (base64: string, fileName: string): File => {
  const byteString = atob(base64.split(',')[1]!)
  const mimeString = base64.split(',')[0]!.split(':')[1]!.split(';')[0]
  const buffer = new ArrayBuffer(byteString.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < byteString.length; i++) {
    view[i] = byteString.charCodeAt(i)
  }
  return new File([buffer], fileName, { type: mimeString })
}

const exportData = async () => {
  const result = {
    dbVersion: database.value.db?.version,
    savedAt: new Date().toISOString(),
    coordinates: [...database.value.coordinates],
    collections: [...database.value.collections],
    coordinatesFiles: {} as Record<string, string>,
    collectionsFiles: {} as Record<string, string>,
  } satisfies SerializedDatabase
  // コーデの画像をbase64エンコード
  for (const coordinate of result.coordinates) {
    if (coordinate.file) {
      result.coordinatesFiles[coordinate.name] = await toBase64(coordinate.file)
    }
  }
  // コレクションの画像をbase64エンコード
  for (const collection of result.collections) {
    if (collection.file) {
      result.collectionsFiles[collection.name] = await toBase64(collection.file)
    }
  }
  // JSONファイルとしてダウンロード
  const json = JSON.stringify(result)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `VerseCloset_${new Date().toLocaleDateString('ja-JP')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const selectFile = () => {
  inputRef.value?.click()
}

const setImportConfirm = async () => {
  const file = inputRef.value?.files?.item(0)
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onload = async (event) => {
    try {
      const json = event.target?.result as string
      const data: SerializedDatabase = JSON.parse(json)
      // データベースのバージョンチェック
      if (data.dbVersion !== database.value.db?.version) {
        toast.add({ title: 'バージョンがちがいます', color: 'error' })
        return
      }
      importConfirm.value = data
    } catch (error) {
      toast.add({ title: 'データのよみこみにしっぱいしました', description: String(error), color: 'error' })
      consola.error('Error reading JSON file:', error)
    }
  }
  reader.readAsText(file)
}

const importData = () => {
  const data = toRaw(importConfirm.value)
  if (!data) {
    return
  }
  try {
    const coordinates = data.coordinates
    const collections = data.collections
    // コーデの画像ファイル復元
    for (const coordinate of coordinates) {
      const base64 = data.coordinatesFiles[coordinate.name]
      if (base64) {
        coordinate.file = toFile(base64, coordinate.name)
      }
    }
    // コレクションの画像ファイル復元
    for (const collection of collections) {
      const base64 = data.collectionsFiles[collection.name]
      if (base64) {
        collection.file = toFile(base64, collection.name)
      }
    }
    // IndexedDB読み込み確認
    if (!database.value.db) {
      toast.add({ title: 'データベースにアクセスできませんでした', color: 'error' })
      return
    }
    // コーデをIndexedDBに書き込み
    const transaction = database.value.db.transaction(['coordinates'], 'readwrite')
    const objectStore = transaction.objectStore('coordinates')
    for (const coordinate of coordinates) {
      // すでに存在しないか確認
      const alreadyExists = database.value.coordinates.some(c => c.name === coordinate.name)
      if (alreadyExists) {
        toast.add({ title: `コーデ「${coordinate.name}」はすでにあるのでスキップしました`, color: 'warning', icon: 'icon-park-solid:info' })
        continue
      }
      // ObjectStoreとComposableに書き込み
      const request = objectStore.put(coordinate)
      request.addEventListener('success', () => {
        database.value.coordinates.push(coordinate) // Composableに追加
        toast.add({ title: `コーデ「${coordinate.name}」をよみこみました`, color: 'success', icon: 'icon-park-solid:check-one' })
        consola.success(`IDBRequest<IDBValidKey> put success: ${coordinate.name}`)
      })
      request.addEventListener('error', () => {
        consola.error(`IDBRequest<IDBValidKey> put error: ${coordinate.name}`)
        toast.add({ title: 'コーデのよみこみにしっぱいしました', color: 'error' })
      })
    }
    // コレクションをIndexedDBに書き込み
    const transaction2 = database.value.db.transaction(['collections'], 'readwrite')
    const objectStore2 = transaction2.objectStore('collections')
    // コレクションをIndexedDBに書き込み
    for (const collection of collections) {
      // すでに存在しないか確認
      const alreadyExists = database.value.collections.some(c => c.name === collection.name)
      if (alreadyExists) {
        toast.add({ title: `コレクション「${collection.name}」はすでにあるのでスキップしました`, color: 'warning', icon: 'icon-park-solid:info' })
        continue
      }
      // ObjectStoreとComposableに書き込み
      const request = objectStore2.put(collection)
      request.addEventListener('success', () => {
        database.value.collections.push(collection) // Composableに追加
        toast.add({ title: `コレクション「${collection.name}」をよみこみました`, color: 'success', icon: 'icon-park-solid:check-one' })
        consola.success(`IDBRequest<IDBValidKey> put success: ${collection.name}`)
      })
      request.addEventListener('error', () => {
        consola.error(`IDBRequest<IDBValidKey> put error: ${collection.name}`)
        toast.add({ title: 'コレクションのよみこみにしっぱいしました', color: 'error' })
      })
    }
  } catch (error) {
    toast.add({ title: 'データのよみこみにしっぱいしました', description: String(error), color: 'error' })
  } finally {
    importConfirm.value = null
    emit('update:modelValue', false)
  }
}

/** JSON保存用にシリアライズしたデータ型 */
interface SerializedDatabase {
  dbVersion?: number
  /** 保存日時 */
  savedAt: string
  coordinates: VerseCoordinate[]
  collections: VerseCollection[]
  /** JSON保存用にbase64エンコードした画像 */
  coordinatesFiles: Record<string, string>
  /** JSON保存用にbase64エンコードした画像 */
  collectionsFiles: Record<string, string>
}
</script>

<template>
  <UModal
    v-model:open="model"
    title="データひきつぎ"
    class="modal"
    :ui="{ footer: 'justify-end' }"
  >
    <UButton
      block
      icon="mdi:arrow-right"
      variant="solid"
    >
      データひきつぎ
    </UButton>

    <template #body>
      <div class="transfer">
        <UButton
          icon="icon-park-solid:folder-download"
          block
          @click="exportData"
        >
          データをかきだす
        </UButton>

        <UButton
          icon="icon-park-solid:upload"
          block
          @click="selectFile"
        >
          データをよみこむ
        </UButton>

        <input
          ref="inputRef"
          type="file"
          accept="application/json"
          class="input"
          hidden
          @change="setImportConfirm"
        >

        <UAlert
          variant="outline"
          icon="icon-park-solid:help"
        >
          <template #description>
            「データをかきだす」でかきだしたデータを、ほかのたんまつで「データをよみこむ」でよみこむとひきつぎできるよ
          </template>
        </UAlert>
      </div>
    </template>

    <template #footer>
      <UButton
        label="とじる"
        color="neutral"
        variant="outline"
        block
        @click="emit('update:modelValue', false)"
      />
    </template>
  </UModal>

  <!-- ひきつぎ確認モーダル -->
  <UModal
    title="かくにん"
    :open="importConfirm !== null"
    @update:open="importConfirm = null"
  >
    <template #body>
      <div v-if="importConfirm">
        <label>ほんとうにこのデータをよみこみますか？</label>

        <UCard
          variant="subtle"
          class="mt-4"
        >
          <p>ほぞんしたひ: {{ new Date(importConfirm.savedAt).toLocaleString('ja-JP') }}</p>
          <p>コーデのかず: {{ importConfirm.coordinates.length }}</p>
          <p>コレクションのかず: {{ importConfirm.collections.length }}</p>
        </UCard>

        <UAlert
          class="mt-4"
          variant="outline"
          icon="icon-park-solid:info"
        >
          <template #description>
            おなじなまえのコーデやコレクションがあるものは、スキップされます
          </template>
        </UAlert>
      </div>
    </template>

    <template #footer>
      <UButton
        label="やめる"
        color="neutral"
        variant="outline"
        block
        @click="importConfirm = null"
      />
      <UButton
        label="データをよみこむ"
        color="primary"
        variant="solid"
        block
        @click="importData"
      />
    </template>
  </UModal>
</template>

<style lang="scss" scoped>
.transfer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
