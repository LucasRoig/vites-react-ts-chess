
declare module 'react-chessground' {
  import React from "react";

  export type Color = 'white' | 'black';
  export type Role = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
  export type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
  export type Key = `${File}${Rank}`;
  export type FEN = string;
  export type Pos = [number, number];
  export interface Piece {
    role: Role;
    color: Color;
    promoted?: boolean;
  }
  export interface Drop {
    role: Role;
    key: Key;
  }
  export type Pieces = Map<Key, Piece>;
  export type PiecesDiff = Map<Key, Piece | undefined>;

  export type KeyPair = [Key, Key];

  export type NumberPair = [number, number];

  export type NumberQuad = [number, number, number, number];

  export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
  }

  export type Dests = Map<Key, Key[]>;

  export interface Elements {
    board: HTMLElement;
    container: HTMLElement;
    ghost?: HTMLElement;
    svg?: SVGElement;
    customSvg?: SVGElement;
  }
  export interface Dom {
    elements: Elements;
    bounds: Memo<ClientRect>;
    redraw: () => void;
    redrawNow: (skipSvg?: boolean) => void;
    unbind?: Unbind;
    destroyed?: boolean;
    relative?: boolean; // don't compute bounds, use relative % to place pieces
  }
  export interface Exploding {
    stage: number;
    keys: readonly Key[];
  }

  export interface MoveMetadata {
    premove: boolean;
    ctrlKey?: boolean;
    holdTime?: number;
    captured?: Piece;
    predrop?: boolean;
  }
  export interface SetPremoveMetadata {
    ctrlKey?: boolean;
  }

  export type MouchEvent = Event & Partial<MouseEvent & TouchEvent>;

  export interface KeyedNode extends HTMLElement {
    cgKey: Key;
  }
  export interface PieceNode extends KeyedNode {
    tagName: 'PIECE';
    cgPiece: string;
    cgAnimating?: boolean;
    cgFading?: boolean;
    cgDragging?: boolean;
  }
  export interface SquareNode extends KeyedNode {
    tagName: 'SQUARE';
  }

  export interface Memo<A> {
    (): A;
    clear: () => void;
  }

  export interface Timer {
    start: () => void;
    cancel: () => void;
    stop: () => number;
  }

  export type Redraw = () => void;
  export type Unbind = () => void;
  export type Milliseconds = number;
  export type KHz = number;

  export interface DrawShape {
    orig: Key;
    dest?: Key;
    brush?: string;
    modifiers?: DrawModifiers;
    piece?: DrawShapePiece;
    customSvg?: string;
  }

  export interface DrawModifiers {
    lineWidth?: number;
  }


  export interface DrawShapePiece {
    role: Role;
    color: Color;
    scale?: number;
  }

  export interface DrawBrush {
    key: string;
    color: string;
    opacity: number;
    lineWidth: number;
  }

  export interface ChessgroundProps {
    fen?: FEN; // chess position in Forsyth notation
    orientation?: Color; // board orientation. white | black
    turnColor?: Color; // turn to play. white | black
    check?: Color | boolean; // true for current color, false to unset
    lastMove?: Key[]; // squares part of the last move ["c3", "c4"]
    selected?: Key; // square currently selected "a1"
    coordinates?: boolean; // include coords attributes
    autoCastle?: boolean; // immediately complete the castle by moving the rook after king move
    viewOnly?: boolean; // don't bind events: the user will never be able to move pieces around
    disableContextMenu?: boolean; // because who needs a context menu on a chessboard
    resizable?: boolean; // listens to chessground.resize on document.body to clear bounds cache
    addPieceZIndex?: boolean; // adds z-index values to pieces (for 3D)
    // pieceKey: boolean; // add a data-key attribute to piece elements
    highlight?: {
      lastMove?: boolean; // add last-move class to squares
      check?: boolean; // add check class to squares
    };
    animation?: {
      enabled?: boolean;
      duration?: number;
    };
    movable?: {
      free?: boolean; // all moves are valid - board editor
      color?: Color | 'both'; // color that can move. white | black | both | undefined
      dests?: Dests; // valid moves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]}
      showDests?: boolean; // whether to add the move-dest class on squares
      events?: {
        after?: (orig: Key, dest: Key, metadata: MoveMetadata) => void; // called after the move has been played
        afterNewPiece?: (role: Role, key: Key, metadata: MoveMetadata) => void; // called after a new piece is dropped on the board
      };
      rookCastle?: boolean; // castle by moving the king to the rook
    };
    premovable?: {
      enabled?: boolean; // allow premoves for color that can not move
      showDests?: boolean; // whether to add the premove-dest class on squares
      castle?: boolean; // whether to allow king castle premoves
      dests?: Key[]; // premove destinations for the current selection
      events?: {
        set?: (orig: Key, dest: Key, metadata?: SetPremoveMetadata) => void; // called after the premove has been set
        unset?: () => void; // called after the premove has been unset
      };
    };
    predroppable?: {
      enabled?: boolean; // allow predrops for color that can not move
      events?: {
        set?: (role: Role, key: Key) => void; // called after the predrop has been set
        unset?: () => void; // called after the predrop has been unset
      };
    };
    draggable?: {
      enabled?: boolean; // allow moves & premoves to use drag'n drop
      distance?: number; // minimum distance to initiate a drag; in pixels
      autoDistance?: boolean; // lets chessground set distance to zero when user drags pieces
      showGhost?: boolean; // show ghost of piece being dragged
      deleteOnDropOff?: boolean; // delete a piece when it is dropped off the board
    };
    selectable?: {
      // disable to enforce dragging over click-click move
      enabled?: boolean;
    };
    events?: {
      change?: () => void; // called after the situation changes on the board
      // called after a piece has been moved.
      // capturedPiece is undefined or like {color: 'white'; 'role': 'queen'}
      move?: (orig: Key, dest: Key, capturedPiece?: Piece) => void;
      dropNewPiece?: (piece: Piece, key: Key) => void;
      select?: (key: Key) => void; // called when a square is selected
      insert?: (elements: Elements) => void; // when the board DOM has been (re)inserted
    };
    drawable?: {
      enabled?: boolean; // can draw
      visible?: boolean; // can view
      defaultSnapToValidMove?: boolean;
      eraseOnClick?: boolean;
      shapes?: DrawShape[];
      autoShapes?: DrawShape[];
      brushes?: DrawBrush[];
      pieces?: {
        baseUrl?: string;
      };
      onChange?: (shapes: DrawShape[]) => void; // called after drawable shapes change
    };
  }

  export default class Chessground extends React.Component<ChessgroundProps>{}
}
