import { ref, computed, type Ref } from 'vue'
import type { VerseCollection } from './useDatabase'

export type CollectionSortType = 'name' | 'count' | 'createdAt'
export type { SortOrder } from './useCoordinateFilter'

/** コレクションリストをソートする純粋関数 */
export function sortCollections(
  collections: VerseCollection[],
  sortType: CollectionSortType,
  sortOrder: 'asc' | 'desc',
): VerseCollection[] {
  const result = [...collections]
  result.sort((a, b) => {
    if (sortType === 'name') {
      return a.name.localeCompare(b.name)
    }
    else if (sortType === 'count') {
      return b.coordinates.length - a.coordinates.length
    }
    else if (sortType === 'createdAt') {
      return b.createdAt.getTime() - a.createdAt.getTime()
    }
    return 0
  })
  if (sortOrder === 'desc') result.reverse()
  return result
}

/** コレクションリストのソート状態を管理するcomposable */
export const useCollectionFilter = (collections: Ref<VerseCollection[]>) => {
  const sortType = ref<CollectionSortType>('name')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  /** ならびかえを適用したコレクションリスト */
  const filteredCollections = computed<VerseCollection[]>(() =>
    sortCollections(collections.value, sortType.value, sortOrder.value),
  )

  return {
    sortType,
    sortOrder,
    filteredCollections,
  }
}
