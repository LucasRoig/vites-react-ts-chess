import {Meta, Story} from "@storybook/react/types-6-0";
import React, {PropsWithChildren} from "react";
import {Gameboard, GameboardProps} from "./Gameboard";

export default {
  title: 'Chess/Gameboard',
  component: Gameboard,
} as Meta;

const Template: Story<PropsWithChildren<GameboardProps>> = ({...args}) => <Gameboard {...args}/>

export const Board = Template.bind({});
Board.args = {

};
