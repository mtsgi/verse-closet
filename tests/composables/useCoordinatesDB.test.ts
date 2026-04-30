import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { IDBFactory } from 'fake-indexeddb'
import { useCoordinatesDB } from '../../composables/useCoordinatesDB'
import type { VerseCoordinate, DatabaseState } from '../../composables/useDatabase'

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

/** テスト用のコーデオブジェクトを生成するヘルパー */
function makeCoordinate(override: Partial<VerseCoordinate> = {}): VerseCoordinate {
  return {
    name: 'テストコーデ',
    rarity: 1,
    brandName: 'ブランドA',
    pool: [],
    itemType: ['tops', 'bottoms'],
    items: {
      accessory: { type: 'accessory', number: 0, bp: 0, id: '', name: '' },
      onepiece: { type: 'onepiece', number: 0, bp: 0, id: '', name: '' },
      tops: { type: 'tops', number: 0, bp: 0, id: '', name: '' },
      bottoms: { type: 'bottoms', number: 0, bp: 0, id: '', name: '' },
      shoes: { type: 'shoes', number: 0, bp: 0, id: '', name: '' },
    },
    tags: [],
    memo: '',
    ...override,
  }
}

describe('useCoordinatesDB', () => {
  let state: Ref<DatabaseState>

  beforeEach(async () => {
    const db = await openTestDB()
    state = ref<DatabaseState>({
      db,
      coordinates: [],
      collections: [],
    })
  })

  it('コーデを追加するとstateに反映される', async () => {
    const { addCoordinate } = useCoordinatesDB(state)
    const coord = makeCoordinate({ name: 'サマーコーデ' })

    await addCoordinate(coord)

    expect(state.value.coordinates).toHaveLength(1)
    expect(state.value.coordinates[0]!.name).toBe('サマーコーデ')
  })

  it('コーデを更新するとstateに反映される', async () => {
    const { addCoordinate, updateCoordinate } = useCoordinatesDB(state)
    const coord = makeCoordinate({ name: 'コーデA', rarity: 1 })
    await addCoordinate(coord)

    await updateCoordinate({ ...coord, rarity: 3 })

    expect(state.value.coordinates[0]!.rarity).toBe(3)
  })

  it('コーデを削除するとstateから取り除かれる', async () => {
    const { addCoordinate, deleteCoordinate } = useCoordinatesDB(state)
    await addCoordinate(makeCoordinate({ name: 'コーデA' }))
    await addCoordinate(makeCoordinate({ name: 'コーデB' }))

    await deleteCoordinate('コーデA')

    expect(state.value.coordinates).toHaveLength(1)
    expect(state.value.coordinates[0]!.name).toBe('コーデB')
  })

  it('コーデ名を変更するとstateに新しい名前で反映される', async () => {
    const { addCoordinate, renameCoordinate } = useCoordinatesDB(state)
    const coord = makeCoordinate({ name: '旧コーデ名' })
    await addCoordinate(coord)

    await renameCoordinate('旧コーデ名', { ...coord, name: '新コーデ名' })

    expect(state.value.coordinates).toHaveLength(1)
    expect(state.value.coordinates[0]!.name).toBe('新コーデ名')
  })

  it('コーデのアイテム所持数を更新できる', async () => {
    const { addCoordinate, updateCoordinateItem } = useCoordinatesDB(state)
    const coord = makeCoordinate({ name: 'コーデA' })
    await addCoordinate(coord)

    await updateCoordinateItem('コーデA', 'tops', true)

    expect(state.value.coordinates[0]!.items.tops.number).toBe(1)
  })

  it('アイテム所持チェックを外すと所持数が0になる', async () => {
    const { addCoordinate, updateCoordinateItem } = useCoordinatesDB(state)
    const coord = makeCoordinate({
      name: 'コーデA',
      items: {
        accessory: { type: 'accessory', number: 0, bp: 0, id: '', name: '' },
        onepiece: { type: 'onepiece', number: 0, bp: 0, id: '', name: '' },
        tops: { type: 'tops', number: 1, bp: 0, id: '', name: '' },
        bottoms: { type: 'bottoms', number: 0, bp: 0, id: '', name: '' },
        shoes: { type: 'shoes', number: 0, bp: 0, id: '', name: '' },
      },
    })
    await addCoordinate(coord)

    await updateCoordinateItem('コーデA', 'tops', false)

    expect(state.value.coordinates[0]!.items.tops.number).toBe(0)
  })

  it('同名のコーデを追加しようとするとエラーになる', async () => {
    const { addCoordinate } = useCoordinatesDB(state)
    await addCoordinate(makeCoordinate({ name: 'コーデA' }))

    await expect(addCoordinate(makeCoordinate({ name: 'コーデA' }))).rejects.toBeTruthy()
  })

  it('dbがnullの場合はエラーになる', async () => {
    state.value.db = null
    const { addCoordinate } = useCoordinatesDB(state)

    await expect(addCoordinate(makeCoordinate())).rejects.toThrow('DB not initialized')
  })
})
