import { ref, computed, type Ref } from 'vue'
import type { VerseCoordinate } from './useDatabase'

export type CoordinateSortType = 'name' | 'brand' | 'type' | 'rarity' | 'pool'
export type SortOrder = 'asc' | 'desc'

export interface CoordinateFilterOptions {
  word?: string
  brandName?: string
  typeName?: string
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
    if (options.typeName && coordinate.typeName !== options.typeName) return false
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
  typeNameList: string[] = [],
  cardPoolList: string[] = [],
): VerseCoordinate[] {
  const result = [...coordinates]
  result.sort((a, b) => {
    if (sortType === 'name') {
      // NOTE: ひらがな・カタカナは同列になる
      return a.name.localeCompare(b.name)
    }
    else if (sortType === 'brand') {
      // brandNameListに入っている順。brandNameがないコーデはリストの後ろ
      const aIndex = a.brandName ? brandNameList.indexOf(a.brandName) : brandNameList.length
      const bIndex = b.brandName ? brandNameList.indexOf(b.brandName) : brandNameList.length
      return aIndex - bIndex
    }
    else if (sortType === 'type') {
      // typeNameListに入っている順。typeNameがないコーデはリストの後ろ
      const aIndex = a.typeName ? typeNameList.indexOf(a.typeName) : typeNameList.length
      const bIndex = b.typeName ? typeNameList.indexOf(b.typeName) : typeNameList.length
      return aIndex - bIndex
    }
    else if (sortType === 'rarity') {
      return a.rarity - b.rarity
    }
    else if (sortType === 'pool') {
      // poolが複数ある場合はcardPoolListの最小インデックスを使う。poolなしはリストの後ろ
      const aIndex = a.pool.length > 0
        ? Math.min(...a.pool.map(p => cardPoolList.indexOf(p) === -1 ? cardPoolList.length : cardPoolList.indexOf(p)))
        : cardPoolList.length
      const bIndex = b.pool.length > 0
        ? Math.min(...b.pool.map(p => cardPoolList.indexOf(p) === -1 ? cardPoolList.length : cardPoolList.indexOf(p)))
        : cardPoolList.length
      return aIndex - bIndex
    }
    return 0
  })
  if (sortOrder === 'asc') result.reverse()
  return result
}

/** コーデリストのフィルター・ソート状態を管理するcomposable */
export const useCoordinateFilter = (
  coordinates: Ref<VerseCoordinate[]>,
  options: { brandNameList?: string[], typeNameList?: string[], cardPoolList?: string[] } = {},
) => {
  const formWord = ref('')
  const formBrandName = ref('')
  const formTypeName = ref('')
  const formCardPool = ref('')
  const formRarity = ref<number | undefined>()
  const formCompleted = ref<boolean | undefined>()
  const sortType = ref<CoordinateSortType>('name')
  const sortOrder = ref<SortOrder>('desc')

  /** しぼりこみを1つでも使っているか？ */
  const filterUsing = computed<boolean>(() =>
    formBrandName.value !== ''
    || formTypeName.value !== ''
    || formCardPool.value !== ''
    || formRarity.value !== undefined
    || formCompleted.value !== undefined,
  )

  /** しぼりこみをすべて解除する */
  const clearFilter = () => {
    formBrandName.value = ''
    formTypeName.value = ''
    formCardPool.value = ''
    formRarity.value = undefined
    formCompleted.value = undefined
  }

  /** けんさく＆しぼりこみ＆ならびかえを適用したコーデリスト */
  const filteredCoordinates = computed<VerseCoordinate[]>(() => {
    const filtered = filterCoordinates(coordinates.value, {
      word: formWord.value || undefined,
      brandName: formBrandName.value || undefined,
      typeName: formTypeName.value || undefined,
      cardPool: formCardPool.value || undefined,
      rarity: formRarity.value,
      completed: formCompleted.value,
    })
    return sortCoordinates(filtered, sortType.value, sortOrder.value, options.brandNameList, options.typeNameList, options.cardPoolList)
  })

  return {
    formWord,
    formBrandName,
    formTypeName,
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
