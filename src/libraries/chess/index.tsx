export type {Position, Game, Headers} from "./Game";
export {serializableGameToGame} from "./Game"

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
