import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentData,
  ValidationConfiguration
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import { unref } from "vue";

import type { QInputProps } from "quasar";
import type { IconList } from "./IconList";

/**
 * The InputFieldProps interface is used to define the properties, that are passed from the parent component to the InputField component.
 */
export interface InputFieldProps extends ComponentProps {}

/**
 * The type of the InputField component.
 */
export type InputFieldComponentType = "InputField";

/**
 * The InputField-component requires a valid [???] to display.
 */
export interface SerializedInputFieldDependencies extends SerialisedDependencies {
  referenceValue?: JSONPathExpression;
}

/**
 * The InputField-component requires a valid dotDescription to display.
 */
export interface InputFieldDependencies extends ComponentDependencies {
  referenceValue?: QInputProps["modelValue"];
}

/**
 * The FieldConfiguration defines the properties of the InputField component.
 * It extends the QInputProps from Quasar.
 * @see https://quasar.dev/vue-components/input#QInput-API
 *
 * IconList is a list of all available icons in Quasar. The icon style is "material-icons" per default.
 */
export interface FieldConfiguration extends Omit<QInputProps, "modelValue" | "inputStyle"> {
  icon?: IconList;
  placeholder?: string;
}

/**
 * The InputField-component may hold a static dotDescription in its componentData.
 */
export interface InputFieldComponentData extends ComponentData {
  fieldConfiguration: FieldConfiguration;
  fieldValue: QInputProps["modelValue"];
}

export type BasicComparisonOperators = "=" | "==" | "!=" | ">" | "<" | ">=" | "<=";

/**
 * Configuration for basic comparison operations with dynamic values from paths.
 */
export interface PathComparisonConfiguration {
  path: JSONPathExpression;
  operator: BasicComparisonOperators;
}

/**
 * Validation strategy that compares value from a path to the value of the input field.
 */
export interface CompareToValuesFromPathsValidationStrategy extends ValidationConfiguration {
  type: "compareValueFromPath";
  comparisons: Array<PathComparisonConfiguration>;
}

/**
 * Configuration for basic comparison operations with static values.
 */
export interface StaticComparisonConfiguration {
  value: string | number;
  operator: BasicComparisonOperators;
}

/**
 * Validation strategy that compares static values to the value of the input field.
 */
export interface CompareToStaticValuesValidationStrategy extends ValidationConfiguration {
  type: "compareValueFromStatic";
  comparisons: Array<StaticComparisonConfiguration>;
}

/**
 * Validation strategy utilizing regular expressions.
 *
 * Typescript does not support modeling regular expressions as a type yet, so we use a string here. See e.g. https://github.com/microsoft/TypeScript/issues/6579 .
 */
export interface MatchAgainstRegExpValidationStrategy extends ValidationConfiguration {
  type: "matchAgainstRegExp";
  regExp: string;
}

/**
 * Validation strategy that uses third-party validators via a http request. Expects a boolean response.
 *
 * Typescript does not support modeling regular expressions as a type yet, so we use a string here. See e.g. https://github.com/microsoft/TypeScript/issues/6579 .
 */
export interface ExternalValidationStrategy extends ValidationConfiguration {
  type: "externalValidation";
  url: string;
}

/**
 * Map of all available validation strategies for the InputField component.
 */
interface InputFieldValidationConfigurationMap {
  compareValueFromPath: CompareToStaticValuesValidationStrategy;
  compareValueFromStatic: CompareToValuesFromPathsValidationStrategy;
  matchAgainstRegExp: MatchAgainstRegExpValidationStrategy;
  externalValidation: ExternalValidationStrategy;
}

/**
 * Configuration for the different InputField validation strategies.
 * As the typescript compiler can't handle "correlated unions", it is recommended to refactor to generics as described here: https://stackoverflow.com/questions/79160004/can-typescript-infer-subtypes-of-parameters-based-on-a-dynamic-variable-accessin
 */
export type InputFieldValidationConfiguration<
  K extends keyof InputFieldValidationConfigurationMap
> = { [P in K]: { type: P } & InputFieldValidationConfigurationMap[P] }[K];

/**
 * The SerializedInputFieldComponent interface is used to define the serialised properties of the InputField component.
 */
export interface SerializedInputFieldComponent
  extends SerializedBaseComponent<
    InputFieldComponentType,
    SerializedInputFieldDependencies,
    InputFieldComponentData,
    InputFieldValidationConfiguration<keyof InputFieldValidationConfigurationMap>
  > {}

/**
 * The InputFieldComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class InputFieldComponent extends BaseComponent<
  SerializedInputFieldComponent,
  SerializedInputFieldDependencies,
  InputFieldDependencies,
  InputFieldComponentData,
  InputFieldValidationConfiguration<keyof InputFieldValidationConfigurationMap>
> {
  private validationStrategies: {
    [K in keyof InputFieldValidationConfigurationMap]: (
      userValue: number | string | undefined | null,
      functionConfig: InputFieldValidationConfiguration<K>
    ) => void;
  } = {
    compareValueFromPath: this.compareToValuesFromPathsValidation.bind(this),
    compareValueFromStatic: this.compareToStaticValuesValidation.bind(this),
    matchAgainstRegExp: this.matchAgainstRegExpValidation.bind(this),
    externalValidation: this.externalValidation.bind(this)
  };
  /**
   * A InputFieldComponent is valid, if the value matches the given validation strategy.
   * @param value
   * @returns
   */
  public validate<K extends keyof InputFieldValidationConfigurationMap>(
    value: number | string | undefined | null
  ) {
    const validationConfiguration = unref(this.validationConfiguration);
    const validationType = <K>validationConfiguration.type;

    const isValid = this.validationStrategies[validationType](
      value,
      <InputFieldValidationConfiguration<K>>validationConfiguration
    );
    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.isValid`,
      value: isValid
    });
  }

  /**
   * Helper function to map serialized operators to actual comparison operations.
   * @param userValue
   * @param referenceValue
   * @param operator
   * @returns
   */
  private compareValues(userValue: any, referenceValue: any, operator: BasicComparisonOperators) {
    switch (operator) {
      case "=":
        return userValue == referenceValue;
      case "==":
        return userValue === referenceValue;
      case "!=":
        return userValue != referenceValue;
      case ">":
        return userValue > referenceValue;
      case "<":
        return userValue < referenceValue;
      case ">=":
        return userValue >= referenceValue;
      case "<=":
        return userValue <= referenceValue;
    }
  }

  /**
   * Validation strategy for comparing a statically defined value to the user input.
   * @param userValue
   * @returns
   */
  private compareToStaticValuesValidation(
    userValue: number | string | undefined | null,
    validationConfiguration: CompareToStaticValuesValidationStrategy
  ) {
    return validationConfiguration.comparisons.every((comparison) => {
      const { value, operator } = comparison;

      return this.compareValues(userValue, value, operator);
    });
  }

  /**
   * Validation strategy for comparing dynamic values from oaths to the user input.
   * @param userValue
   * @returns
   */
  private compareToValuesFromPathsValidation(
    userValue: number | string | undefined | null,
    validationConfiguration: CompareToValuesFromPathsValidationStrategy
  ) {
    return validationConfiguration.comparisons.every((comparison) => {
      const { path, operator } = comparison;
      const value = unref(this.storeObject).getProperty(path);

      return this.compareValues(userValue, value, operator);
    });
  }

  /**
   * Validation strategy utilizing regular expressions.
   * @param userValue
   * @returns
   */
  private matchAgainstRegExpValidation(
    userValue: number | string | undefined | null,
    validationConfiguration: MatchAgainstRegExpValidationStrategy
  ) {
    const { regExp } = validationConfiguration;

    if (userValue === undefined) userValue = "";

    return new RegExp(regExp).test(`${userValue}`);
  }

  /**
   * Validation strategy for using third-party validators via a http request. Expects a boolean response.
   * @param userValue
   * @returns
   */
  private externalValidation(
    userValue: number | string | undefined | null,
    validationConfiguration: ExternalValidationStrategy
  ) {
    userValue;

    return unref(this.storeObject).store?.fetchFromAPI(validationConfiguration.url);
  }
}
