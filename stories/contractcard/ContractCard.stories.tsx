import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ContractCard } from "./ContractCard";

export default {
  title: "DumbContracts/ContractCard",
  component: ContractCard,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof ContractCard>;

const Template: ComponentStory<typeof ContractCard> = (args) => (
  <ContractCard {...args} />
);

export const DefaultCard = Template.bind({});
DefaultCard.args = {
  name: "kitCatInu",
  address: "0x635CD4526A6030D7fab675e23C6230089Adb2f49",
  license: "MIT",
  last_used: "10/5/2022 15:30",
  safety_score: 89,
  transactions: 100,
  tags: ["unverified", "abandoned"],
  onClick: (address: string) => alert(address),
};
