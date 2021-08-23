import {Headers, Move, Square} from "./index";

export interface NormalizedFirstPosition {
  index: number;
  variationsIndexes: number[];
  fen: string;
  comment?: string;
}

export type NormalizedPosition  = NormalizedFirstPosition & {
  nags: number[];
  commentBefore?: string;
  move: Move;
  san: string;
  parent: number;
}

export interface NormalizedGame {
  headers: Headers
  id: string
  comment?: string
  positions: {
    [key: number]: NormalizedFirstPosition | NormalizedPosition
  }
}

export function newNormalizedGame(): NormalizedGame {
  const firstPosition: NormalizedFirstPosition = {
    index: 0,
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    variationsIndexes: [],
  }
  const game: NormalizedGame = {
    id: "",
    headers: {},
    positions: {
      0: firstPosition
    }
  }
  return game
}

export const NormalizedGameHelper = {
  getFirsPosition(g: NormalizedGame): NormalizedFirstPosition {
    return g.positions[0]
  },
  getNextPos(g: NormalizedGame, currentIndex: number): NormalizedPosition | undefined {
    const nextI = g.positions[currentIndex]?.variationsIndexes[0]
    if (nextI !== undefined) {
      return g.positions[nextI] as NormalizedPosition
    } else {
      return undefined
    }
  },
  getPreviousPos(g: NormalizedGame, currentIndex: number): NormalizedPosition | NormalizedFirstPosition | undefined {
    if (currentIndex === 0) {
      return undefined
    }
    const previousI = (g.positions[currentIndex] as NormalizedPosition)?.parent;
    if (previousI !== undefined) {
      return g.positions[previousI]
    } else {
      return undefined
    }
  },
  getPositionOfMainLine(game: NormalizedGame, start: NormalizedPosition): NormalizedPosition[] {
    const result: NormalizedPosition[] = []
    let current: NormalizedPosition | undefined = start
    while (current) {
      if (current.index !== 0) {
        result.push(current)
      }
      current = this.getNextPos(game, current.index)
    }
    return result
  },
  isMainline(game: NormalizedGame, position: NormalizedPosition | NormalizedFirstPosition): boolean {
    return findParentVariation(game, position) === undefined
  },
  getPosAt(game: NormalizedGame, i: number): NormalizedPosition | NormalizedFirstPosition | undefined {
    return game.positions[i]
  }
}

export const NormalizedGameMutator = {
  deleteFromPosition(game: NormalizedGame, pos: NormalizedPosition): NormalizedGame  {
    const parent = NormalizedGameHelper.getPreviousPos(game, pos.index)
    function indexesToDelete(pos: NormalizedPosition): number[] {
      if (pos.variationsIndexes.length === 0) {
        return [pos.index]
      }
      let indexes = [pos.index]
      for (let i of pos.variationsIndexes) {
        const child = NormalizedGameHelper.getPosAt(game, i);
        if (child && child.index > 0) {
          indexes = indexes.concat(indexesToDelete(child as NormalizedPosition))
        }
      }
      return indexes
    }
    const toDelete = indexesToDelete(pos)
    const newPositions = {...game.positions}
    for (let i of toDelete) {
      delete newPositions[i]
    }
    if (parent) {
      newPositions[parent.index].variationsIndexes = newPositions[parent.index].variationsIndexes.filter(i => i !== pos.index)
    }

    return {
      ...game,
      positions: newPositions
    }
  },

  promoteVariation(game: NormalizedGame, pos: NormalizedPosition): {hasChanged: false} | {hasChanged: true, game: NormalizedGame} {
    let parentVariationWrapper = findParentVariation(game, pos);
    if (parentVariationWrapper === undefined) {
      return {hasChanged: false}
    }
    const {variationParent, firstVariationPos} = parentVariationWrapper;
    const newParent = {
      ...variationParent,
    }
    newParent.variationsIndexes = newParent.variationsIndexes.filter(i => i !== firstVariationPos.index)
    newParent.variationsIndexes.unshift(firstVariationPos.index)
    return {
      hasChanged: true,
      game: updatePosAtIndex(game, newParent, newParent.index)
    }
  },
  makeMainLine(game: NormalizedGame, position: NormalizedPosition): {hasChanged: false} | {hasChanged: true, game: NormalizedGame} {
    let i = 0;
    while (!NormalizedGameHelper.isMainline(game, position)) {
      const r = this.promoteVariation(game, position)
      if (r.hasChanged) {
        game = r.game
      }
      i++;
    }
    if (i > 0) {
      return {hasChanged: true, game: game}
    } else {
      return {hasChanged: false}
    }
  },
  deleteVariation(game: NormalizedGame, position: NormalizedPosition): {hasChanged: false} | {hasChanged: true, game: NormalizedGame, variationParent: NormalizedPosition | NormalizedFirstPosition} {
    const variationWrapper = findParentVariation(game, position)
    if (variationWrapper === undefined) {
      return {hasChanged: false}
    }
    const {variationParent, firstVariationPos} = variationWrapper;
    const g = this.deleteFromPosition(game, firstVariationPos);
    return {hasChanged: true, game: g, variationParent};
  },
  handleMove(game: NormalizedGame, pos: NormalizedFirstPosition, from: Square, to: Square, san: string, fen: string): {hasChanged: false, posToGo: NormalizedPosition | NormalizedFirstPosition} | {hasChanged: true, game: NormalizedGame, posToGo: NormalizedPosition | NormalizedFirstPosition} {
    const find = pos.variationsIndexes.map(i => NormalizedGameHelper.getPosAt(game, i)).find(p => p?.fen === fen)
    if (find) {
      return {hasChanged: false, posToGo: find}
    } else {
      let maxIndex = 0;
      for (let i in game.positions) {
        if (parseInt(i) > maxIndex) {
          maxIndex = parseInt(i)
        }
      }
      const p: NormalizedPosition = {
        index: maxIndex + 1,
        fen,
        move: {from, to},
        variationsIndexes: [],
        san,
        comment: '',
        parent: pos.index,
        commentBefore: '',
        nags: []
      }
      pos.variationsIndexes.push(p.index);
      const g = updatePosAtIndex(game, pos, pos.index);
      g.positions[p.index] = p
      return {posToGo: p, hasChanged: true, game: g}
    }
  },
  setCommentAfter(game: NormalizedGame, pos: NormalizedPosition, comment: string): NormalizedGame {
    const newPos = {
      ...pos,
      comment
    }
    return updatePosAtIndex(game, newPos, newPos.index)
  },
  setCommentBefore(game: NormalizedGame, pos: NormalizedPosition, comment: string): NormalizedGame {
    const newPos = {
      ...pos,
      commentBefore: comment
    }
    return updatePosAtIndex(game, newPos, newPos.index)
  }
}

const updatePosAtIndex = (game: NormalizedGame, pos: NormalizedPosition | NormalizedFirstPosition, index: number): NormalizedGame => {
  const newPositions = {...game.positions}
  newPositions[index] = pos
  return {
    ...game,
    positions: newPositions
  }
}

const findParentVariation = (game: NormalizedGame, pos: NormalizedPosition | NormalizedFirstPosition): {variationParent: NormalizedPosition | NormalizedFirstPosition, firstVariationPos: NormalizedPosition } | undefined => {
  let p: NormalizedPosition | NormalizedFirstPosition | undefined = pos;
  while(p) {
    const parent = NormalizedGameHelper.getPreviousPos(game, p.index);
    if (!parent) {
      return undefined;
    }
    if (parent.variationsIndexes[0] !== p.index) {
      return {
        variationParent: parent,
        firstVariationPos: p as NormalizedPosition
      }
    }
    p = parent
  }
  return undefined;
}
