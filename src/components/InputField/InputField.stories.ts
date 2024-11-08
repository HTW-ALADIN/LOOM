import type { Meta, StoryObj } from "@storybook/vue3";
import InputField from "@/components/InputField/InputField.vue";
import { useStore } from "@/stores/Store";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Example/InputField",
  component: InputField,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  decorators: [
    () => ({
      template:
        '<div style=" display: flex; justify-content:center; align-items: center;"> <div style="width: 500px; height: 500px;"><story/></div> </div>'
    })
  ],
  args: {
    componentID: 0
  },
  parameters: {
    docs: {
      description: {
        component:
          "InputField component. Allows the user to input a value of a specific type. The input is validated against the specified validation Strategy."
      }
    }
  }
} satisfies Meta<typeof InputField>;

// More examples: https://graphviz.org/gallery/
export default meta;
type Story = StoryObj<typeof meta>;
export const NumericInputField: Story = {
  args: {
    storeObject: useStore({
      0: {
        type: "InputField",
        name: "Numeric Input Field",
        isValid: false,
        isCorrect: false,
        dependencies: {},
        validationConfiguration: {
          type: "compareValueFromStatic",
          comparisons: [{ operator: "==", value: 32 }]
        },
        component: {
          fieldConfiguration: { fieldValue: 20 }
        }
      }
    }),
    componentPath: "$.0"
  }
};
