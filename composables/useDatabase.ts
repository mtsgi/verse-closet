interface DatabaseState {
  db: null | IDBDatabase
  allItems: CoordinateItem[]
}

export interface CoordinateItem {
  name: string
  file?: File
}

export const useDatabase = () => {
  return useState<DatabaseState>('database', () => {
    return {
      db: null,
      allItems: [],
    }
  })
}
