import ApiService from "./ApiService";

function createChessDb(name: string): Promise<ChessDb> {
  return ApiService.post<ChessDb>("/db", {
    db: {
      name
    }
  })
}

function fetchChessDb(): Promise<ChessDb[]> {
  return ApiService.get<ChessDb[]>("/db")
}

function deleteChessDb(db: ChessDb): Promise<void> {
  return ApiService.del<void>(`/db/${db.id}`)
}

export default {
  createChessDb,
  fetchChessDb,
  deleteChessDb
}

export interface ChessDb {
  name: string,
  id: number
}
