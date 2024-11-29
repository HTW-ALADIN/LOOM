import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentData,
  ValidationConfiguration,
  SerialisedMethods,
  SerialisedContextMenu,
  NestedComponents,
  MethodImplementations
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import type { SerializedInputFieldComponent } from "../InputField/InputField";
import type { SerializedButtonComponent } from "../GenericButton/GenericButton";
import { unref } from "vue";

/**
 * The FormProps interface is used to define the properties of the Form component.
 */
export interface FormProps extends ComponentProps {}

/**
 * The type of the Form component.
 */
export type FormComponentType = "GenericForm";

/**
 * The Form-component may point to external dependencies for validation checks.
 * The external dependencies must be references to other components.
 */
export interface SerializedFormDependencies extends SerialisedDependencies {
  [key: string]: JSONPathExpression;
}

/**
 * The Form-component may have external dependencies for validation checks.
 */
export interface FormDependencies extends ComponentDependencies {
  [key: string]: SerializedBaseComponent;
}

/**
 * The Form-component may hold nothing.
 */
export interface FormComponentData extends ComponentData {}

/**
 * The form-component is submitable if the validation checks that are governed by the FormValidationConfiguration are passed.
 */
export interface FormValidationConfiguration extends ValidationConfiguration {
  submitableWhen:
    | "isValid"
    | "isCorrect"
    | "dependenciesAreValidAndFormFieldsAreCorrect"
    | "formFieldsAreValidAndDependenciesAreCorrect";
}

/**
 * The Form-component consists of arbitrarily many input fields and a set of buttons.
 */
export interface FormNestedComponents extends NestedComponents {
  formComponents: {
    // TODO: Include DropdownComponent, Sliders, Checkboxes, etc.
    [key: string]: SerializedInputFieldComponent;
  };
  actionComponents: {
    submit: SerializedButtonComponent;
    reset?: SerializedButtonComponent;
  };
}

export interface ValidationResult {
  isValid: boolean;
  isCorrect: boolean;
  dependenciesAreValidAndFormFieldsAreCorrect: boolean;
  formFieldsAreValidAndDependenciesAreCorrect: boolean;
}

/**
 * The SerializedFormComponent interface is used to define the serialised properties of the Form component.
 */
export interface SerializedFormComponent
  extends SerializedBaseComponent<
    FormComponentType,
    SerializedFormDependencies,
    FormComponentData,
    FormValidationConfiguration,
    SerialisedMethods,
    SerialisedContextMenu,
    FormNestedComponents
  > {
  dependenciesAreValidAndFormFieldsAreCorrect: boolean;
  formFieldsAreValidAndDependenciesAreCorrect: boolean;
}

/**
 * The FormComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class FormComponent extends BaseComponent<
  SerializedFormComponent,
  SerializedFormDependencies,
  FormDependencies,
  FormComponentData,
  FormValidationConfiguration,
  SerialisedMethods,
  MethodImplementations,
  FormNestedComponents
> {
  private dependenciesAreValidAndFormFieldsAreCorrect: boolean = false;
  private formFieldsAreValidAndDependenciesAreCorrect: boolean = false;
  /**
   * A FormComponent is valid, if all elements in the form are valid and all external dependencies are valid.
   * A FormComponent is correct, if all elements in the form are correct and all external dependencies are correct.
   * @returns
   */
  public validate() {
    const { isValid: areDependenciesValid, isCorrect: areDependenciesCorrect } =
      this.validateValidityAndCorrectness(Object.values(unref(this.dependencies)));

    const { isValid: areFormComponentsValid, isCorrect: areFormComponentsCorrect } =
      this.validateValidityAndCorrectness(Object.values(this.getNestedComponents().formComponents));

    const validationResult: ValidationResult = {
      isValid: areDependenciesValid && areFormComponentsValid,
      isCorrect: areDependenciesCorrect && areFormComponentsCorrect,
      dependenciesAreValidAndFormFieldsAreCorrect: areDependenciesValid && areFormComponentsCorrect,
      formFieldsAreValidAndDependenciesAreCorrect: areFormComponentsValid && areDependenciesCorrect
    };

    Object.entries(validationResult).forEach(([key, value]) => {
      unref(this.storeObject).setProperty({
        path: `${this.serialisedBaseComponentPath}.${key}`,
        value
      });
    });

    return validationResult;
  }

  private validateValidityAndCorrectness(serializedComponents: Array<SerializedBaseComponent>) {
    return serializedComponents.reduce(
      (validity, dependentComponent) => {
        validity.isValid = validity.isValid && dependentComponent.isValid;
        validity.isCorrect = validity.isCorrect && dependentComponent.isCorrect;
        return validity;
      },
      { isValid: true, isCorrect: true }
    );
  }
}
