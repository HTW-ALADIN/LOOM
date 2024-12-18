import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentState,
  ComponentTypeSpecification
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import type { ComputedRef } from "vue";
import { unref } from "vue";

/**
 * The GenericMatrixProps interface is used to define the properties of the GenericMatrix component.
 */
export interface GenericMatrixProps extends ComponentProps {}

/**
 * The type of the GenericMatrix component.
 */
export type GenericMatrixComponentType = "GenericMatrix";

/**
 * TODO: Add description
 */
export interface SerializedGenericMatrixDependencies extends SerialisedDependencies {}

/**
 * TODO: Add description
 */
export interface GenericMatrixDependencies extends ComponentDependencies {}

/**
 * TODO: Add description
 */
export interface GenericMatrixComponentState extends ComponentState {}

/**
 * The SerializedGenericMatrixComponent interface is used to define the serialised properties of the GenericMatrix component.
 */
export interface SerializedGenericMatrixComponent
  extends SerializedBaseComponent<GenericMatrixComponentType> {
  dependencies: SerializedGenericMatrixDependencies;
  state: GenericMatrixComponentState;
}

export interface GenericMatrixSpecification extends ComponentTypeSpecification {
  Dependencies: GenericMatrixDependencies;
  SerializedComponent: SerializedGenericMatrixComponent;
}

/**
 * The GenericMatrixComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class GenericMatrixComponent extends BaseComponent<GenericMatrixSpecification> {
  /**
   * A GenericMatrixComponent is valid, if it has a valid dotDescription.
   * Correctness of the dotDescription is not checked and is assumed to be set statically in the configuration.
   * @returns
   */
  public validate() {
    const validityObject = { isValid: false, isCorrect: false };
    return validityObject;
  }
}
