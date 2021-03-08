import React from "react";
import {ChessBoard} from "./Chessboard";
import {Move, Square} from "../../libraries/chess";
import * as ChessJS from "chess.js"

export interface  ChessBoardWithRulesProps {
  fen: string,
  onMove?: (from: Square, to: Square, san: string, fen: string) => void
}

const ChessBoardWithRules: React.FC<ChessBoardWithRulesProps> = ({fen, onMove}) => {
  const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess
  const chess = Chess(fen);
  const legalMoves: Move[] = chess.moves({ verbose: true}).map(m => ({from: m.from, to: m.to}))
  const onMoveDecorated = onMove ? (from: Square, to: Square) => {
    //TODO autopromote to queen is bad
    const move = chess.move({from, to, promotion: "q"})
    if (move) {
      onMove(from, to, move.san, chess.fen())
    }
  }: () => {}
  return <ChessBoard fen={fen} legalMoves={legalMoves} onMove={onMoveDecorated}/>
}

export {
  ChessBoardWithRules
}

