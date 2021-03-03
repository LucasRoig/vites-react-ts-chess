import React, {useState} from "react";
import {ChessBoardWithRules} from "./ChessboardWithRules";
import {Square} from "../../libraries/chess";

export interface GameboardProps {

}

const Gameboard: React.FC<GameboardProps> = () => {
  let [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  let onMove = (from: Square, to: Square, san: string, fen: string): void => {
    setFen(fen)
  }
  return <ChessBoardWithRules fen={fen} onMove={onMove}/>
}

export {
  Gameboard
}
