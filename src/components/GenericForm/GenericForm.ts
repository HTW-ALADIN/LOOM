import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentState,
  ValidationConfiguration,
  NestedComponents,
  ComponentTypeSpecification,
  PublicComponentEmit,
  ComponentEmits,
  ActionPayload,
  FetchAction,
  ComponentActions
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
 * The structure of the payload that is emitted by the Form-component.
 */
export interface FormPayload extends ActionPayload {
  formFields: { [key: string]: any };
  externalValues: { [key: string]: any };
}

/**
 * The Form-component emits an action event.
 * The payload contains the form fields and the values of potential dependencies.
 * The triggered action has to be specified in the component configuration.
 */
export type FormEmit = [payload: FormPayload] & PublicComponentEmit;

export type FormEmits = {
  submit: FormEmit;
} & ComponentEmits;

/**
 * The Form-component has additional state properties for validation.
 */
export interface FormComponentState extends ComponentState {
  dependenciesAreValidAndFormFieldsAreCorrect: boolean;
  formFieldsAreValidAndDependenciesAreCorrect: boolean;
}

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
  /**
   * Components used as formComponents MUST expose their user input value as fieldValue in their componentState. See InputField for an example.
   */
  formComponents: {
    // TODO: Include DropdownComponent, Sliders, Checkboxes, etc.
    [key: string]: SerializedInputFieldComponent;
  };
  actionComponents: {
    submit: SerializedButtonComponent;
    reset?: SerializedButtonComponent;
  };
}

/**
 * The ValidationResult holds the validation information for all combinations of validity and correctnes for fields and dependencies.
 */
export interface ValidationResult {
  isValid: boolean;
  isCorrect: boolean;
  dependenciesAreValidAndFormFieldsAreCorrect: boolean;
  formFieldsAreValidAndDependenciesAreCorrect: boolean;
}

export interface SubmitAction extends FetchAction {
  externalValues?: {
    [key: string]: JSONPathExpression;
  };
}

/**
 * The FormComponent allows to emit a fetch-action on submitting the form.
 */
export interface FormActions extends ComponentActions {
  submit: SubmitAction;
}

/**
 * The SerializedFormComponent interface is used to define the serialised properties of the Form component.
 */
export interface SerializedFormComponent extends SerializedBaseComponent<FormComponentType> {
  dependencies: SerializedFormDependencies;
  state: FormComponentState;
  validationConfiguration: FormValidationConfiguration;
  nestedComponents: FormNestedComponents;
  actions: FormActions;
}

export interface FormSpecification extends ComponentTypeSpecification {
  SerializedComponent: SerializedFormComponent;
  Dependencies: FormDependencies;
  Emits: FormEmits;
}

/**
 * The FormComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class FormComponent extends BaseComponent<FormSpecification> {
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
        path: `${this.serialisedBaseComponentPath}.state.${key}`,
        value
      });
    });

    return validationResult;
  }

  private validateValidityAndCorrectness(serializedComponents: Array<SerializedBaseComponent>) {
    return serializedComponents.reduce(
      (validity, dependentComponent) => {
        validity.isValid = validity.isValid && dependentComponent.state.isValid;
        validity.isCorrect = validity.isCorrect && dependentComponent.state.isCorrect;
        return validity;
      },
      { isValid: true, isCorrect: true }
    );
  }

  /**
   * The FormComponent emits a submit event with the values of the form fields and potential external values as its payload.
   * Assumes that user values in the form fields are stored in the fieldValue property of their componentState.
   * @returns
   */
  protected constructPayload() {
    const externalValueReferences =
      unref(this.serializedBaseComponent).actions.submit.externalValues || {};

    const externalValues = Object.entries(externalValueReferences).reduce(
      (externalValues, [key, path]) => {
        const externalValue = unref(this.storeObject).getProperty(path);
        externalValues[key] = externalValue;
        return externalValues;
      },
      {} as { [key: string]: any }
    );

    const formFields = Object.entries(this.getNestedComponents().formComponents).reduce(
      (formFieldValues, [key, component]) => {
        const value = component.state.fieldValue;
        formFieldValues[key] = value;

        return formFieldValues;
      },
      {} as { [key: string]: any }
    );

    return { formFields, externalValues };
  }
}
