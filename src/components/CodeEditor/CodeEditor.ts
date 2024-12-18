import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentState,
  ComponentTypeSpecification,
  ComponentConfiguration
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
  globalDarkMode?: JSONPathExpression;
  code?: JSONPathExpression;
}

/**
 * The CodeEditor-component requires the following dependencies. The types of the dependencies are defined here.
 */
export interface CodeEditorDependencies extends ComponentDependencies {
  globalDarkMode?: boolean | undefined;
  code?: string;
}

/**
 * The CodeEditor-component may require state handling. This state is defined here.
 */
export interface CodeEditorComponentState extends ComponentState {
  code: string;
}

/**
 * The CodeEditor-component may have configuration options. These options are defined here.
 */
export interface CodeEditorConfiguration extends ComponentConfiguration {
  darkMode?: boolean;
  language?: SupportedLanguages;
}

/**
 * The SerializedCodeEditorComponent interface is used to define the serialised properties of the CodeEditor component.
 */
export interface SerializedCodeEditorComponent
  extends SerializedBaseComponent<CodeEditorComponentType> {
  dependencies: SerializedCodeEditorDependencies;
  state: CodeEditorComponentState;
  componentConfiguration?: CodeEditorConfiguration;
}

export interface CodeEditorSpecification extends ComponentTypeSpecification {
  SerializedComponent: SerializedCodeEditorComponent;
  Dependencies: CodeEditorDependencies;
}

/**
 * The CodeEditorComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class CodeEditorComponent extends BaseComponent<CodeEditorSpecification> {
  /**
   * This function determines when a CodeEditorComponent is valid and when it is correct.
   * @returns
   */
  public validate() {
    const validity = { isValid: false, isCorrect: false };

    return validity;
  }
}
