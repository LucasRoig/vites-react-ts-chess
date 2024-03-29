import ApiService from "./ApiService";
import {Headers} from "../libraries/chess";
import {NormalizedGame} from "../libraries/chess/NormalizedGame";

function createChessDb(name: string): Promise<ChessDb> {
  return ApiService.post<ChessDb>("/db", {
    name
  })
}

function fetchChessDb(): Promise<ChessDb[]> {
  return ApiService.get<ChessDb[]>("/db")
}

function deleteChessDb(db: ChessDb): Promise<void> {
  return ApiService.del<void>(`/db/${db.id}`)
}

function getDbDetails(id: string): Promise<ChessDbDetails> {
  return ApiService.get<ChessDbDetails>(`/db/${id}`)
}

function getGameFromDb(gameId: string, dbId: string): Promise<GameHeader | undefined> {
  return getDbDetails(dbId).then(details => details.games.find(g => g.id === gameId))
}

function getGame(gameId: string): Promise<NormalizedGame | void> {
  return ApiService.get<NormalizedGame & {white: string, black: string, date: string, event: string, result: string}>(`/games/${gameId}`)
}

function createGame(
  {
    dbId,
    game
  }: { dbId: string, game: NormalizedGame }): Promise<GameHeader> {
  return ApiService.post<GameHeader>(`/db/${dbId}/games`, game)
}

function deleteGame(game: GameHeader): Promise<void> {
  return ApiService.del<void>(`/games/${game.id}`)
}

function deleteDocument(doc: DocumentHeader): Promise<void> {
  return ApiService.del<void>('/documents/' + doc.id)
}

function updateGame(id: string, game: NormalizedGame): Promise<void> {
  return ApiService.post(`/games/${id}`, game)
}

export default {
  createChessDb,
  fetchChessDb,
  deleteChessDb,
  getDbDetails,
  createGame,
  getGameFromDb,
  getGame,
  deleteGame,
  updateGame,
  deleteDocument,
}

export interface ChessDb {
  name: string,
  id: string
}

export interface ChessDbDetails {
  database: ChessDb
  games: GameHeader[]
  documents: DocumentHeader[]
}

export interface DocumentHeader {
  title: string, id: string, index: number
}
export interface GameHeader {
  id: string,
  index: number
  db: string,
  userId: string,
  headers: Headers
}
