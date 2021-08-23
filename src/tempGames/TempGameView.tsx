import React, {useEffect, useState} from 'react';
import {NotationPanel} from "../shared-components/notation-panel/NotationPanel";
import {ChessBoardWithRules} from "../shared-components/chessboard/ChessboardWithRules";
import {Square} from "../libraries/chess";
import {gameToString} from "../libraries/chess/Game";
import {RouteComponentProps} from "react-router-dom";
import TempGamesService, {TemporaryGame} from "../@core/TempGamesService";
import SaveGameModal from "../shared-components/SaveGameModal";
import useModal from "../shared-components/UseModal";
import {toast} from "react-toastify";
import {MoveContextMenuProvider} from './MoveContextMenu';
import {
  NormalizedFirstPosition,
  NormalizedGameHelper,
  NormalizedGameMutator,
  NormalizedPosition
} from "../libraries/chess/NormalizedGame";




interface TempGameViewProps extends RouteComponentProps<{id: string, dbId?: string}> {

}

const ViewWrapper: React.FC<TempGameViewProps> = (props) => {
  return (

      <TempGameView {...props}/>
  )
}

const TempGameView: React.FunctionComponent<TempGameViewProps> = (props) => {
  const [currentGame, setCurrentGame] = useState<TemporaryGame>();
  const [currentPos, setCurrentPos] = useState<NormalizedFirstPosition>();
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
      let pos = undefined;
      if (temporaryGame?.game) {
        pos = NormalizedGameHelper.getFirsPosition(temporaryGame.game)
      }
      setCurrentPos(pos)
    })()
  }, [])

  function deleteFromPosition(p: NormalizedPosition) {
    if (currentGame) {
      const parent = NormalizedGameHelper.getPreviousPos(currentGame.game, p.index)
      const g = NormalizedGameMutator.deleteFromPosition(currentGame.game, p)
      setCurrentGame({...currentGame, game: g})
      setCurrentPos(parent)
      TempGamesService.updateTemporaryGame(currentGame)
    }
  }

  function promoteVariation(p: NormalizedPosition) {
    if (currentGame) {
      const result = NormalizedGameMutator.promoteVariation(currentGame.game, p);
      if (result.hasChanged) {
        setCurrentGame({...currentGame, game: result.game})
        TempGamesService.updateTemporaryGame(currentGame)
      }
    }
  }

  function makeMainLine(p: NormalizedPosition) {
    if (currentGame) {
      const result = NormalizedGameMutator.makeMainLine(currentGame.game, p);
      if (result.hasChanged) {
        setCurrentGame({...currentGame, game: result.game})
        TempGamesService.updateTemporaryGame(currentGame)
      }
    }
  }

  function deleteVariation(p: NormalizedPosition) {
    if (currentGame) {
      const result = NormalizedGameMutator.deleteVariation(currentGame.game, p);
      if (result.hasChanged) {
        setCurrentGame({...currentGame, game: result.game})
        setCurrentPos(result.variationParent)
        TempGamesService.updateTemporaryGame(currentGame)
      }
    }
  }

  function onMove(from: Square, to: Square, san: string, fen: string) {
    if (currentPos && currentGame) {
      const r = NormalizedGameMutator.handleMove(currentGame.game, currentPos, from, to, san, fen);
      setCurrentPos(r.posToGo)
      if (r.hasChanged) {
        setCurrentGame({...currentGame, game: r.game})
        TempGamesService.updateTemporaryGame(currentGame)
      }
    }
  }

  function nextMove() {
    if (currentPos && currentGame && currentPos.variationsIndexes.length > 0) {
      const nextPos = NormalizedGameHelper.getNextPos(currentGame.game, currentPos.index);
      if (nextPos) {
        setCurrentPos(nextPos)
      }
    }
  }

  function previousMove() {
    if (currentPos && currentGame) {
      const previousPos = NormalizedGameHelper.getPreviousPos(currentGame.game, currentPos.index)
      if (previousPos) {
        setCurrentPos(previousPos)
      }
    }
  }

  function setCommentAfter(p: NormalizedPosition, comment: string) {
    if (currentGame) {
      const game= NormalizedGameMutator.setCommentAfter(currentGame.game, p, comment)
      setCurrentGame({...currentGame, game})
      TempGamesService.updateTemporaryGame(currentGame)
    }
  }

  function setCommentBefore(p: NormalizedPosition, comment: string) {
    if (currentGame) {
      const game= NormalizedGameMutator.setCommentBefore(currentGame.game, p, comment)
      setCurrentGame({...currentGame, game})
      TempGamesService.updateTemporaryGame(currentGame)
    }
  }

  function goToPosition(position: NormalizedPosition) {
    setCurrentPos(position)
  }

  return (
      <div style={{"display": "flex"}} >
        {currentPos && currentGame ?
          <>
            <SaveGameModal isOpen={isSaveGameModalOpen} hide={toggleSaveGameModalOpen} game={currentGame}/>
            <ChessBoardWithRules fen={currentPos.fen} onMove={onMove}/>
            <div style={{marginLeft: "5em"}} >
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
                  <MoveContextMenuProvider deleteFromPosition={deleteFromPosition} makeMainLine={makeMainLine}
                                           promoteVariation={promoteVariation} game={currentGame.game}
                                           setCommentBefore={setCommentBefore}
                                           deleteVariation={deleteVariation} setCommentAfter={setCommentAfter}>
                    <NotationPanel game={currentGame.game} currentPositionIndex={currentPos.index} onPosClick={goToPosition}/>
                  </MoveContextMenuProvider>
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
                <p className="control" >
                  <button className="button" onClick={nextMove}>
                      <span className="icon">
                        <i className="fas fa-arrow-right"/>
                      </span>
                  </button>
                </p>
              </div>
            </div>
          </>
          : <div>404</div>
        }
      </div>
  )
}

export default ViewWrapper;
