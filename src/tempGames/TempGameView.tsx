import React, {useEffect, useState} from 'react';
import {NotationPanel} from "../shared-components/notation-panel/NotationPanel";
import {ChessBoardWithRules} from "../shared-components/chessboard/ChessboardWithRules";
import {Game, Position, Square} from "../libraries/chess";
import {FirstPosition, gameToString} from "../libraries/chess/Game";
import {RouteComponentProps} from "react-router-dom";
import TempGamesService, {TemporaryGame} from "../@core/TempGamesService";
import SaveGameModal from "../shared-components/SaveGameModal";
import useModal from "../shared-components/UseModal";
import {toast} from "react-toastify";
import {GameController} from "../libraries/chess/GameController";


interface TempGameViewProps extends RouteComponentProps<{id: string, dbId?: string}> {

}

const TempGameView: React.FunctionComponent<TempGameViewProps> = (props) => {
  const [currentGame, setCurrentGame] = useState<TemporaryGame>();
  const [currentPos, setCurrentPos] = useState<FirstPosition>();
  const [isSaveGameModalOpen, toggleSaveGameModalOpen] = useModal()

  useEffect(() => {
    (async () => {
      const gameId = props.match.params.id;
      let temporaryGame;
      try {
        if (!props.match.params.dbId) {
          temporaryGame = TempGamesService.getTemporaryGame(parseInt(gameId));
        } else {
          temporaryGame = await TempGamesService.getTempGameFromDatabase(gameId, props.match.params.dbId)
        }
      } catch (err: unknown) {
        console.error(err)
        toast.error('Error while opening game')
        return
      }
      setCurrentGame(temporaryGame)
      let pos = temporaryGame?.game.firstPosition
      while (pos?.variations[0]) {
        pos = pos?.variations[0]
      }
      setCurrentPos(pos)
    })()
  }, [])

  function onMove(from: Square, to: Square, san: string, fen: string) {
    if (currentPos && currentGame) {
      const {gameHasChanged, posToGo} = GameController.handleMove(currentGame.game, currentPos, from, to, san, fen);
      setCurrentPos(posToGo)
      if (gameHasChanged) {
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
    if (currentGame) {
      const pos = GameController.getPosition(currentGame.game, position)
      if (pos) {
        setCurrentPos(pos)
      }
    }
  }
  return (
    <div style={{"display": "flex"}}>
      {currentPos && currentGame ?
        <>
          <SaveGameModal isOpen={isSaveGameModalOpen} hide={toggleSaveGameModalOpen} game={currentGame}/>
          <ChessBoardWithRules fen={currentPos.fen} onMove={onMove}/>
          <div style={{marginLeft: "5em"}}>
            <div className="card" style={{backgroundColor: "white", width: "300px", height: "100%"}}>
              <div style={{ borderBottom:"1px solid #dbdbdb", display: "flex", justifyContent: "space-between"}}>
                <p className="title is-5" style={{padding: "7px 0 7px 7px", margin: 0}}>{gameToString(currentGame.game) || "New Game"}</p>
                <button className="button is-success" style={{height: '100%', borderRadius: '0 0.25rem  0 0'}} onClick={toggleSaveGameModalOpen}>
                  <span className="icon is-small">
                    <i className="fas fa-save"/>
                  </span>
                </button>
              </div>
              <div style={{padding: "7px 3px 7px 7px"}}>
                <NotationPanel game={currentGame.game} currentPositionIndex={currentPos.index} onPosClick={goToPosition}/>
              </div>
            </div>
            <div className="field has-addons" style={{paddingTop: "0.75em", justifyContent: "center"}}>
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
          </div>
          {/*<div style={{backgroundColor: "white", width: "300px", marginLeft: "5em"}}>*/}

          {/*</div>*/}
        </>
        : <div>404</div>
      }
    </div>
  )
}

export default TempGameView;
