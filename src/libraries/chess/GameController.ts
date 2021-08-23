import {FirstPosition, Game, Position} from "./Game";
import {Square} from "./index";

export const GameController = {
  getPosition(game: Game, position: Position): Position | FirstPosition | undefined {
    function findPos(p: Position): Position | undefined {
      if (p.index === position.index) {
        return p
      } else {
        for (let p2 of p.variations) {
          let res = findPos(p2)
          if (res) {
            return res
          }
        }
      }
      return undefined
    }

    let pos: FirstPosition | undefined = undefined
    if (game.firstPosition.index === position.index) {
      pos = game.firstPosition
    } else {
      for (let p2 of game.firstPosition.variations) {
        let res = findPos(p2)
        if (res) {
          pos = res
          break
        }
      }
    }
    if (pos) {
      return pos
    }
  },

  handleMove(game: Game, currentPosition: FirstPosition, from: Square, to: Square, san: string, fen: string): {posToGo: Position, gameHasChanged: boolean} {
    const find = currentPosition.variations.find(v => v.fen === fen);
    if (find) {
      return {posToGo: find, gameHasChanged: false}
    } else {
      function maxIndex(p: FirstPosition): number {
        if (p.variations.length === 0) {
          return p.index
        } else {
          return Math.max(...p.variations.map(maxIndex), -1)
        }
      }
      const pos: Position = {
        index: maxIndex(game.firstPosition) + 1,
        fen: fen,
        move: {from, to},
        variations: [],
        nags: [],
        san: san,
        comment: "",
        parent: currentPosition,
        commentBefore: ""
      }

      currentPosition.variations.push(pos)

      return {posToGo: pos, gameHasChanged: true}
    }
  },

  isMainline(position: Position) {
    return findParentVariation(position) === undefined
  },

  promoteVariation(position: Position): {gameHasChanged: boolean} {
    let parentVariationWrapper = findParentVariation(position)
    if (parentVariationWrapper === undefined) {
      return {gameHasChanged: false}
    }
    const {variationParent, firstVariationPos} = parentVariationWrapper;
    variationParent.variations = variationParent.variations.filter(p => p.index !== firstVariationPos.index)
    variationParent.variations.unshift(firstVariationPos)
    return {
      gameHasChanged: true
    }
  },

  makeMainLine(position: Position): {gameHasChanged: boolean} {
    let i = 0;
    while (findParentVariation(position) !== undefined) {
      this.promoteVariation(position)
      i++;
    }
    return {
      gameHasChanged: i > 0
    }
  }
}

const findParentVariation = (position: Position): {variationParent: Position | FirstPosition, firstVariationPos: Position } | undefined => {
  let p: Position | FirstPosition = position;
  while((p as Position).parent) {
    const parent = (p as Position).parent
    if (parent.variations[0].index !== p.index) {
      return {
        variationParent: parent,
        firstVariationPos: p as Position
      }
    }
    p = parent
  }
  return undefined
}
