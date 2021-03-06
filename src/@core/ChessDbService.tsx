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

function getGameFromDb(gameId: number, dbId: number): Promise<GameHeader | undefined> {
  return getDbDetails(dbId).then(details => details.games.find(g => g.id == gameId))
}

function createGame(
  {
    dbId,
    white,
    black,
    date,
    event,
    result
  }: { dbId: number, white: string, black: string, date: string, event: string, result: string }): Promise<GameHeader> {
  return ApiService.post<GameHeader>(`/db/${dbId}/games`, {
    game: {
      white,
      black,
      date,
      event,
      result
    }
  })
}

export default {
  createChessDb,
  fetchChessDb,
  deleteChessDb,
  getDbDetails,
  createGame,
  getGameFromDb
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
