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
  parent: Position | FirstPosition
}

export interface Game {
  id: number
  headers: Headers
  firstPosition: FirstPosition
  comment?: string
}

export type NonCircularGame = Omit<Game, "firstPosition"> & {
  firstPosition: NonCircularFirstPosition
}

export type NonCircularFirstPosition = Omit<FirstPosition, "variations"> & {
  variations: NonCircularPosition[]
}

export type NonCircularPosition = Omit<Position, "parent" | "variations"> & {
  variations: NonCircularPosition[]
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

  function parseFirstPosition(index: number): FirstPosition {
    const p = positionsById.get(index);
    if (p) {
      const {nags, fen, index, comment} = p
      const newPosition: FirstPosition = {
        nags, fen, index, comment,
        variations: [],
      }
      newPosition.variations = p.variationsIndexes.map(i => parsePosition(i, newPosition))
      if (p.nextPositionIndex) {
        newPosition.variations.unshift(parsePosition(p.nextPositionIndex, newPosition))
      }
      return newPosition
    } else {
      throw new Error("Bad Game")
    }
  }

  function parsePosition(index: number, parent: Position | FirstPosition): Position {
    const p = positionsById.get(index);
    if (p) {
      const {nags, fen, index, move, san, comment, commentBefore} = p
      const newPosition: Position = {
        nags, fen, index, move, san, comment, commentBefore, parent,
        variations: [],
      }
      newPosition.variations = p.variationsIndexes.map(i => parsePosition(i, newPosition))
      if (p.nextPositionIndex) {
        newPosition.variations.unshift(parsePosition(p.nextPositionIndex, newPosition))
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
    firstPosition: parseFirstPosition(0)
  }
}

export function gameToNonCircularGame(game: Game): NonCircularGame{
  //Workaround storybook inability to handle circular objects, this is ugly
  function positionToNonCircularPosition(p: Position): NonCircularPosition {
    let {parent, ...rest} = p
    return {
      ...rest,
      variations: rest.variations.map(positionToNonCircularPosition)
    }
  }

  return {
    ...game,
    firstPosition: {
      ...game.firstPosition,
      variations: game.firstPosition.variations.map(positionToNonCircularPosition)
    }
  }
}

export function nonCircularGameToGame(game: NonCircularGame): Game {
  function nonCircularPosToPos(p: NonCircularPosition, parent: Position | FirstPosition): Position {
    let newPos: Position = {
      ...p,
      parent,
      variations: []
    }
    newPos.variations = p.variations.map(i => nonCircularPosToPos(i, newPos));
    return newPos;
  }

  let newPos: FirstPosition = {
    ...game.firstPosition,
    variations: []
  }
  newPos.variations = game.firstPosition.variations.map(i => nonCircularPosToPos(i, newPos))
  return {
    ...game,
    firstPosition: newPos
  }
}
