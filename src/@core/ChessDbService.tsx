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

function getDbDetails(id: number): Promise<ChessDbDetails> {
  return ApiService.get<ChessDbDetails>(`/db/${id}`)
}

export default {
  createChessDb,
  fetchChessDb,
  deleteChessDb,
  getDbDetails
}

export interface ChessDb {
  name: string,
  id: number
}

export interface ChessDbDetails {
  database: ChessDb
  games: GameHeader[]
}

export interface GameHeader {
  id: number,
  chessDbId: number,
  userId: number,
  white: string,
  black: string,
  event: string,
  date: string,
  result: string
}
