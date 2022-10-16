import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SearchBar } from "./SearchBar";

export default {
  title: "DumbContracts/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof SearchBar>;

const Template: ComponentStory<typeof SearchBar> = (args) => (
  <SearchBar {...args} />
);

export const DefaultCard = Template.bind({});
DefaultCard.args = {
  onSearch: (search: string) => alert("searched " + search),
};
