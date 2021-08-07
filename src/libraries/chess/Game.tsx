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
  id: string
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
  id: string
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

export function gameToSerializableGame(game: Game): SerializableGame {
  const allPositions: SerializablePosition[] = []

  function positionToSerializablePosition(p: Position, isMainline: boolean): SerializablePosition {
    let nextPositionIndex = undefined
    if (p.variations.length) {
      nextPositionIndex = positionToSerializablePosition(p.variations[0], true).index
    }
    let variationsIndexes: number[] = []
    if (p.variations.length >= 2) {
      variationsIndexes = p.variations.slice(1).map(v => positionToSerializablePosition(v, false).index)
    }
    const result: SerializablePosition = {
      fen: p.fen,
      index: p.index,
      comment: p.comment,
      commentBefore: p.commentBefore,
      move: p.move,
      san: p.san,
      nags: p.nags,
      nextPositionIndex: nextPositionIndex,
      variationsIndexes,
      isMainline
    }
    allPositions.push(result)
    return result
  }

  const firstPosition: SerializablePosition = {
    fen: game.firstPosition.fen,
    index: game.firstPosition.index,
    nags: game.firstPosition.nags,
    comment: game.firstPosition.comment,
    isMainline: true,
    variationsIndexes: [],
    san: "",
    move: {from:"a1", to:"a1"} //dumb but necessary
  }

  for (let i = 0; i < game.firstPosition.variations.length; i++) {
    const p = positionToSerializablePosition(game.firstPosition.variations[i], i == 0);
    if (i == 0) {
      firstPosition.nextPositionIndex = p.index
    } else {
      firstPosition.variationsIndexes.push(p.index)
    }
  }

  allPositions.push(firstPosition)

  const result: SerializableGame = {
    id: game.id,
    comment: game.comment,
    headers: game.headers,
    positions: allPositions
  }
  return result
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

export enum HeadersKeys {
  Event = "Event",
  Site = "Site",
  Date = "Date",
  Round = "Round",
  White = "White",
  Black = "Black",
  Result = "Result",
}

export function setHeader(game: Game, key: HeadersKeys, value: string) {
  game.headers[key] = value
}

export function getHeader(gameOrHeaders: Game | Headers, key: HeadersKeys): string {
  if (gameOrHeaders.headers) {
    return (gameOrHeaders as Game).headers[key] || ""
  } else {
    return (gameOrHeaders as Headers)[key] || ""
  }
}

export function gameToString(gameOrHeaders: Game | Headers): string {
  const headers: Headers = (gameOrHeaders as Game).headers || gameOrHeaders as Headers;
  if (getHeader(headers, HeadersKeys.Black)) {
    return getHeader(headers, HeadersKeys.White) + " - " + getHeader(headers, HeadersKeys.Black)
  } else {
    return getHeader(headers, HeadersKeys.White)
  }
}
