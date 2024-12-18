import type { Meta, StoryObj } from "@storybook/vue3";
import GenericForm from "@/components/GenericForm/GenericForm.vue";
import { useStore } from "@/stores/Store";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Example/GenericForm",
  component: GenericForm,
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
        component: "GenericForm component. Allows the user to fill a form and submit it."
      }
    }
  }
} satisfies Meta<typeof GenericForm>;

// More examples: https://graphviz.org/gallery/
export default meta;
type Story = StoryObj<typeof meta>;
export const BasicGenericForm: Story = {
  args: {
    storeObject: useStore({
      0: {
        type: "GenericForm",
        name: "Example Form",
        dependencies: {},
        validationConfiguration: {},
        state: {
          isValid: true,
          isCorrect: true
        },
        nestedComponents: {
          formComponents: {
            inputField1: {
              type: "InputField",
              name: "InputField1",
              state: {
                isValid: false,
                isCorrect: false,
                fieldValue: "test"
              },
              componentConfiguration: {
                icon: "10k",
                label: "test",
                hint: "test"
              },
              dependencies: {
                referenceValue: "$.nodes.0.components.1.component.fieldValue"
              },
              validationConfiguration: {
                type: "compareValueFromStatic",
                comparisons: [{ value: "test", operator: "==" }]
              }
            }
          },
          actionComponents: {
            submit: {
              type: "GenericButton",
              name: "Submit",
              dependencies: {},
              validationConfiguration: {},
              state: {
                isValid: true,
                isCorrect: true,
                label: "Submit",
                loadingState: false,
                progressPercentage: undefined
              },
              componentConfiguration: { dimension: { width: 150, height: 150 }, icon: "gear" }
            }
          }
        }
      }
    })
  }
};
