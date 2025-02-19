import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentState,
  ComponentTypeSpecification,
  ComponentConfiguration,
  ValidationStrategy,
  ValidationConfigurationMap,
  ValidationConfiguration
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import type { SupportedLanguages } from "@/components/CodeEditor/SupportedLanguages";

/**
 * The CodeEditorProps interface is used to define the properties of the CodeEditor component.
 */
export interface CodeEditorProps extends ComponentProps {}

/**
 * The type of the CodeEditor component.
 */
export type CodeEditorComponentType = "CodeEditor";

/**
 * The CodeEditor-component requires the following dependencies. The paths to the dependencies are defined here via JSONPathExpression.
 */
export interface SerializedCodeEditorDependencies extends SerialisedDependencies {
  /**
   * The globalDarkMode-property is a JSONPathExpression that may point to the user's dark mode preference.
   */
  globalDarkMode?: JSONPathExpression;
  /**
   * The code-property is a JSONPathExpression that may point to the user's code.
   */
  code?: JSONPathExpression;
  /**
   * The referenceCode-property is a JSONPathExpression that points to the reference code that the user's code will be compared against.
   */
  referenceCode?: JSONPathExpression;
}

/**
 * The CodeEditor-component requires the following dependencies. The types of the dependencies are defined here.
 */
export interface CodeEditorDependencies extends ComponentDependencies {
  /**
   * The globalDarkMode-property is a boolean that may be used to determine the dark mode of the CodeEditor.
   */
  globalDarkMode?: boolean | undefined;
  /**
   * The code-property is a string that may contains the user's code.
   */
  code?: string;
  /**
   * The referenceCode-property is a string that mcontains the reference code that the user's code may be compared against.
   */
  referenceCode?: string;
}

/**
 * The CodeEditor-component may require state handling. This state is defined here.
 */
export interface CodeEditorComponentState extends ComponentState {
  /**
   * The code-property is a string that contains the user's code.
   */
  code: string;
}

/**
 * The CodeEditor-component may have configuration options. These options are defined here.
 */
export interface CodeEditorConfiguration extends ComponentConfiguration {
  /**
   * The darkMode-property is a boolean that may be used to determine the dark mode of the CodeEditor.
   */
  darkMode?: boolean;
  /**
   * The language-property is a string that may be used to determine the syntax highlighting of the CodeEditor.
   */
  language?: SupportedLanguages;
}

/**
 * The CodeEditor allows for optional validation strategies.
 * The first strategy is a basic string compare.
 * The second strategy is a request-based strategy, which may depend on a user-defined strategy (e.g. test-suite, output comparisons, more complex string comparisons, etc.).
 *    As the second strategy may depend on more than just the code, the entire state is accessible.
 */
export type CodeEditorValidationConfiguration<
  K extends keyof CodeEditorValidationConfigurationMap
> = { [P in K]: { type: P } & CodeEditorValidationConfigurationMap[P] }[K] &
  ValidationConfiguration;

export interface StringComparison extends ValidationStrategy {
  type: "compareToString";
}

export interface ExternalValidation extends ValidationStrategy {
  type: "validateExternally";
}

/**
 * Map of all available validation strategies for the CodeEditor component.
 */
interface CodeEditorValidationConfigurationMap extends ValidationConfigurationMap {
  validateExternally: ExternalValidation;
  compareToString: StringComparison;
}

/**
 * The SerializedCodeEditorComponent interface is used to define the serialised properties of the CodeEditor component.
 */
export interface SerializedCodeEditorComponent
  extends SerializedBaseComponent<CodeEditorComponentType> {
  dependencies: SerializedCodeEditorDependencies;
  state: CodeEditorComponentState;
  componentConfiguration?: CodeEditorConfiguration;
  validationConfiguration?: CodeEditorValidationConfiguration<
    keyof CodeEditorValidationConfigurationMap
  >;
}

export interface CodeEditorSpecification extends ComponentTypeSpecification {
  SerializedComponent: SerializedCodeEditorComponent;
  Dependencies: CodeEditorDependencies;
}

/**
 * The CodeEditorComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class CodeEditorComponent extends BaseComponent<CodeEditorSpecification> {
  private validationStrategies: {
    [K in keyof CodeEditorValidationConfigurationMap]: (
      taskState: string,
      functionConfig: CodeEditorValidationConfiguration<K>
    ) => boolean;
  } = {
    validateExternally: this.externalValidation.bind(this),
    compareToString: this.stringComparison.bind(this)
  };
  /**
   * This function determines when a CodeEditorComponent is valid and when it is correct.
   * @returns
   */
  public validate(userCode: string) {
    const validity = { isValid: false, isCorrect: false };

    return validity;
  }

  private externalValidation(userCode: string, validationConfiguration: ExternalValidation) {
    return true;
  }
  private stringComparison(userCode: string, validationConfiguration: StringComparison) {
    return true;
  }
}
