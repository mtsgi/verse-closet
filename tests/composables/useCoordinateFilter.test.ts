import { describe, it, expect } from 'vitest'
import { filterCoordinates, sortCoordinates } from '../../composables/useCoordinateFilter'
import type { VerseCoordinate } from '../../composables/useDatabase'

/** テスト用のコーデオブジェクトを生成するヘルパー */
function makeCoordinate(override: Partial<VerseCoordinate> = {}): VerseCoordinate {
  return {
    name: 'テストコーデ',
    rarity: 1,
    brandName: 'ブランドA',
    pool: [],
    itemType: ['tops', 'bottoms', 'shoes'],
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

describe('filterCoordinates', () => {
  it('フィルターなしの場合は全件返す', () => {
    const coords = [makeCoordinate({ name: 'コーデA' }), makeCoordinate({ name: 'コーデB' })]
    expect(filterCoordinates(coords, {})).toHaveLength(2)
  })

  it('キーワードで名前の部分一致フィルタリングができる', () => {
    const coords = [
      makeCoordinate({ name: 'サマーコーデ' }),
      makeCoordinate({ name: 'ウィンターコーデ' }),
      makeCoordinate({ name: 'サマードレス' }),
    ]
    const result = filterCoordinates(coords, { word: 'サマー' })
    expect(result).toHaveLength(2)
    expect(result.map(c => c.name)).toEqual(['サマーコーデ', 'サマードレス'])
  })

  it('ブランドで完全一致フィルタリングができる', () => {
    const coords = [
      makeCoordinate({ name: 'コーデA', brandName: 'ブランドA' }),
      makeCoordinate({ name: 'コーデB', brandName: 'ブランドB' }),
      makeCoordinate({ name: 'コーデC', brandName: 'ブランドA' }),
    ]
    const result = filterCoordinates(coords, { brandName: 'ブランドA' })
    expect(result).toHaveLength(2)
    expect(result.every(c => c.brandName === 'ブランドA')).toBe(true)
  })

  it('カードプールでフィルタリングができる', () => {
    const coords = [
      makeCoordinate({ name: 'コーデA', pool: ['プールX', 'プールY'] }),
      makeCoordinate({ name: 'コーデB', pool: ['プールY'] }),
      makeCoordinate({ name: 'コーデC', pool: ['プールZ'] }),
    ]
    const result = filterCoordinates(coords, { cardPool: 'プールY' })
    expect(result).toHaveLength(2)
    expect(result.map(c => c.name)).toEqual(['コーデA', 'コーデB'])
  })

  it('レアリティでフィルタリングができる', () => {
    const coords = [
      makeCoordinate({ name: 'コーデA', rarity: 1 }),
      makeCoordinate({ name: 'コーデB', rarity: 2 }),
      makeCoordinate({ name: 'コーデC', rarity: 1 }),
    ]
    const result = filterCoordinates(coords, { rarity: 1 })
    expect(result).toHaveLength(2)
    expect(result.every(c => c.rarity === 1)).toBe(true)
  })

  it('スペシャル(rarity: -1)でフィルタリングができる', () => {
    const coords = [
      makeCoordinate({ name: 'スペシャルコーデ', rarity: -1 }),
      makeCoordinate({ name: '通常コーデA', rarity: 1 }),
      makeCoordinate({ name: '通常コーデB', rarity: 2 }),
    ]
    const result = filterCoordinates(coords, { rarity: -1 })
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe('スペシャルコーデ')
  })

  it('完了状態（フルコーデ）でフィルタリングができる', () => {
    const completedCoord = makeCoordinate({
      name: 'フルコーデ',
      itemType: ['tops', 'bottoms'],
      items: {
        accessory: { type: 'accessory', number: 0, bp: 0, id: '', name: '' },
        onepiece: { type: 'onepiece', number: 0, bp: 0, id: '', name: '' },
        tops: { type: 'tops', number: 1, bp: 0, id: '', name: '' },
        bottoms: { type: 'bottoms', number: 1, bp: 0, id: '', name: '' },
        shoes: { type: 'shoes', number: 0, bp: 0, id: '', name: '' },
      },
    })
    const incompleteCoord = makeCoordinate({
      name: '未完成コーデ',
      itemType: ['tops', 'bottoms'],
      items: {
        accessory: { type: 'accessory', number: 0, bp: 0, id: '', name: '' },
        onepiece: { type: 'onepiece', number: 0, bp: 0, id: '', name: '' },
        tops: { type: 'tops', number: 1, bp: 0, id: '', name: '' },
        bottoms: { type: 'bottoms', number: 0, bp: 0, id: '', name: '' },
        shoes: { type: 'shoes', number: 0, bp: 0, id: '', name: '' },
      },
    })

    const result = filterCoordinates([completedCoord, incompleteCoord], { completed: true })
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe('フルコーデ')

    const incompleteResult = filterCoordinates([completedCoord, incompleteCoord], { completed: false })
    expect(incompleteResult).toHaveLength(1)
    expect(incompleteResult[0]!.name).toBe('未完成コーデ')
  })

  it('複数条件を組み合わせてフィルタリングができる', () => {
    const coords = [
      makeCoordinate({ name: 'サマーA', brandName: 'ブランドA', rarity: 1 }),
      makeCoordinate({ name: 'サマーB', brandName: 'ブランドB', rarity: 1 }),
      makeCoordinate({ name: 'ウィンターA', brandName: 'ブランドA', rarity: 2 }),
    ]
    const result = filterCoordinates(coords, { word: 'サマー', brandName: 'ブランドA' })
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe('サマーA')
  })

  it('タイプで完全一致フィルタリングができる', () => {
    const coords = [
      makeCoordinate({ name: 'コーデA', typeName: 'キュート' }),
      makeCoordinate({ name: 'コーデB', typeName: 'クール' }),
      makeCoordinate({ name: 'コーデC', typeName: 'キュート' }),
    ]
    const result = filterCoordinates(coords, { typeName: 'キュート' })
    expect(result).toHaveLength(2)
    expect(result.every(c => c.typeName === 'キュート')).toBe(true)
  })

  it('brandNameを持つコーデはタイプフィルターで除外される', () => {
    const coords = [
      makeCoordinate({ name: 'コーデA', brandName: 'ブランドA', typeName: undefined }),
      makeCoordinate({ name: 'コーデB', brandName: undefined, typeName: 'キュート' }),
    ]
    const result = filterCoordinates(coords, { typeName: 'キュート' })
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe('コーデB')
  })
})

describe('sortCoordinates', () => {
  it('名前の昇順でソートできる', () => {
    const coords = [
      makeCoordinate({ name: 'ウ' }),
      makeCoordinate({ name: 'ア' }),
      makeCoordinate({ name: 'イ' }),
    ]
    const result = sortCoordinates(coords, 'name', 'asc')
    expect(result.map(c => c.name)).toEqual(['ウ', 'イ', 'ア'])
  })

  it('名前の降順でソートできる', () => {
    const coords = [
      makeCoordinate({ name: 'ウ' }),
      makeCoordinate({ name: 'ア' }),
      makeCoordinate({ name: 'イ' }),
    ]
    const result = sortCoordinates(coords, 'name', 'desc')
    expect(result.map(c => c.name)).toEqual(['ア', 'イ', 'ウ'])
  })

  it('レアリティの昇順でソートできる', () => {
    const coords = [
      makeCoordinate({ name: 'C', rarity: 3 }),
      makeCoordinate({ name: 'A', rarity: 1 }),
      makeCoordinate({ name: 'B', rarity: 2 }),
    ]
    const result = sortCoordinates(coords, 'rarity', 'asc')
    expect(result.map(c => c.rarity)).toEqual([3, 2, 1])
  })

  it('スペシャル(rarity: -1)は昇順レアリティソートで末尾に並ぶ', () => {
    const coords = [
      makeCoordinate({ name: 'SP', rarity: -1 }),
      makeCoordinate({ name: '★★', rarity: 2 }),
      makeCoordinate({ name: '★', rarity: 1 }),
    ]
    const result = sortCoordinates(coords, 'rarity', 'asc')
    // 昇順(asc)はresult.reverse()されるので、数値降順 → -1が末尾
    expect(result[result.length - 1]!.rarity).toBe(-1)
  })

  it('スペシャル(rarity: -1)は降順レアリティソートで先頭に並ぶ', () => {
    const coords = [
      makeCoordinate({ name: 'SP', rarity: -1 }),
      makeCoordinate({ name: '★★', rarity: 2 }),
      makeCoordinate({ name: '★', rarity: 1 }),
    ]
    const result = sortCoordinates(coords, 'rarity', 'desc')
    // 降順(desc)はそのまま数値昇順なので -1 が先頭
    expect(result[0]!.rarity).toBe(-1)
  })

  it('レアリティの降順でソートできる', () => {
    const coords = [
      makeCoordinate({ name: 'C', rarity: 3 }),
      makeCoordinate({ name: 'A', rarity: 1 }),
      makeCoordinate({ name: 'B', rarity: 2 }),
    ]
    const result = sortCoordinates(coords, 'rarity', 'desc')
    expect(result.map(c => c.rarity)).toEqual([1, 2, 3])
  })

  it('ブランドリストの順にソートできる', () => {
    const brandNameList = ['ブランドA', 'ブランドB', 'ブランドC']
    const coords = [
      makeCoordinate({ name: 'コーデC', brandName: 'ブランドC' }),
      makeCoordinate({ name: 'コーデA', brandName: 'ブランドA' }),
      makeCoordinate({ name: 'コーデB', brandName: 'ブランドB' }),
    ]
    const result = sortCoordinates(coords, 'brand', 'asc', brandNameList)
    expect(result.map(c => c.brandName)).toEqual(['ブランドC', 'ブランドB', 'ブランドA'])
  })

  it('brandNameがないコーデ（typeNameのみ）はブランドソートで末尾に並ぶ', () => {
    const brandNameList = ['ブランドA', 'ブランドB']
    const coords = [
      makeCoordinate({ name: 'タイプコーデ', brandName: undefined, typeName: 'キュート' }),
      makeCoordinate({ name: 'ブランドBコーデ', brandName: 'ブランドB' }),
      makeCoordinate({ name: 'ブランドAコーデ', brandName: 'ブランドA' }),
    ]
    const result = sortCoordinates(coords, 'brand', 'desc', brandNameList)
    expect(result[result.length - 1]!.name).toBe('タイプコーデ')
  })

  it('元の配列を変更しない（イミュータブル）', () => {
    const coords = [makeCoordinate({ name: 'B' }), makeCoordinate({ name: 'A' })]
    sortCoordinates(coords, 'name', 'asc')
    expect(coords[0]!.name).toBe('B')
  })

  it('タイプリストの順にソートできる', () => {
    const typeNameList = ['キュート', 'クール', 'ポップ']
    const coords = [
      makeCoordinate({ name: 'コーデC', brandName: undefined, typeName: 'ポップ' }),
      makeCoordinate({ name: 'コーデA', brandName: undefined, typeName: 'キュート' }),
      makeCoordinate({ name: 'コーデB', brandName: undefined, typeName: 'クール' }),
    ]
    const result = sortCoordinates(coords, 'type', 'asc', [], typeNameList)
    expect(result.map(c => c.typeName)).toEqual(['ポップ', 'クール', 'キュート'])
  })

  it('typeNameがないコーデ（brandNameのみ）はタイプソートで末尾に並ぶ', () => {
    const typeNameList = ['キュート', 'クール']
    const coords = [
      makeCoordinate({ name: 'ブランドコーデ', brandName: 'ブランドA', typeName: undefined }),
      makeCoordinate({ name: 'クールコーデ', brandName: undefined, typeName: 'クール' }),
      makeCoordinate({ name: 'キュートコーデ', brandName: undefined, typeName: 'キュート' }),
    ]
    const result = sortCoordinates(coords, 'type', 'desc', [], typeNameList)
    expect(result[result.length - 1]!.name).toBe('ブランドコーデ')
  })

  it('バージョンリストの順（昇順）にソートできる', () => {
    const cardPoolList = ['バージョン1', 'バージョン2', 'バージョン3']
    const coords = [
      makeCoordinate({ name: 'コーデC', pool: ['バージョン3'] }),
      makeCoordinate({ name: 'コーデA', pool: ['バージョン1'] }),
      makeCoordinate({ name: 'コーデB', pool: ['バージョン2'] }),
    ]
    const result = sortCoordinates(coords, 'pool', 'asc', [], [], cardPoolList)
    expect(result.map(c => c.name)).toEqual(['コーデC', 'コーデB', 'コーデA'])
  })

  it('バージョンリストの順（降順）にソートできる', () => {
    const cardPoolList = ['バージョン1', 'バージョン2', 'バージョン3']
    const coords = [
      makeCoordinate({ name: 'コーデC', pool: ['バージョン3'] }),
      makeCoordinate({ name: 'コーデA', pool: ['バージョン1'] }),
      makeCoordinate({ name: 'コーデB', pool: ['バージョン2'] }),
    ]
    const result = sortCoordinates(coords, 'pool', 'desc', [], [], cardPoolList)
    expect(result.map(c => c.name)).toEqual(['コーデA', 'コーデB', 'コーデC'])
  })

  it('poolがないコーデはバージョンソートで末尾に並ぶ', () => {
    const cardPoolList = ['バージョン1', 'バージョン2']
    const coords = [
      makeCoordinate({ name: 'プールなし', pool: [] }),
      makeCoordinate({ name: 'バージョン2コーデ', pool: ['バージョン2'] }),
      makeCoordinate({ name: 'バージョン1コーデ', pool: ['バージョン1'] }),
    ]
    const result = sortCoordinates(coords, 'pool', 'desc', [], [], cardPoolList)
    expect(result[result.length - 1]!.name).toBe('プールなし')
  })

  it('複数poolを持つコーデは最小インデックスで並ぶ', () => {
    const cardPoolList = ['バージョン1', 'バージョン2', 'バージョン3']
    const coords = [
      makeCoordinate({ name: '複数pool', pool: ['バージョン3', 'バージョン1'] }),
      makeCoordinate({ name: 'バージョン2のみ', pool: ['バージョン2'] }),
    ]
    // 複数poolの最小インデックスはバージョン1(0)、バージョン2のみはインデックス1
    // 降順(desc)はreverseしないため、インデックスが小さい方が先頭（複数pool→バージョン2のみ）
    const result = sortCoordinates(coords, 'pool', 'desc', [], [], cardPoolList)
    expect(result.map(c => c.name)).toEqual(['複数pool', 'バージョン2のみ'])
  })
})
