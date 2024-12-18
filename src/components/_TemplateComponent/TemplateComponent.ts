import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentTypeSpecification
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";

/********************************************************************************************************************************************
 * This is a template. Replace TemplateComponent with the name of your component and adjust the properties and dependencies accordingly.
 * The file-naming convention is PascalCase and must match with the name of the component.
 * Vue-3 demands that the component name is a multi-word. If you have a single-word component name, you may add the prefix "Generic".
 * Remove this comment block after you have adjusted the template.
 *********************************************************************************************************************************************/

/**
 * The TemplateComponentProps interface is used to define the properties of the TemplateComponent component.
 */
export interface TemplateComponentProps extends ComponentProps {}

/**
 * The type of the TemplateComponent component.
 */
export type TemplateComponentComponentType = "TemplateComponent";

/**
 * The TemplateComponent-component requires the following dependencies. The paths to the dependencies are defined here via JSONPathExpression.
 */
export interface SerializedTemplateComponentDependencies extends SerialisedDependencies {}

/**
 * The TemplateComponent-component requires the following dependencies. The types of the dependencies are defined here.
 */
export interface TemplateComponentDependencies extends ComponentDependencies {}

/**
 * The SerializedTemplateComponentComponent interface is used to define the serialised properties of the TemplateComponent component.
 */
export interface SerializedTemplateComponentComponent
  extends SerializedBaseComponent<TemplateComponentComponentType> {
  dependencies: SerializedTemplateComponentDependencies;
}

export interface TemplateComponentSpecification extends ComponentTypeSpecification {}

/**
 * The TemplateComponentComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class TemplateComponentComponent extends BaseComponent<TemplateComponentSpecification> {
  /**
   * This function determines when a TemplateComponentComponent is valid and when it is correct.
   * @returns
   */
  public validate() {
    const validity = { isValid: false, isCorrect: false };

    return validity;
  }
}
