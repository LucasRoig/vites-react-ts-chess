import React from "react";
import Chessground, {Dests} from "react-chessground"
import 'react-chessground/dist/styles/chessground.css'
import {Move, Square} from "../../libraries/chess";
import {groupByAndMap} from "../../libraries/Utils";

export interface ChessBoardProps {
  fen: string
  onMove?: (from: Square, to: Square) => void
  legalMoves?: Move[]
}



const ChessBoard: React.FunctionComponent<ChessBoardProps> = ({fen, onMove, legalMoves = []}) => {
  return <Chessground fen={fen}
                      movable={{free:false, dests:  legalMovesToDestMap(legalMoves), events: {after: onMove}}}
                      premovable={{enabled: false}}
                      predroppable={{enabled: false}}
                      events={{move: onMove}}/>
}

function legalMovesToDestMap(legalMoves: Move[]): Dests {
  return groupByAndMap(legalMoves, m => m.from, m => m.to)
}

export {
  ChessBoard
}
