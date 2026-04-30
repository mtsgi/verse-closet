import { ref, computed, type Ref } from 'vue'
import type { VerseCoordinate } from './useDatabase'

export type CoordinateSortType = 'name' | 'brand' | 'rarity'
export type SortOrder = 'asc' | 'desc'

export interface CoordinateFilterOptions {
  word?: string
  brandName?: string
  cardPool?: string
  rarity?: number
  completed?: boolean
}

/** コーデリストをフィルタリングする純粋関数 */
export function filterCoordinates(
  coordinates: VerseCoordinate[],
  options: CoordinateFilterOptions,
): VerseCoordinate[] {
  return coordinates.filter((coordinate) => {
    if (options.word && !coordinate.name.includes(options.word)) return false
    if (options.brandName && coordinate.brandName !== options.brandName) return false
    if (options.cardPool && !coordinate.pool.includes(options.cardPool)) return false
    if (options.rarity !== undefined && coordinate.rarity !== options.rarity) return false
    if (options.completed !== undefined) {
      const isCompleted = coordinate.itemType.every(item => coordinate.items[item].number > 0)
      if (isCompleted !== options.completed) return false
    }
    return true
  })
}

/** コーデリストをソートする純粋関数 */
export function sortCoordinates(
  coordinates: VerseCoordinate[],
  sortType: CoordinateSortType,
  sortOrder: SortOrder,
  brandNameList: string[] = [],
): VerseCoordinate[] {
  const result = [...coordinates]
  result.sort((a, b) => {
    if (sortType === 'name') {
      // NOTE: ひらがな・カタカナは同列になる
      return a.name.localeCompare(b.name)
    }
    else if (sortType === 'brand') {
      // brandNameListに入っている順
      return brandNameList.indexOf(a.brandName) - brandNameList.indexOf(b.brandName)
    }
    else if (sortType === 'rarity') {
      return a.rarity - b.rarity
    }
    return 0
  })
  if (sortOrder === 'asc') result.reverse()
  return result
}

/** コーデリストのフィルター・ソート状態を管理するcomposable */
export const useCoordinateFilter = (
  coordinates: Ref<VerseCoordinate[]>,
  options: { brandNameList?: string[] } = {},
) => {
  const formWord = ref('')
  const formBrandName = ref('')
  const formCardPool = ref('')
  const formRarity = ref<number | undefined>()
  const formCompleted = ref<boolean | undefined>()
  const sortType = ref<CoordinateSortType>('name')
  const sortOrder = ref<SortOrder>('desc')

  /** しぼりこみを1つでも使っているか？ */
  const filterUsing = computed<boolean>(() =>
    formBrandName.value !== ''
    || formCardPool.value !== ''
    || formRarity.value !== undefined
    || formCompleted.value !== undefined,
  )

  /** しぼりこみをすべて解除する */
  const clearFilter = () => {
    formBrandName.value = ''
    formCardPool.value = ''
    formRarity.value = undefined
    formCompleted.value = undefined
  }

  /** けんさく＆しぼりこみ＆ならびかえを適用したコーデリスト */
  const filteredCoordinates = computed<VerseCoordinate[]>(() => {
    const filtered = filterCoordinates(coordinates.value, {
      word: formWord.value || undefined,
      brandName: formBrandName.value || undefined,
      cardPool: formCardPool.value || undefined,
      rarity: formRarity.value,
      completed: formCompleted.value,
    })
    return sortCoordinates(filtered, sortType.value, sortOrder.value, options.brandNameList)
  })

  return {
    formWord,
    formBrandName,
    formCardPool,
    formRarity,
    formCompleted,
    sortType,
    sortOrder,
    filterUsing,
    clearFilter,
    filteredCoordinates,
  }
}
