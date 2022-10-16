import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ContractInstance } from "./ContractInstance";

export default {
  title: "DumbContracts/ContractInstance",
  component: ContractInstance,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof ContractInstance>;

const Template: ComponentStory<typeof ContractInstance> = (args) => (
  <ContractInstance {...args} />
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
