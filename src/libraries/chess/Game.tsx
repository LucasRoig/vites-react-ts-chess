import {Move} from "./index";

export type Headers = {
  [key: string]: string
}

export interface FirstPosition {
  nags: number[]
  fen: string
  comment?: string
  variations: Position[]
  index: number
}

export type Position = FirstPosition & {
  move: Move
  san: string
  commentBefore?: string
}

export interface Game {
  id: number
  headers: Headers
  firstPosition: FirstPosition
  comment?: string
}

export interface SerializablePosition {
  index: number
  nextPositionIndex?: number
  variationsIndexes: number[]
  nags: number[]
  fen: string
  comment?: string
  commentBefore?: string
  move: Move
  san: string
  isMainline: boolean
}

export interface SerializableGame {
  headers: Headers
  id: number
  comment?: string
  positions: SerializablePosition[]
}

export function serializableGameToGame(game: SerializableGame): Game {
  const positionsById = game.positions.reduce((map, nextVal) => {
    map.set(nextVal.index, nextVal);
    return map;
  }, new Map<number, SerializablePosition>());

  function parsePosition(index: number): Position {
    const p = positionsById.get(index);
    if (p) {
      const {nags, fen, index, move, san, comment, commentBefore} = p
      const newPosition: Position = {
        nags, fen, index, move, san, comment, commentBefore,
        variations: p.variationsIndexes.map(i => parsePosition(i)),
      }
      if (p.nextPositionIndex) {
        newPosition.variations.unshift(parsePosition(p.nextPositionIndex))
      }
      return newPosition
    } else {
      throw new Error("Bad Game")
    }
  }
  return  {
    id: game.id,
    comment: game.comment,
    headers: game.headers,
    firstPosition: parsePosition(0)
  }
}
