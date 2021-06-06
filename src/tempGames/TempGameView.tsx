import React, {useEffect, useState} from 'react';
import {NotationPanel} from "../shared-components/notation-panel/NotationPanel";
import {ChessBoardWithRules} from "../shared-components/chessboard/ChessboardWithRules";
import {Game, Position, Square} from "../libraries/chess";
import {FirstPosition} from "../libraries/chess/Game";
import {RouteComponentProps} from "react-router-dom";
import TempGamesService, {TemporaryGame} from "../@core/TempGamesService";
import SaveGameModal from "../shared-components/SaveGameModal";
import useModal from "../shared-components/UseModal";


interface TempGameViewProps extends RouteComponentProps<{id: string}> {

}

const TempGameView: React.FunctionComponent<TempGameViewProps> = (props) => {
  const [currentGame, setCurrentGame] = useState<TemporaryGame>();
  const [currentPos, setCurrentPos] = useState<FirstPosition>();
  const [isSaveGameModalOpen, toggleSaveGameModalOpen] = useModal()

  useEffect(() => {
    const gameId = parseInt(props.match.params.id);
    const temporaryGame = TempGamesService.getTemporaryGame(gameId);
    setCurrentGame(temporaryGame)
    let pos = temporaryGame?.game.firstPosition
    while (pos?.variations[0]) {
      pos = pos?.variations[0]
    }
    setCurrentPos(pos)
  }, [])

  function onMove(from: Square, to: Square, san: string, fen: string) {
    if (currentPos && currentGame) {
      const find = currentPos.variations.find(v => v.fen === fen);
      if (find) {
        setCurrentPos(find)
      } else {
        function maxIndex(p: FirstPosition): number {
          if (p.variations.length === 0) {
            return p.index
          } else {
            return Math.max(...p.variations.map(maxIndex), -1)
          }
        }
        const pos: Position = {
          index: maxIndex(currentGame.game.firstPosition) + 1,
          fen: fen,
          move: {from, to},
          variations: [],
          nags: [],
          san: san,
          comment: "",
          parent: currentPos,
          commentBefore: ""
        }

        currentPos.variations.push(pos)

        setCurrentPos(pos)
        TempGamesService.updateTemporaryGame(currentGame)
      }
    }
  }

  function nextMove() {
    if (currentPos && currentGame && currentPos.variations.length > 0) {
      setCurrentPos(currentPos.variations[0])
    }
  }

  function previousMove() {
    if (currentPos && currentGame && 'parent' in currentPos) {
      setCurrentPos((currentPos as Position).parent)
    }
  }

  function goToPosition(position: Position) {
    if (currentGame && currentPos) {
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
      if (currentGame.game.firstPosition.index === position.index) {
        pos = currentGame.game.firstPosition
      } else {
        for (let p2 of currentGame.game.firstPosition.variations) {
          let res = findPos(p2)
          if (res) {
            pos = res
            break
          }
        }
      }
      if (pos) {
        setCurrentPos(pos)
      }
    }
  }
  return (
    <div style={{"display": "flex"}}>
      {currentPos && currentGame ?
        <>
          <SaveGameModal isOpen={isSaveGameModalOpen} hide={toggleSaveGameModalOpen}/>
          <ChessBoardWithRules fen={currentPos.fen} onMove={onMove}/>
          <div style={{backgroundColor: "white", width: "300px", marginLeft: "5em"}}>
            <NotationPanel game={currentGame.game} currentPositionIndex={currentPos.index} onPosClick={goToPosition}/>
            <div className="field has-addons">
              <p className="control">
                <button className="button" onClick={previousMove}>
                  <span className="icon">
                    <i className="fas fa-arrow-left"/>
                  </span>
                </button>
              </p>
              <p className="control">
                <button className="button" onClick={nextMove}>
                  <span className="icon">
                    <i className="fas fa-arrow-right"/>
                  </span>
                </button>
              </p>
            </div>
            <button className="button" onClick={toggleSaveGameModalOpen}>Save</button>
          </div>
        </>
        : <div>404</div>
      }
    </div>
  )
}

export default TempGameView;
