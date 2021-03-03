import {Meta, Story} from "@storybook/react/types-6-0";
import React, {PropsWithChildren} from "react";
import {ChessBoardWithRules, ChessBoardWithRulesProps} from "./ChessboardWithRules";

export default {
  title: 'Chess/ChessBoardWithRules',
  component: ChessBoardWithRules,
} as Meta;

const Template: Story<PropsWithChildren<ChessBoardWithRulesProps>> = ({...args}) => <ChessBoardWithRules {...args}/>

export const Board = Template.bind({});
Board.args = {
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
};

export const BoardWithPromotion = Template.bind({});
BoardWithPromotion.args = {
  fen: 'rnbqkbn1/pppppppP/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
};
