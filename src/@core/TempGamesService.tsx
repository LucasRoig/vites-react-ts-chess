import ChessDbService from "./ChessDbService";
import {newNormalizedGame, NormalizedGame} from "../libraries/chess/NormalizedGame";

interface TemporaryGame {
  temporaryId: number,
  game: NormalizedGame,
  saveData: null | {
    gameId: string,
    dbId: string
  }
}

const localStorageKey = "temporaryGames"

function getLocalStorage(): TemporaryGame[] {
  const str = localStorage.getItem(localStorageKey);
  if (!str) {
    return []
  } else {
    return JSON.parse(str) as TemporaryGame[]
  }
}

function addToLocalStorage(game: NormalizedGame, saveData: null | { gameId: string, dbId: string } = null): TemporaryGame {
  const games = getLocalStorage();
  const id = Math.max(...games.map(g => g.temporaryId), -1) + 1
  const tempGame: TemporaryGame = {
    temporaryId: id,
    game: game,
    saveData: saveData
  }
  games.push(tempGame)
  localStorage.setItem(localStorageKey, JSON.stringify(games))
  return tempGame
}

function newTemporaryGame(): TemporaryGame {
  const game = newNormalizedGame();
  const temporaryGame = addToLocalStorage(game);
  return temporaryGame
}

function getTemporaryGame(id: number): TemporaryGame | undefined {
  const find = getLocalStorage().find(g => g.temporaryId === id);
  if (find) {
    return find
  } else {
    return undefined
  }
}

function getTempGameFromDatabase(gameId: string, dbId: string): Promise<TemporaryGame | undefined> {
  const find = getLocalStorage().find(g => g.saveData && g.saveData.dbId == dbId && g.saveData.gameId == gameId);
  if (find) {
    return new Promise<TemporaryGame>(resolve => resolve(find))
  } else {
    return ChessDbService.getGame(gameId).then(g => {
      if (!g) {
        return undefined
      }

      let temporaryGame = addToLocalStorage(g, {gameId: g.id, dbId: dbId});
      return temporaryGame
    })
  }
}

function updateTemporaryGame(game: TemporaryGame): void {
  const games = getLocalStorage();
  const index = games.findIndex(t => t.temporaryId === game.temporaryId);
  if (index >= 0) {
    games[index] = game
    localStorage.setItem(localStorageKey, JSON.stringify(games))
  }
}

function closeGame(tempId: number): void {
  localStorage.setItem(localStorageKey, JSON.stringify(getLocalStorage().filter(g => g.temporaryId !== tempId)))
}

function closeGameFromDb(gameId: string, dbId: string) {
  localStorage.setItem(localStorageKey,
    JSON.stringify(
      getLocalStorage().filter(g => !g.saveData || g.saveData.dbId !== dbId || g.saveData.gameId !== gameId)
    )
  )
}

export default {
  newTemporaryGame,
  getTemporaryGame,
  updateTemporaryGame,
  closeGame,
  getTempGameFromDatabase,
  closeGameFromDb
};

export type {TemporaryGame};
