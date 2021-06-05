import React, {useEffect, useState} from 'react';
import {NotationPanel} from "../shared-components/notation-panel/NotationPanel";
import {ChessBoardWithRules} from "../shared-components/chessboard/ChessboardWithRules";
import {Position, Square} from "../libraries/chess";
import {FirstPosition} from "../libraries/chess/Game";
import {RouteComponentProps} from "react-router-dom";
import TempGamesService, {TemporaryGame} from "../@core/TempGamesService";


interface TempGameViewProps extends RouteComponentProps<{id: string}> {

}

const TempGameView: React.FunctionComponent<TempGameViewProps> = (props) => {
  const [currentGame, setCurrentGame] = useState<TemporaryGame>();
  const [currentPos, setCurrentPos] = useState<FirstPosition>();

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
      const pos: Position = {
        index: currentPos.index + 1,
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

  return (
    <div style={{"display": "flex"}}>
      {currentPos && currentGame ?
        <>
          <ChessBoardWithRules fen={currentPos.fen} onMove={onMove}/>
          <div style={{backgroundColor: "white", width: "300px", marginLeft: "5em"}}>
            <NotationPanel game={currentGame.game}/>
          </div>
        </>
        : <div>404</div>
      }

    </div>
  )
}

export default TempGameView;
