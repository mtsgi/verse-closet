import { describe, it, expect } from 'vitest'
import { sortCollections } from '../../composables/useCollectionFilter'
import type { VerseCollection } from '../../composables/useDatabase'

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

describe('sortCollections', () => {
  it('名前の昇順でソートできる', () => {
    const collections = [
      makeCollection({ name: 'ウ' }),
      makeCollection({ name: 'ア' }),
      makeCollection({ name: 'イ' }),
    ]
    const result = sortCollections(collections, 'name', 'asc')
    expect(result.map(c => c.name)).toEqual(['ア', 'イ', 'ウ'])
  })

  it('名前の降順でソートできる', () => {
    const collections = [
      makeCollection({ name: 'ウ' }),
      makeCollection({ name: 'ア' }),
      makeCollection({ name: 'イ' }),
    ]
    const result = sortCollections(collections, 'name', 'desc')
    expect(result.map(c => c.name)).toEqual(['ウ', 'イ', 'ア'])
  })

  it('コーデの数の昇順でソートできる', () => {
    const collections = [
      makeCollection({ name: 'C', coordinates: ['a', 'b', 'c'] }),
      makeCollection({ name: 'A', coordinates: [] }),
      makeCollection({ name: 'B', coordinates: ['x'] }),
    ]
    const result = sortCollections(collections, 'count', 'asc')
    expect(result.map(c => c.name)).toEqual(['C', 'B', 'A'])
  })

  it('コーデの数の降順でソートできる', () => {
    const collections = [
      makeCollection({ name: 'C', coordinates: ['a', 'b', 'c'] }),
      makeCollection({ name: 'A', coordinates: [] }),
      makeCollection({ name: 'B', coordinates: ['x'] }),
    ]
    const result = sortCollections(collections, 'count', 'desc')
    expect(result.map(c => c.name)).toEqual(['A', 'B', 'C'])
  })

  it('作成日時の昇順でソートできる', () => {
    const collections = [
      makeCollection({ name: '2023', createdAt: new Date('2023-06-01') }),
      makeCollection({ name: '2024', createdAt: new Date('2024-01-01') }),
      makeCollection({ name: '2022', createdAt: new Date('2022-03-01') }),
    ]
    const result = sortCollections(collections, 'createdAt', 'asc')
    expect(result.map(c => c.name)).toEqual(['2024', '2023', '2022'])
  })

  it('作成日時の降順でソートできる', () => {
    const collections = [
      makeCollection({ name: '2023', createdAt: new Date('2023-06-01') }),
      makeCollection({ name: '2024', createdAt: new Date('2024-01-01') }),
      makeCollection({ name: '2022', createdAt: new Date('2022-03-01') }),
    ]
    const result = sortCollections(collections, 'createdAt', 'desc')
    expect(result.map(c => c.name)).toEqual(['2022', '2023', '2024'])
  })

  it('元の配列を変更しない（イミュータブル）', () => {
    const collections = [
      makeCollection({ name: 'B' }),
      makeCollection({ name: 'A' }),
    ]
    sortCollections(collections, 'name', 'asc')
    expect(collections[0]!.name).toBe('B')
  })
})
