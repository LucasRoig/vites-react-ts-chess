import {Meta, Story} from "@storybook/react/types-6-0";
import {NotationPanel, NotationPanelProps} from "./NotationPanel";
import React, {PropsWithChildren} from "react";
import simpleGame from "../../data/SimpleGame.json"
import {serializableGameToGame} from "../../libraries/chess";
import {gameToNonCircularGame, SerializableGame} from "../../libraries/chess/Game";

//Pour le pb json circulaire voir : https://github.com/storybookjs/storybook/issues/13887 et https://github.com/storybookjs/storybook/issues/13888
export default {
  title: 'Chess/NotationPanel',
  component: NotationPanel,
} as Meta;

const Template: Story<PropsWithChildren<NotationPanelProps>> = ({...args}) => {

    return <NotationPanel {...args} />
}

export const Panel = Template.bind({});
Panel.args = {
  game:  gameToNonCircularGame(serializableGameToGame(simpleGame.game as SerializableGame))
};
