import {Color, PieceAndSquare, PieceRole} from "./index";

export function fenToFullMoves(fen: string): number {
  return parseInt(fen.split(" ")[5])
}

export function fenToColorToPlay(fen: string): Color {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

export function fenToLastMoveColor(fen: string): Color {
  return fenToColorToPlay(fen) === "black" ? "white" : "black";
}

export function readFen(fen: string): PieceAndSquare[] {
  function isCharInt(str: string): boolean {
    return /[1-9]/.test(str)
  }
  function isLowerCase(str: string): boolean {
    return str.toLocaleLowerCase() === str
  }
  const result: PieceAndSquare[] = [];
  let index = 0;
  let char = fen.charAt(0);
  fen = fen.substring(1)
  while (index <= 63 && char) {
    if (isCharInt(char)) {
      index += parseInt(char)
    }
    let pieceRole: PieceRole | null  = null
    switch (char.toLocaleLowerCase()) {
      case 'k':
        pieceRole = 'king'
        break;
      case 'q':
        pieceRole = 'queen'
        break
      case 'r':
        pieceRole = 'rook'
        break
      case 'b':
        pieceRole = 'bishop'
        break
      case 'n':
        pieceRole = 'knight'
        break
      case 'p':
        pieceRole = 'pawn'
        break
    }
    if (pieceRole) {
      result.push({
        piece: {
          role: pieceRole,
          color: isLowerCase(char) ? 'black' : 'white'
        },
        square: index
      })
      index++
    }
    char = fen.charAt(0)
    fen = fen.substring(1)
  }
  return result
}
