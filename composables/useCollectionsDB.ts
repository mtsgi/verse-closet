import type { Ref } from 'vue'
import type { VerseCollection, DatabaseState } from './useDatabase'

/** collections ストアの全件を取得して state を更新する（内部ヘルパー） */
const refreshCollectionsFromDB = (state: Ref<DatabaseState>): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = state.value.db
    if (!db) {
      reject(new Error('DB not initialized'))
      return
    }
    const tx = db.transaction(['collections'], 'readonly')
    const store = tx.objectStore('collections')
    const request = store.getAll()
    request.addEventListener('success', () => {
      state.value.collections = request.result || []
      resolve()
    })
    request.addEventListener('error', () => reject(request.error))
  })
}

/**
 * コレクションの IndexedDB CRUD 操作を提供する composable
 * @param state useDatabase() の返り値
 */
export const useCollectionsDB = (state: Ref<DatabaseState>) => {
  /** collections ストアの全件を取得して state を更新する */
  const refreshCollections = (): Promise<void> => refreshCollectionsFromDB(state)

  /**
   * コレクションを追加する
   * 登録日時（createdAt）は現在日時で上書きされる
   */
  const addCollection = (collection: VerseCollection): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = state.value.db
      if (!db) {
        reject(new Error('DB not initialized'))
        return
      }
      // 登録日時を現在日時にする
      const item = { ...collection, createdAt: new Date() }
      const tx = db.transaction(['collections'], 'readwrite')
      const store = tx.objectStore('collections')
      const request = store.add(item)
      request.addEventListener('success', async () => {
        await refreshCollections()
        resolve()
      })
      request.addEventListener('error', () => reject(request.error))
    })
  }

  /** コレクションを更新する */
  const updateCollection = (collection: VerseCollection): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = state.value.db
      if (!db) {
        reject(new Error('DB not initialized'))
        return
      }
      // reactive proxy を含まない plain object にしてから IDB に書き込む
      const plain: VerseCollection = { ...collection, coordinates: [...collection.coordinates] }
      const tx = db.transaction(['collections'], 'readwrite')
      const store = tx.objectStore('collections')
      const request = store.put(plain)
      request.addEventListener('success', async () => {
        await refreshCollections()
        resolve()
      })
      request.addEventListener('error', () => reject(request.error))
    })
  }

  /** コレクションを削除する */
  const deleteCollection = (name: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = state.value.db
      if (!db) {
        reject(new Error('DB not initialized'))
        return
      }
      const tx = db.transaction(['collections'], 'readwrite')
      const store = tx.objectStore('collections')
      const request = store.delete(name)
      request.addEventListener('success', async () => {
        await refreshCollections()
        resolve()
      })
      request.addEventListener('error', () => reject(request.error))
    })
  }

  /**
   * コレクションの名前を変更する
   * コレクションのなまえが変更されている場合は add してから元レコードを delete する
   */
  const renameCollection = (originalName: string, collection: VerseCollection): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = state.value.db
      if (!db) {
        reject(new Error('DB not initialized'))
        return
      }
      const plain: VerseCollection = { ...collection, coordinates: [...collection.coordinates] }
      const tx = db.transaction(['collections'], 'readwrite')
      const store = tx.objectStore('collections')
      const addRequest = store.add(plain)
      addRequest.addEventListener('success', () => {
        const deleteRequest = store.delete(originalName)
        deleteRequest.addEventListener('success', async () => {
          await refreshCollections()
          resolve()
        })
        deleteRequest.addEventListener('error', () => reject(deleteRequest.error))
      })
      addRequest.addEventListener('error', () => reject(addRequest.error))
    })
  }

  /**
   * コレクションにコーデを追加または削除する
   * @param collectionName 対象コレクション名
   * @param coordinateName 追加・削除するコーデ名
   * @param add true で追加、false で削除
   */
  const updateCollectionCoordinates = (
    collectionName: string,
    coordinateName: string,
    add: boolean,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = state.value.db
      if (!db) {
        reject(new Error('DB not initialized'))
        return
      }
      const collection = state.value.collections.find(c => c.name === collectionName)
      if (!collection) {
        reject(new Error(`Collection not found: ${collectionName}`))
        return
      }
      const updated: VerseCollection = {
        ...collection,
        // チェックした時は配列に追加、外した時は配列から削除
        coordinates: add
          ? [...collection.coordinates, coordinateName]
          : collection.coordinates.filter(name => name !== coordinateName),
      }
      const tx = db.transaction(['collections'], 'readwrite')
      const store = tx.objectStore('collections')
      const request = store.put(updated)
      request.addEventListener('success', async () => {
        await refreshCollections()
        resolve()
      })
      request.addEventListener('error', () => reject(request.error))
    })
  }

  return {
    refreshCollections,
    addCollection,
    updateCollection,
    deleteCollection,
    renameCollection,
    updateCollectionCoordinates,
  }
}
