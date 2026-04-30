import { consola } from 'consola'

/**
 * IndexedDB の初期化・削除を提供する composable
 * DB 設定（dbName / dbVersion）は runtimeConfig.public から取得する
 */
export const useIndexedDB = () => {
  const runtimeConfig = useRuntimeConfig()
  const database = useDatabase()

  /**
   * IndexedDB を開き、必要に応じてオブジェクトストアを作成・マイグレーションし、
   * 全データを state に読み込む
   */
  const initDB = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(runtimeConfig.public.dbName, runtimeConfig.public.dbVersion)

      // 新規作成時・バージョンアップ時に objectStore を作成する
      request.addEventListener('upgradeneeded', (event) => {
        const db = request.result
        database.value.db = db
        consola.success(`IDBOpenDBRequest upgradeneeded (version: ${event.oldVersion} -> ${event.newVersion})`, event.target)

        // Indexed DB バージョンごとに差分を適用
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

      request.addEventListener('success', (event) => {
        const db = request.result
        database.value.db = db
        consola.success(`IDBOpenDBRequest success (version: ${db.version})`, event.target)

        // コーデの情報を更新
        const coordTx = db.transaction(['coordinates'], 'readonly')
        const coordStore = coordTx.objectStore('coordinates')
        const coordRequest = coordStore.getAll()
        coordRequest.addEventListener('success', () => {
          database.value.coordinates = coordRequest.result || []
        })

        // コレクションの情報を更新
        const collTx = db.transaction(['collections'], 'readonly')
        const collStore = collTx.objectStore('collections')
        const collRequest = collStore.getAll()
        collRequest.addEventListener('success', () => {
          database.value.collections = collRequest.result || []
          resolve()
        })
        collRequest.addEventListener('error', () => reject(collRequest.error))
      })

      request.addEventListener('error', () => reject(request.error))
    })
  }

  /** IndexedDB を削除し、state をリセットする */
  const dropDB = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase(runtimeConfig.public.dbName)
      request.addEventListener('success', () => {
        database.value.db = null
        database.value.coordinates = []
        database.value.collections = []
        resolve()
      })
      request.addEventListener('error', () => reject(request.error))
    })
  }

  return { initDB, dropDB }
}
