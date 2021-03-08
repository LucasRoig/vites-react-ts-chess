import {Meta, Story} from "@storybook/react/types-6-0";
import {NotationPanel, NotationPanelProps} from "./NotationPanel";
import React, {PropsWithChildren} from "react";
import simpleGame from "../../../data/SimpleGame.json"
import {serializableGameToGame} from "../../libraries/chess";
import {SerializableGame} from "../../libraries/chess/Game";

export default {
  title: 'Chess/NotationPanel',
  component: NotationPanel,
} as Meta;

const Template: Story<PropsWithChildren<NotationPanelProps>> = ({...args}) => <NotationPanel {...args}/>

export const Panel = Template.bind({});
console.log(simpleGame.game)
Panel.args = {
  game: serializableGameToGame(simpleGame.game as SerializableGame)
};
