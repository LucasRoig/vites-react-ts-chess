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
  }
}