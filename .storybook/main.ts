import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    {
      name: "storybook-addon-jsdoc-to-mdx",
      options: {
        folderPaths: ["./src/"], // paths to folders with JS/TS code
        extensions: ["ts", "js"] // file extensions to include
      }
    }
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {
      docgen: "vue-component-meta"
    }
  }
};
export default config;
