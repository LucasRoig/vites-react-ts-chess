import React from "react";
import {Game, Position} from "../../libraries/chess";
import {FirstPosition} from "../../libraries/chess/Game";

export interface NotationPanelProps {
  game: Game
}

const NotationPanel: React.FC<NotationPanelProps> = ({game}) => {
  let line: Position[] = []
  if (game.firstPosition?.variations?.length) {
    line = flattenMoves(game.firstPosition.variations[0])
  }
  return (
    <div>
      {line.map(m => <span>{m.san}</span>)}
    </div>
  )
}

function flattenMoves(position: Position) : (Position)[]{
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
