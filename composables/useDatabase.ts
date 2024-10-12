interface DatabaseState {
  db: null | IDBDatabase
  allCoordinates: VerseCoordinate[]
}

export interface VerseCoordinate {
  name: string
  rarity: number
  brandName: string
  /** タグ（検索用） */
  tags: string[]
  /** カードプール */
  pool: string[]
  /** 画像ファイル */
  file?: File
  /** このコーデが含むパーツの種類 */
  itemType: CoordinateItemType[]
  /** 各アイテムの所持数 */
  items: {
    accessory: CoordinateItemState
    onepiece: CoordinateItemState
    tops: CoordinateItemState
    bottoms: CoordinateItemState
    shoes: CoordinateItemState
  }
}

/** アイテムの種類 */
export type CoordinateItemType = keyof VerseCoordinate['items']

export interface CoordinateItemState {
  /** 所持数 */
  number: number
  /** BP(任意登録) */
  bp: number
  /** ID(任意登録) */
  id: string
}

export const useDatabase = () => {
  return useState<DatabaseState>('database', () => {
    return {
      db: null,
      allCoordinates: [],
    }
  })
}
