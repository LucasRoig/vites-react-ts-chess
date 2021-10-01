import {EditableBoard, EditableBoardProps} from "./EditableBoard";
import {Meta, Story} from "@storybook/react/types-6-0";
import React, {PropsWithChildren} from "react";

export default {
  title: "Chess/EditableBoard",
  component: EditableBoard
} as Meta

const Template: Story<PropsWithChildren<EditableBoardProps>> = ({...args}) =>
  <EditableBoard {...args}/>

export const Board = Template.bind({})
Board.args = {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
}
