import React, {PropsWithChildren, ReactElement, ReactNode} from "react";
import {Button, ButtonProps} from "./Button";
import {Meta, Story} from "@storybook/react/types-6-0";

export default {
  title: 'Basics/Button',
  component: Button,
} as Meta;

const Template: Story<PropsWithChildren<ButtonProps>> = ({children, ...args}) =>
  <Button {...args}>{children}</Button>;

export const Primary = Template.bind({});
Primary.args = {
  children: "text",
  color: "primary"
};
