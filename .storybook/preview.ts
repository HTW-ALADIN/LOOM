import type { Preview } from "@storybook/vue3";

import "@quasar/extras/mdi-v7/mdi-v7.css";
import "quasar/dist/quasar.css";
import { setup } from "@storybook/vue3";
import { Quasar } from "quasar";

setup((app) => {
  app.use(Quasar, {});
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
