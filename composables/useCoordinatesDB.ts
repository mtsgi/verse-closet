import type { Ref } from 'vue'
import type { VerseCoordinate, CoordinateItemType, DatabaseState } from './useDatabase'

/** coordinates ストアの全件を取得して state を更新する（内部ヘルパー） */
const refreshCoordinatesFromDB = (state: Ref<DatabaseState>): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = state.value.db
    if (!db) {
      reject(new Error('DB not initialized'))
      return
    }
    const tx = db.transaction(['coordinates'], 'readonly')
    const store = tx.objectStore('coordinates')
    const request = store.getAll()
    request.addEventListener('success', () => {
      state.value.coordinates = request.result || []
      resolve()
    })
    request.addEventListener('error', () => reject(request.error))
  })
}

/**
 * コーデの IndexedDB CRUD 操作を提供する composable
 * @param state useDatabase() の返り値
 */
export const useCoordinatesDB = (state: Ref<DatabaseState>) => {
  /** coordinates ストアの全件を取得して state を更新する */
  const refreshCoordinates = (): Promise<void> => refreshCoordinatesFromDB(state)

  /** コーデを追加する */
  const addCoordinate = (coordinate: VerseCoordinate): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = state.value.db
      if (!db) {
        reject(new Error('DB not initialized'))
        return
      }
      const tx = db.transaction(['coordinates'], 'readwrite')
      const store = tx.objectStore('coordinates')
      const request = store.add(coordinate)
      request.addEventListener('success', async () => {
        await refreshCoordinates()
        resolve()
      })
      request.addEventListener('error', () => reject(request.error))
    })
  }

  /** コーデを更新する */
  const updateCoordinate = (coordinate: VerseCoordinate): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = state.value.db
      if (!db) {
        reject(new Error('DB not initialized'))
        return
      }
      const tx = db.transaction(['coordinates'], 'readwrite')
      const store = tx.objectStore('coordinates')
      const request = store.put(coordinate)
      request.addEventListener('success', async () => {
        await refreshCoordinates()
        resolve()
      })
      request.addEventListener('error', () => reject(request.error))
    })
  }

  /** コーデを削除する */
  const deleteCoordinate = (name: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = state.value.db
      if (!db) {
        reject(new Error('DB not initialized'))
        return
      }
      const tx = db.transaction(['coordinates'], 'readwrite')
      const store = tx.objectStore('coordinates')
      const request = store.delete(name)
      request.addEventListener('success', async () => {
        await refreshCoordinates()
        resolve()
      })
      request.addEventListener('error', () => reject(request.error))
    })
  }

  /**
   * コーデの名前を変更する
   * コーデのなまえが変更されている場合は add してから元レコードを delete する
   */
  const renameCoordinate = (originalName: string, coordinate: VerseCoordinate): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = state.value.db
      if (!db) {
        reject(new Error('DB not initialized'))
        return
      }
      const tx = db.transaction(['coordinates'], 'readwrite')
      const store = tx.objectStore('coordinates')
      const addRequest = store.add(coordinate)
      addRequest.addEventListener('success', () => {
        const deleteRequest = store.delete(originalName)
        deleteRequest.addEventListener('success', async () => {
          await refreshCoordinates()
          resolve()
        })
        deleteRequest.addEventListener('error', () => reject(deleteRequest.error))
      })
      addRequest.addEventListener('error', () => reject(addRequest.error))
    })
  }

  /**
   * 指定コーデのアイテム所持数を更新する
   * @param coordinateName 対象コーデ名
   * @param itemType 更新するアイテムの種類
   * @param value true で所持数 1、false で所持数 0 にする
   */
  const updateCoordinateItem = (
    coordinateName: string,
    itemType: CoordinateItemType,
    value: boolean,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const db = state.value.db
      if (!db) {
        reject(new Error('DB not initialized'))
        return
      }
      const original = state.value.coordinates.find(c => c.name === coordinateName)
      if (!original) {
        reject(new Error(`Coordinate not found: ${coordinateName}`))
        return
      }
      // 複製する
      const item: VerseCoordinate = {
        ...original,
        tags: [...original.tags],
        pool: [...original.pool],
        itemType: [...original.itemType],
        items: {
          tops: { ...original.items.tops },
          bottoms: { ...original.items.bottoms },
          onepiece: { ...original.items.onepiece },
          shoes: { ...original.items.shoes },
          accessory: { ...original.items.accessory },
        },
      }
      // 対象のアイテムの個数を更新する
      item.items[itemType].number = value ? 1 : 0
      const tx = db.transaction(['coordinates'], 'readwrite')
      const store = tx.objectStore('coordinates')
      const request = store.put(item)
      request.addEventListener('success', async () => {
        await refreshCoordinates()
        resolve()
      })
      request.addEventListener('error', () => reject(request.error))
    })
  }

  return {
    refreshCoordinates,
    addCoordinate,
    updateCoordinate,
    deleteCoordinate,
    renameCoordinate,
    updateCoordinateItem,
  }
}
