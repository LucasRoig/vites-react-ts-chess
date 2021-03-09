import React, {ReactElement} from "react";
import {Game, Position} from "../../libraries/chess";
import "./NotationPanel.scss"
import {fenToFullMoves, fenToLastMoveColor} from "../../libraries/chess/FenUtils";
import {NonCircularGame, nonCircularGameToGame} from "../../libraries/chess/Game";

export interface NotationPanelProps {
  game: Game | NonCircularGame
}

const NotationPanel: React.FC<NotationPanelProps> = ({game}) => {
  let line: Position[] = []
  if (!(game as Game).firstPosition?.variations?.[0]?.parent) {
    game = nonCircularGameToGame(game)
  }
  if (game.firstPosition?.variations?.length) {
    line = flattenMoves((game as Game).firstPosition.variations[0])
  }
  return (
    <div>
      {game.comment && <div className="comment">{game.comment}</div>}
      {line.map(p => <MainLineMove key={p.index} position={p}/>)}
    </div>
  )
}

const MainLineMove: React.FC<{position: Position}> = ({position}) => {
  return (
    <>
      {processCommentBefore(position)}
      <span className="mainline-move">{positionToUci(position)}</span>
      {processCommentAfter(position)}
      {processVariations(position)}
    </>
  )
}

interface VariationProps {
  position: Position
  depth: number
}

const Variation: React.FC<VariationProps> = ({position, depth}) => {
  const positions = flattenMoves(position)
  return (
    <>
      {depth === 1 && <div className="variation-d-1">
        <span>[ </span>
        {positions.map(p =><VariationMove position={p} depth={depth}/>)}
        <span> ]</span>
      </div>}
    </>
  )
};

const VariationMove: React.FC<{position: Position, depth: number}> = ({position, depth}) => {
  return (
    <>
      {processCommentBefore(position)}
      <span>{positionToUci(position)}</span>
      {processCommentAfter(position)}
    </>
  )
}

function processVariations(position: Position, currentDepth = 0): ReactElement<any, any> | null {
  if (position.parent?.variations?.length > 1) {
    return (<>
        {position.parent.variations.slice(1).map(p => <Variation position={p} depth={currentDepth + 1} />)}
    </>
    )
  }
  return null
}

function processCommentBefore(position: Position): ReactElement<any, any> | null {
  if (position.commentBefore) {
    return <span className="comment">{position.commentBefore}</span>
  }
  return null
}

function processCommentAfter(position: Position): ReactElement<any, any> | null {
  if (position.comment) {
    return <span className="comment">{position.comment}</span>
  }
  return null
}

function positionToUci(position: Position): string {
  let uci = position.san
  let forceMoveNumber = false;
  //force if first move of variation
  if (position.parent?.variations[0] !== position) {
    forceMoveNumber = true
  }
  //force if first move after variation
  if (position.parent?.variations?.length > 1) {
    forceMoveNumber = true;
  }
  //force if first move after comment
  if ((position.parent?.comment && position.parent?.comment.length > 0) || (position.commentBefore && position.commentBefore.length > 0)) {
    forceMoveNumber = true;
  }
  let lastMoveColor = fenToLastMoveColor(position.fen);
  if (lastMoveColor === "white" || forceMoveNumber) {
    let separator = lastMoveColor === "white" ? "." : "..."
    uci = fenToFullMoves(position.fen) + separator + uci
  }
  return uci
}

function flattenMoves(position: Position): (Position)[] {
  const res = [position]
  while (position.variations?.length) {
    res.push(position.variations[0])
    position = position.variations[0]
  }
  return res
}

export {
  NotationPanel
}
