import {Meta, Story} from "@storybook/react/types-6-0";
import {ChessBoard, ChessBoardProps} from "./Chessboard";
import React, {PropsWithChildren} from "react";

export default {
  title: 'Chess/ChessBoard',
  component: ChessBoard,
} as Meta;

const Template: Story<PropsWithChildren<ChessBoardProps>> = ({...args}) => <ChessBoard {...args}/>

export const Board = Template.bind({});
Board.args = {
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
};
