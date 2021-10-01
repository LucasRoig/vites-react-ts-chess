import React, {useEffect, useState} from "react";
import './EditableBoard.scss'
import {
  Piece,
  PieceAndSquare,
  BlackKing,
  BlackQueen,
  BlackBishop,
  BlackRook,
  BlackKnight,
  BlackPawn, WhiteKing, WhiteQueen, WhiteRook, WhiteBishop, WhitePawn, WhiteKnight, Color
} from "../../libraries/chess";
import {readFen} from "../../libraries/chess/FenUtils";

export interface EditableBoardProps{
  fen: string
}

const DeleteTool = "delete"
type Tools = typeof BlackKing |typeof BlackQueen | typeof BlackBishop | typeof BlackRook | typeof BlackKnight | typeof BlackPawn
 | typeof WhiteKing | typeof WhiteQueen | typeof WhiteRook | typeof WhiteBishop | typeof WhitePawn | typeof WhiteKnight
 |typeof DeleteTool
const AllPieces: Piece[] = [
  BlackKing, BlackQueen, BlackBishop, BlackRook, BlackKnight, BlackPawn,
  WhiteKing, WhiteQueen, WhiteRook, WhiteBishop, WhitePawn, WhiteKnight,
]

const EditableBoard: React.FC<EditableBoardProps> = ({fen}) => {
  const rows = [1,2,3,4,5,6,7,8]
  const cols = [1,2,3,4,5,6,7,8]
  const [pieces, setPieces] = useState<PieceAndSquare[]>([{piece: {color: 'white', role: 'king'}, square:63}])
  const [selectedTool, setSelectedTool] = useState<Tools | undefined>()
  useEffect(() => {
    setPieces(readFen(fen))
  }, [fen])

  const handleToolClicked = (tool: Tools): void => {
    if (selectedTool === tool) {
      setSelectedTool(undefined)
    } else {
      setSelectedTool(tool)
    }
  }

  const handleSquareClicked = (square: number): void => {
    if (selectedTool === null || selectedTool === undefined) {
      return
    }
    if (selectedTool === DeleteTool) {
      setPieces(pieces.filter(p => p.square !== square))
      return;
    }
    let piece = selectedTool;
    if (piece) {
      const i = pieces.findIndex(p => p.square === square);
      if (pieces[i] && pieces[i].piece.role === piece.role && pieces[i].piece.color === piece.color) {
        setPieces([...pieces.slice(0,i), ...pieces.splice(i+1)])
      } else if (pieces[i]) {
        setPieces([...pieces.slice(0,i), {square, piece}, ...pieces.splice(i+1)])
      } else {
        setPieces([...pieces, {square, piece}])
      }
    }
  }

  return (
    <div>
      <ToolBar color={"black"} selectedTool={selectedTool} onToolSelected={setSelectedTool}/>
      <div className="editable-board">
        {rows.map(row => cols.map(col => (
          <div className={`square ${(col + row) % 2 === 0 ? 'even' : 'odd'}`} style={{gridRow: row, gridColumn: col}} onClick={handleSquareClicked.bind(null, ((row - 1) * 8) + (col - 1))}/>
        )))}
        {pieces.map(p => <div className={`${p.piece.role} ${p.piece.color}`}
                              style={{gridRow: Math.floor(p.square / 8) + 1, gridColumn: (p.square % 8) + 1}}
                              onClick={handleSquareClicked.bind(null, p.square)}
        />)}
      </div>
      <ToolBar color={"white"} selectedTool={selectedTool} onToolSelected={handleToolClicked}/>
    </div>
  )
}

const ToolBar: React.FC<{color: Color, selectedTool: Tools | undefined, onToolSelected: (t: Tools) => void}> = (props) => {
  return (
    <div className="buttons has-addons">
      <button className={`button ${props.selectedTool === DeleteTool ? 'is-success' : ''}`} onClick={props.onToolSelected.bind(null, DeleteTool)}>
        <i className="fas fa-trash-alt tool-icon"/>
      </button>
      {AllPieces.filter(p => p.color === props.color).map(tool => (
        <button className={`button ${props.selectedTool === tool ? 'is-success' : ''}`} onClick={props.onToolSelected.bind(null, tool)}>
          <i className={`tool-icon ${tool.role} ${tool.color}`}/>
        </button>
      ))}
    </div>
  )
}

export {
  EditableBoard
}
