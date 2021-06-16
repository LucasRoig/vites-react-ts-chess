import {Game, serializableGameToGame} from "../libraries/chess";
import {FirstPosition, gameToSerializableGame, SerializableGame} from "../libraries/chess/Game";
import ChessDbService from "./ChessDbService";

interface TemporaryGame {
  temporaryId: number,
  game: Game,
  saveData: null | {
    gameId: number,
    dbId: number
  }
}

interface SerializableTempGame {
  temporaryId: number,
  game: SerializableGame,
  saveData: null | {
    gameId: number,
    dbId: number
  }
}

const localStorageKey = "temporaryGames"

function newGame(): Game {
  const firstPosition: FirstPosition = {
    index: 0,
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    variations: [],
    nags: []
  }
  const game: Game = {
    id: 0,
    firstPosition: firstPosition,
    headers: {}
  }
  return game
}

function getLocalStorage(): SerializableTempGame[] {
  const str = localStorage.getItem(localStorageKey);
  if (!str) {
    return []
  } else {
    return JSON.parse(str) as SerializableTempGame[]
  }
}

function addToLocalStorage(game: Game, saveData: null | {gameId: number, dbId: number} = null): TemporaryGame {
  const games = getLocalStorage();
  const id = Math.max(...games.map(g => g.temporaryId), -1) + 1
  const tempGame: TemporaryGame = {
    temporaryId: id,
    game: game,
    saveData: saveData
  }
  games.push({
    temporaryId: tempGame.temporaryId,
    game: gameToSerializableGame(tempGame.game),
    saveData: tempGame.saveData
  })
  localStorage.setItem(localStorageKey, JSON.stringify(games))
  return tempGame
}

function newTemporaryGame(): TemporaryGame {
  const game = newGame();
  const temporaryGame = addToLocalStorage(game);
  return temporaryGame
}

function getTemporaryGame(id: number): TemporaryGame | undefined {
  const find = getLocalStorage().find(g => g.temporaryId === id);
  if (find) {
    return {
      temporaryId: find.temporaryId,
      game: serializableGameToGame(find.game),
      saveData: find.saveData
    }
  } else {
    return undefined
  }
}

function getTempGameFromDatabase(gameId: number, dbId: number): Promise<TemporaryGame | undefined> {
  const find = getLocalStorage().find(g => g.saveData && g.saveData.dbId == dbId && g.saveData.gameId == gameId);
  if (find) {
    return new Promise<TemporaryGame>(resolve => resolve({
      temporaryId: find.temporaryId,
      game: serializableGameToGame(find.game),
      saveData: find.saveData
    }))
  } else {
    return ChessDbService.getGameFromDb(gameId, dbId).then(g => {
      if (!g) {
        return undefined
      }
      const game = newGame()
      game.id = g.id
      game.headers = {
        "white": g.white,
        "black": g.black,
        "date": g.date,
        "event": g.event,
        "result": g.result
      }
      let temporaryGame = addToLocalStorage(game, {gameId: g.id, dbId: g.chessDbId});
      return temporaryGame
    })
  }
}

function updateTemporaryGame(game: TemporaryGame): void {
  console.log(game)
  const games = getLocalStorage();
  const index = games.findIndex(t => t.temporaryId === game.temporaryId);
  if (index >= 0) {
    games[index] = {
      temporaryId: game.temporaryId,
      game: gameToSerializableGame(game.game),
      saveData: game.saveData
    }
    localStorage.setItem(localStorageKey, JSON.stringify(games))
  }
}

function closeGame(tempId: number): void {
  localStorage.setItem(localStorageKey, JSON.stringify(getLocalStorage().filter(g => g.temporaryId !== tempId)))
}

export default {
  newTemporaryGame,
  getTemporaryGame,
  updateTemporaryGame,
  closeGame,
  getTempGameFromDatabase
};

export type {TemporaryGame};
