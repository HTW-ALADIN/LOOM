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
import type { IconList } from "@/Util/IconList";

/**
 * The ButtonProps interface is used to define the properties of the Button component.
 */
export interface ButtonProps extends ComponentProps {
  isValid: boolean;
}

/**
 * The Button component emitts an event on click.
 */
export type ButtonEmits = { buttonClick: [] };

/**
 * The type of the Button component.
 */
export type ButtonComponentType = "GenericButton";

/**
 * The Button-component has no dependencies.
 */
export interface SerializedButtonDependencies extends SerialisedDependencies {}

/**
 * The Button-component has no dependencies
 */
export interface ButtonDependencies extends ComponentDependencies {}

/**
 * The ButtonConfiguration defines the look and behavior of the button.
 */
export interface ButtonConfiguration extends ComponentConfiguration {
  /**
   * Additional icon for the button. Displayed to the left of the label.
   */
  icon?: IconList;
  /**
   * The dimensions of the button in pixels. Defaults to 100x50.
   */
  dimensions?: {
    width: number;
    height: number;
  };
  /**
   * Determines wether the button will be disabled if the validation fails.
   */
  disableOnInvalid?: boolean;
}

/**
 * The Button-component has to display a label. It may display a progress bar or a loading spinner.
 * It can be disabled on invalid input.
 */
export interface ButtonComponentState extends ComponentState {
  /**
   * The label of the button.
   */
  label: string;
  /**
   * The loadingState of the button. If true, the button will display a loading spinner.
   */
  loadingState: boolean | undefined;
  /**
   * The progress of the button. If set, the button will display a progress bar.
   */
  progressPercentage?: number | undefined | null;
}

/**
 * The SerializedButtonComponent interface is used to define the serialised properties of the Button component.
 */
export interface SerializedButtonComponent extends SerializedBaseComponent<ButtonComponentType> {
  dependencies: SerializedButtonDependencies;
  state: ButtonComponentState;
  componentConfiguration: ButtonConfiguration;
}

export interface ButtonSpecification extends ComponentTypeSpecification {
  SerializedComponent: SerializedButtonComponent;
  Dependencies: ButtonDependencies;
}

/**
 * The ButtonComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class ButtonComponent extends BaseComponent<ButtonSpecification> {
  /**
   * A ButtonComponent is valid, if the parent element has decided it is valid.
   * @returns
   */
  public validate(isValid: boolean) {
    return { isValid: isValid, isCorrect: true };
  }
}
