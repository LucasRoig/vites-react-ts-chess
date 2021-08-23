import React, {ReactElement} from "react";
import "./NotationPanel.scss"
import {fenToFullMoves, fenToLastMoveColor} from "../../libraries/chess/FenUtils";
import {useMoveContextMenu} from "../../tempGames/MoveContextMenu";
import {NormalizedGame, NormalizedGameHelper, NormalizedPosition} from "../../libraries/chess/NormalizedGame";

type PositionClickedHandler = (pos: NormalizedPosition) => void

export interface NotationPanelProps {
  game: NormalizedGame,
  currentPositionIndex: number
  onPosClick: PositionClickedHandler
}

const NotationPanel: React.FC<NotationPanelProps> = ({game, currentPositionIndex, onPosClick}) => {
  let line: NormalizedPosition[] = []

  const firstPos = NormalizedGameHelper.getFirsPosition(game);
  const firstMainMove = NormalizedGameHelper.getNextPos(game, firstPos.index)
  if (firstMainMove) {
    line = NormalizedGameHelper.getPositionOfMainLine(game, firstMainMove)
  }
  return (
    <div style={{width: "100%", height: "100%", display: "flex", flexWrap: "wrap", alignContent: "flex-start"}}>
      {game.comment && <div className="comment">{game.comment}</div>}
      {line.map(p => <MainLineMove key={p.index} position={p} currentPositionIndex={currentPositionIndex}
                                   onPosClick={onPosClick} game={game}/>)}
    </div>
  )
}

const MainLineMove: React.FC<{ position: NormalizedPosition, currentPositionIndex: number, onPosClick: PositionClickedHandler, game: NormalizedGame }> =
  ({position, currentPositionIndex, onPosClick, game}) => {
    const contextMenu = useMoveContextMenu()
    function onClick() {
      onPosClick(position)
    }

    return (
      <>
        {processCommentBefore(position)}
        <span onClick={onClick} onContextMenu={(e) => contextMenu.handleContextMenu(e, position)}
              className={`mainline-move ${position.index === currentPositionIndex ? "active" : ""}`}>{positionToUci(position, game)}</span>
        {processCommentAfter(position)}
        {processVariations(position, 0, currentPositionIndex, onPosClick, game)}
      </>
    )
  }

interface VariationProps {
  position: NormalizedPosition
  depth: number
  open: boolean
  close: boolean
  currentPositionIndex: number
  onPosClick: PositionClickedHandler
  game: NormalizedGame
}

const Variation: React.FC<VariationProps> = ({game, position, depth, open, close, currentPositionIndex, onPosClick}) => {
  const positions = NormalizedGameHelper.getPositionOfMainLine(game, position)
  const hasSubvariations = positions.some(p => p.variationsIndexes.length > 1)
  let block;
  if (depth === 1) {
    block = <div className="variation-d-1">
      {open && <span style={{whiteSpace: "nowrap"}}>[ </span>}
      <span>
            {positions.map(p => <VariationMove position={p} depth={depth} game={game}
                                               currentPositionIndex={currentPositionIndex} onPosClick={onPosClick}/>)}
          </span>
      {close ? <span> ]</span> : <span>; </span>}
    </div>
  } else if (hasSubvariations) {
    block = <div className="variation-d-1">
      {open && <span style={{whiteSpace: "nowrap"}}>( </span>}
      <span>
            {positions.map(p => <VariationMove position={p} depth={depth} game={game}
                                               currentPositionIndex={currentPositionIndex} onPosClick={onPosClick}/>)}
          </span>
      {close ? <span > )</span> : <span>; </span>}
    </div>
  } else {
    block = <span className="variation-d-2">
        {open && <span style={{whiteSpace: "nowrap"}}>(</span>}
      <span>
            {positions.map(p => <VariationMove position={p} depth={depth} game={game}
                                               currentPositionIndex={currentPositionIndex} onPosClick={onPosClick}/>)}
          </span>
          <span style={{whiteSpace: "nowrap"}}>{close ? ') ' : '; '}</span>
      </span>
  }
  return (
    <>{block}</>
  )
}

const VariationMove: React.FC<{ position: NormalizedPosition, depth: number, currentPositionIndex: number, onPosClick: PositionClickedHandler, game: NormalizedGame }> =
  ({position, depth, currentPositionIndex, onPosClick, game}) => {
    const contextMenu = useMoveContextMenu()
    function onClick() {
      onPosClick(position)
    }

    return (
      <>
        {processCommentBefore(position)}
        <span onClick={onClick} onContextMenu={(e) => contextMenu.handleContextMenu(e, position)}
              className={`variation-move ${position.index === currentPositionIndex ? "active" : ""}`}>{positionToUci(position, game)}</span>
        {processCommentAfter(position)}
        {/*Only process a variation if position is the main move of the parent*/}
        {NormalizedGameHelper.getPreviousPos(game, position.index)?.variationsIndexes[0] === position.index && processVariations(position, depth, currentPositionIndex, onPosClick, game)}
      </>
    )
  }

function processVariations(position: NormalizedPosition, currentDepth = 0, currentPositionIndex: number, onPosClick: PositionClickedHandler, game: NormalizedGame): ReactElement<any, any> | null {
  const parent = NormalizedGameHelper.getPreviousPos(game, position.index)
  if (parent && parent.variationsIndexes.length > 1) {
    return (<>
        {parent.variationsIndexes.slice(1).map(i => NormalizedGameHelper.getPosAt(game, i))
          .map((p, i, tab) => {
            if (p && p.index !==0) {
              return (
                <Variation position={p as NormalizedPosition} depth={currentDepth + 1} open={i === 0} close={i === tab.length - 1}
                           currentPositionIndex={currentPositionIndex} onPosClick={onPosClick} game={game}/>
              )
            }
          })}
      </>
    )
  }
  return null
}

function processCommentBefore(position: NormalizedPosition): ReactElement<any, any> | null {
  if (position.commentBefore) {
    return <span className="comment">{position.commentBefore}</span>
  }
  return null
}

function processCommentAfter(position: NormalizedPosition): ReactElement<any, any> | null {
  if (position.comment) {
    return <span className="comment">{position.comment}</span>
  }
  return null
}

function positionToUci(position: NormalizedPosition, game: NormalizedGame): string {
  let uci = position.san
  let forceMoveNumber = false;
  const parent = NormalizedGameHelper.getPreviousPos(game, position.index)
  //force if first move of variation
  if (parent?.variationsIndexes[0] !== position.index) {
    forceMoveNumber = true
  }
  //force if first move after variation
  if (parent) {
    //Check that grandparent has variations and that position is in the mainline from grandparent
    const grandparent = NormalizedGameHelper.getPreviousPos(game, parent.index)
    if (grandparent && grandparent.variationsIndexes.length > 1 && parent.index === grandparent.variationsIndexes[0] && parent.variationsIndexes[0] === position.index) {
      forceMoveNumber = true
    }
  }
  //force if first move after comment
  if ((parent?.comment && parent?.comment.length > 0) || (position.commentBefore && position.commentBefore.length > 0)) {
    forceMoveNumber = true;
  }
  let lastMoveColor = fenToLastMoveColor(position.fen);
  if (lastMoveColor === "white" || forceMoveNumber) {
    let separator = lastMoveColor === "white" ? "." : "..."
    let fullMoves = fenToFullMoves(position.fen)
    if (lastMoveColor === "black") {
      fullMoves--
    }
    uci = fullMoves + separator + uci
  }
  return uci
}

export {
  NotationPanel
}
