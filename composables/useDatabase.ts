/** `useDatabse` の中身 */
interface DatabaseState {
  db: null | IDBDatabase
  allCoordinates: VerseCoordinate[]
}

/** コーデを表すインターフェース */
export interface VerseCoordinate {
  name: string
  rarity: number
  brandName: string
  /** カードプール */
  pool: string[]
  /** 画像ファイル */
  file?: File
  /** このコーデが含むパーツの種類 */
  itemType: CoordinateItemType[]
  /** 各アイテムの所持数 */
  items: {
    accessory: CoordinateItemState<'accessory'>
    onepiece: CoordinateItemState<'onepiece'>
    tops: CoordinateItemState<'tops'>
    bottoms: CoordinateItemState<'bottoms'>
    shoes: CoordinateItemState<'shoes'>
  }
  /** タグ（検索用） */
  tags: string[]
  /** メモ */
  memo: string
}

/** アイテムの種類 */
export type CoordinateItemType = keyof VerseCoordinate['items']

/** コーデアイテムを表すインターフェース */
export interface CoordinateItemState<T extends CoordinateItemType> {
  /** アイテムの種類 */
  type: T
  /** 所持数 */
  number: number
  /** BP(任意登録) */
  bp: number
  /** ID(任意登録) */
  id: string
  /** アイテム名(コーデ名と異なる場合のみ登録) */
  name: string
}

export const useDatabase = () => {
  return useState<DatabaseState>('database', () => {
    return {
      db: null,
      allCoordinates: [],
    }
  })
}
