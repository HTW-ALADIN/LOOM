import type { Meta, StoryObj } from "@storybook/vue3";
import GenericButton from "@/components/GenericButton/GenericButton.vue";
import { useStore } from "@/stores/Store";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Example/GenericButton",
  component: GenericButton,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  decorators: [
    () => ({
      template:
        '<div style=" display: flex; justify-content:center; align-items: center;"> <div style="width: 500px; height: 500px;"><story/></div> </div>'
    })
  ],
  args: {
    componentID: 0,
    componentPath: "$.0"
  },
  parameters: {
    docs: {
      description: {
        component:
          "Button component. Allows the user to click a button with customizable functionality."
      }
    }
  }
} satisfies Meta<typeof GenericButton>;

// More examples: https://graphviz.org/gallery/
export default meta;
type Story = StoryObj<typeof meta>;
export const ProgressBarButton: Story = {
  args: {
    storeObject: useStore({
      0: {
        type: "GenericButton",
        name: "Clickable button with a progressbar.",
        isValid: true,
        isCorrect: true,
        dependencies: {},
        validationConfiguration: {},
        component: {
          label: "Click me!",
          loadingState: false,
          progressPercentage: undefined,
          buttonConfiguration: { dimension: { width: 150, height: 150 }, icon: "gear" }
        }
      }
    }),
    isValid: true
  }
};
