import {Color} from "./index";

export function fenToFullMoves(fen: string): number {
  return parseInt(fen.split(" ")[5])
}

export function fenToColorToPlay(fen: string): Color {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

export function fenToLastMoveColor(fen: string): Color {
  return fenToColorToPlay(fen) === "black" ? "white" : "black";
}
