import "../styles/globals.css";

// .storybook/preview.js

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "twitter",
    values: [
      {
        name: "twitter",
        value: "rgb(15, 23, 42)",
      },
      {
        name: "facebook",
        value: "#3b5998",
      },
    ],
  },
};
