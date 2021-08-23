import React from "react";
import {newId} from "../../@core/IdGenerator";
import {Block, BlockHandler} from "./BlocksController";
import {newNormalizedGame, NormalizedGame} from "../chess/NormalizedGame";

export enum BlockTypeNames{
  Text = "Text",
  ChessGame = "ChessGame",
  Heading1 = "Heading1",
  Heading2 = "Heading2",
  Heading3 = "Heading3",
  BulletList = "BulletList"
}

interface BaseBlock {
  id: string;
  type: BlockTypeNames;
  isText: boolean;
}

interface TextBaseBlock extends BaseBlock {
  isText: true;
  content: string;
}

export interface TextBlockModel extends TextBaseBlock {
  type: BlockTypeNames.Text;
}

const checkType = (acceptedType: BlockTypeNames) => (blockOrStr: Block | BlockTypeNames): boolean  => {
  if (typeof blockOrStr !== "string") {
    blockOrStr = (blockOrStr as Block).type
  }
  return blockOrStr === acceptedType
}

// export const TextBlockHandler: BlockHandler<TextBlockModel> = {
//   accept: checkType(BlockTypeNames.Text),
//   shouldConfirmDeletion: block => false,
//   make: () => ({
//     id: newId(),
//     content: "",
//     type: BlockTypeNames.Text,
//     isText: true
//   }),
//   toSerializable: b => b,
//   fromSerializable: b => b as TextBlockModel
// }

export interface ChessGameBlockModel extends BaseBlock {
  type: BlockTypeNames.ChessGame;
  game: NormalizedGame;
  isText: false;
}

export const ChessGameBlockHandler: BlockHandler<ChessGameBlockModel> = {
  accept: checkType(BlockTypeNames.ChessGame),
  shouldConfirmDeletion: block => false,
  make: () => ({
    id: newId(),
    game: newNormalizedGame(),
    type: BlockTypeNames.ChessGame,
    isText: false
  }),
  toSerializable: block => block,
  fromSerializable: (s: any) => s as ChessGameBlockModel
}

export interface Heading1BlockModel extends TextBaseBlock {
  type: BlockTypeNames.Heading1,
}

// export const Heading1BlockHandler: BlockHandler<Heading1BlockModel> = {
//   accept: checkType(BlockTypeNames.Heading1),
//   shouldConfirmDeletion: () => false,
//   make: () => ({
//     id: newId(),
//     type: BlockTypeNames.Heading1,
//     content: "",
//     isText: true
//   }),
//   toSerializable: b => b,
//   fromSerializable: b => b as Heading1BlockModel
// }

export interface Heading2BlockModel extends TextBaseBlock {
  type: BlockTypeNames.Heading2,
}

// export const Heading2BlockHandler: BlockHandler<Heading2BlockModel> = {
//   accept: checkType(BlockTypeNames.Heading2),
//   shouldConfirmDeletion: () => false,
//   make: () => ({
//     id: newId(),
//     type: BlockTypeNames.Heading2,
//     content: "",
//     isText: true
//   }),
//   toSerializable: b => b,
//   fromSerializable: b => b as Heading2BlockModel
// }

export interface Heading3BlockModel extends TextBaseBlock {
  type: BlockTypeNames.Heading3,
}

// export const Heading3BlockHandler: BlockHandler<Heading3BlockModel> = {
//   accept: checkType(BlockTypeNames.Heading3),
//   shouldConfirmDeletion: () => false,
//   make: () => ({
//     id: newId(),
//     type: BlockTypeNames.Heading3,
//     content: "",
//     isText: true
//   }),
//   toSerializable: b => b,
//   fromSerializable: b => b as Heading3BlockModel
// }

export interface BulletListBlockModel extends TextBaseBlock {
  type: BlockTypeNames.BulletList,
}

// export const BulletListBlockHandler: BlockHandler<BulletListBlockModel> = {
//   accept: checkType(BlockTypeNames.BulletList),
//   shouldConfirmDeletion: () => false,
//   make: () => ({
//     id: newId(),
//     type: BlockTypeNames.BulletList,
//     content: "",
//     isText: true
//   }),
//   toSerializable: b => b,
//   fromSerializable: b => b as BulletListBlockModel
// }



export abstract class BaseBlockHandler<T extends Block> implements BlockHandler<T> {

  fromSerializable(s: unknown): T {
    return s as T;
  }

  shouldConfirmDeletion(block: Block): boolean {
    return false;
  }

  toSerializable(block: Block): unknown {
    return block;
  }

  makeTextBlock():{id: string, content: string, isText: true} {
    return {
      id: newId(),
      content: "",
      isText: true
    }
  }

  abstract accept(block: Block | BlockTypeNames): boolean;

  abstract make(): T;
}

export class TextBlockHandler extends BaseBlockHandler<TextBlockModel> {
  accept = checkType(BlockTypeNames.Text)
  make(): TextBlockModel {
    return {
      ...super.makeTextBlock(),
      type: BlockTypeNames.Text
    }
  }
}

export class Heading1BlockHandler extends BaseBlockHandler<Heading1BlockModel> {
  accept = checkType(BlockTypeNames.Heading1)
  make(): Heading1BlockModel {
    return {
      ...super.makeTextBlock(),
      type: BlockTypeNames.Heading1
    }
  }
}

export class Heading2BlockHandler extends BaseBlockHandler<Heading2BlockModel> {
  accept = checkType(BlockTypeNames.Heading2)
  make(): Heading2BlockModel {
    return {
      ...super.makeTextBlock(),
      type: BlockTypeNames.Heading2
    }
  }
}

export class Heading3BlockHandler extends BaseBlockHandler<Heading3BlockModel> {
  accept = checkType(BlockTypeNames.Heading3)
  make(): Heading3BlockModel {
    return {
      ...super.makeTextBlock(),
      type: BlockTypeNames.Heading3
    }
  }
}

export class BulletListBlockHandler extends BaseBlockHandler<BulletListBlockModel> {
  accept = checkType(BlockTypeNames.BulletList)
  make(): BulletListBlockModel {
    return {
      ...super.makeTextBlock(),
      type: BlockTypeNames.BulletList
    }
  }
}
