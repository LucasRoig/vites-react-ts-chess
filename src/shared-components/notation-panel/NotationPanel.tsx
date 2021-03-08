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
      {line.map(p => <>
          {processCommentBefore(p)}
          <span className="mainline-move">{positionToUci(p)}</span>
          {processCommentAfter(p)}
          {processVariations(p)}
        </>
      )}
    </div>
  )
}

interface VariationProps {
  position: Position
  depth: number
}

const Variation: React.FC<VariationProps> = ({position}) => {
  const positions = flattenMoves(position)
  return (
    <>
      {positions.map(p =><span>{positionToUci(p)}</span> )}
    </>
  )
};

function processVariations(position: Position): ReactElement<any, any> | null {
  if (position.variations?.length > 1) {
    return (<>
        {position.variations.slice(1).map(p => <><br/><Variation position={p} depth={1} /><br/></>)}
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
  if (position.parent?.variations[0] !== position) {
    forceMoveNumber = true
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
