export type {Headers} from "./Game";

type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
type PromotionType = 'q' | 'r' | 'b' | 'n'
export type Square = `${File}${Rank}`
export type Color = 'white' | 'black'
export interface Move {
  from: Square,
  to: Square,
  promotion?: PromotionType
}
export type PieceRole = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'
export interface Piece {
  color: Color,
  role: PieceRole
}
export const BlackKing: Piece = {role: "king", color: "black"}
export const BlackQueen: Piece = {role: "queen", color: "black"}
export const BlackRook: Piece = {role: "rook", color: "black"}
export const BlackBishop: Piece = {role: "bishop", color: "black"}
export const BlackKnight: Piece = {role: "knight", color: "black"}
export const BlackPawn: Piece = {role: "pawn", color: "black"}
export const WhiteKing: Piece = {role: "king", color: "white"}
export const WhiteQueen: Piece = {role: "queen", color: "white"}
export const WhiteRook: Piece = {role: "rook", color: "white"}
export const WhiteBishop: Piece = {role: "bishop", color: "white"}
export const WhiteKnight: Piece = {role: "knight", color: "white"}
export const WhitePawn: Piece = {role: "pawn", color: "white"}

export interface PieceAndSquare {
  square: number, //0 to 63 0 being a8
  piece: Piece
}
