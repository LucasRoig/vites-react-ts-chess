import {
  BlockTypeNames, BulletListBlockHandler, BulletListBlockModel,
  ChessGameBlockHandler,
  ChessGameBlockModel, Heading1BlockHandler,
  Heading1BlockModel, Heading2BlockHandler, Heading2BlockModel, Heading3BlockHandler, Heading3BlockModel,
  TextBlockHandler,
  TextBlockModel
} from "./Models";
import React from "react";

export interface BlockHandler<T extends Block> {
  accept: (block: Block | BlockTypeNames) => boolean
  shouldConfirmDeletion: (block: Block) => boolean
  toSerializable: (block: Block) => unknown
  fromSerializable: (s: unknown) => T
  make: () => T
}

export type Block =
  ChessGameBlockModel
  | TextBlockModel
  | Heading1BlockModel
  | Heading2BlockModel
  | Heading3BlockModel
  | BulletListBlockModel

export interface Document {
  blocks: Block[]
  title: string
}

export function newDocument() {
  return {
    blocks: [BlocksController.make(BlockTypeNames.Text)],
    title: ""
  }
}

const handlers: BlockHandler<Block>[] = [
  new TextBlockHandler(),
  ChessGameBlockHandler,
  new Heading1BlockHandler(),
  new Heading2BlockHandler(),
  new Heading3BlockHandler(),
  new BulletListBlockHandler()
]

function selectHandler<T>(block: Block | BlockTypeNames, fn: (h: BlockHandler<any>) => T, defaultValue: T): T {
  for (const handler of handlers) {
    if (handler.accept(block)) {
      return fn(handler);
    }
  }
  console.error("No handler for block", block)
  return defaultValue
}

export const BlocksController = {
  shouldConfirmDeletion(block: Block): boolean {
    return selectHandler(block, h => h.shouldConfirmDeletion(block), true)
  },

  make(blockType: BlockTypeNames): Block {
    return selectHandler(blockType, h => h.make(), undefined)
  },

  toSerializable(block: Block): unknown {
    return selectHandler(block.type, h => h.toSerializable(block), null)
  },

  fromSerializable(s: unknown): Block {
    return selectHandler((s as Block).type, h => h.fromSerializable(s), undefined)
  }
}

