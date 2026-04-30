import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { IDBFactory } from 'fake-indexeddb'
import { useCollectionsDB } from '../../composables/useCollectionsDB'
import type { VerseCollection, DatabaseState } from '../../composables/useDatabase'

/** テスト用DBをセットアップする */
function openTestDB(): Promise<IDBDatabase> {
  const factory = new IDBFactory()
  return new Promise((resolve, reject) => {
    const request = factory.open('test-db', 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('coordinates')) {
        db.createObjectStore('coordinates', { keyPath: 'name' })
      }
      if (!db.objectStoreNames.contains('collections')) {
        db.createObjectStore('collections', { keyPath: 'name' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/** テスト用のコレクションオブジェクトを生成するヘルパー */
function makeCollection(override: Partial<VerseCollection> = {}): VerseCollection {
  return {
    name: 'テストコレクション',
    coordinates: [],
    memo: '',
    createdAt: new Date('2024-01-01'),
    ...override,
  }
}

describe('useCollectionsDB', () => {
  let state: Ref<DatabaseState>

  beforeEach(async () => {
    const db = await openTestDB()
    state = ref<DatabaseState>({
      db,
      coordinates: [],
      collections: [],
    })
  })

  it('コレクションを追加するとstateに反映される', async () => {
    const { addCollection } = useCollectionsDB(state)
    const collection = makeCollection({ name: 'おきにいり' })

    await addCollection(collection)

    expect(state.value.collections).toHaveLength(1)
    expect(state.value.collections[0]!.name).toBe('おきにいり')
  })

  it('コレクション追加時にcreatedAtが現在時刻に設定される', async () => {
    const { addCollection } = useCollectionsDB(state)
    const before = new Date()
    await addCollection(makeCollection({ name: 'テスト', createdAt: new Date('2000-01-01') }))
    const after = new Date()

    const saved = state.value.collections[0]!
    expect(saved.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(saved.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('コレクションを更新するとstateに反映される', async () => {
    const { addCollection, updateCollection } = useCollectionsDB(state)
    const collection = makeCollection({ name: 'コレクションA', memo: '' })
    await addCollection(collection)

    await updateCollection({ ...state.value.collections[0]!, memo: '更新済みメモ' })

    expect(state.value.collections[0]!.memo).toBe('更新済みメモ')
  })

  it('コレクションを削除するとstateから取り除かれる', async () => {
    const { addCollection, deleteCollection } = useCollectionsDB(state)
    await addCollection(makeCollection({ name: 'コレクションA' }))
    await addCollection(makeCollection({ name: 'コレクションB' }))

    await deleteCollection('コレクションA')

    expect(state.value.collections).toHaveLength(1)
    expect(state.value.collections[0]!.name).toBe('コレクションB')
  })

  it('コレクション名を変更するとstateに新しい名前で反映される', async () => {
    const { addCollection, renameCollection } = useCollectionsDB(state)
    const collection = makeCollection({ name: '旧コレクション名' })
    await addCollection(collection)

    await renameCollection('旧コレクション名', { ...state.value.collections[0]!, name: '新コレクション名' })

    expect(state.value.collections).toHaveLength(1)
    expect(state.value.collections[0]!.name).toBe('新コレクション名')
  })

  it('コレクションにコーデを追加できる', async () => {
    const { addCollection, updateCollectionCoordinates } = useCollectionsDB(state)
    await addCollection(makeCollection({ name: 'マイコレクション', coordinates: [] }))

    await updateCollectionCoordinates('マイコレクション', 'コーデA', true)

    expect(state.value.collections[0]!.coordinates).toContain('コーデA')
  })

  it('コレクションからコーデを削除できる', async () => {
    const { addCollection, updateCollectionCoordinates } = useCollectionsDB(state)
    await addCollection(makeCollection({ name: 'マイコレクション', coordinates: ['コーデA', 'コーデB'] }))

    await updateCollectionCoordinates('マイコレクション', 'コーデA', false)

    expect(state.value.collections[0]!.coordinates).not.toContain('コーデA')
    expect(state.value.collections[0]!.coordinates).toContain('コーデB')
  })

  it('存在しないコレクションのコーデを更新しようとするとエラーになる', async () => {
    const { updateCollectionCoordinates } = useCollectionsDB(state)

    await expect(
      updateCollectionCoordinates('存在しないコレクション', 'コーデA', true),
    ).rejects.toThrow('Collection not found: 存在しないコレクション')
  })

  it('dbがnullの場合はエラーになる', async () => {
    state.value.db = null
    const { addCollection } = useCollectionsDB(state)

    await expect(addCollection(makeCollection())).rejects.toThrow('DB not initialized')
  })
})
