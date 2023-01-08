import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Analysis } from "./Analysis";

export default {
  title: "DumbContracts/Analysis",
  component: Analysis,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Analysis>;

const Template: ComponentStory<typeof Analysis> = (args) => (
  <Analysis {...args} />
);

export const DefaultInstance = Template.bind({});
DefaultInstance.args = {
  name: "kitCatInu",
  address: "0x635CD4526A6030D7fab675e23C6230089Adb2f49",
  license: "MIT",
  last_used: "10/5/2022 15:30",
  safety_score: 89,
  transactions: 100,
  tags: ["unverified", "abandoned"],
  onBack: () => alert("backed"),
};
