import {Game, serializableGameToGame} from "../libraries/chess";
import {FirstPosition, gameToSerializableGame, SerializableGame} from "../libraries/chess/Game";

interface TemporaryGame {
  temporaryId: number,
  game: Game
}

interface SerializableTempGame {
  temporaryId: number,
  game: SerializableGame
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

function addToLocalStorage(game: Game): TemporaryGame {
  const games = getLocalStorage();
  const id = Math.max(...games.map(g => g.temporaryId), -1) + 1
  const tempGame: TemporaryGame = {
    temporaryId: id,
    game: game
  }
  games.push({
    temporaryId: tempGame.temporaryId,
    game: gameToSerializableGame(tempGame.game)
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
      game: serializableGameToGame(find.game)
    }
  } else {
    return undefined
  }
}

function updateTemporaryGame(game: TemporaryGame): void {
  console.log(game)
  const games = getLocalStorage();
  const index = games.findIndex(t => t.temporaryId === game.temporaryId);
  if (index >= 0) {
    games[index] = {
      temporaryId: game.temporaryId,
      game: gameToSerializableGame(game.game)
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
  closeGame
};

export type { TemporaryGame };
