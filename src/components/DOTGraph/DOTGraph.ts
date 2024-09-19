import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentData
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import type { ComputedRef } from "vue";
import { unref } from "vue";

/**
 * The DOTGraphProps interface is used to define the properties of the DOTGraph component.
 */
export interface DOTGraphProps extends ComponentProps {
  graphID?: string | number;
}

/**
 * The type of the DOTGraph component.
 */
export type DOTGraphComponentType = "DOTGraph";

/**
 * The DOTGraph-component requires a valid dotDescription to display.
 */
export interface SerializedDOTGraphDependencies extends SerialisedDependencies {
  dotDescription: JSONPathExpression;
}

/**
 * The DOTGraph-component requires a valid dotDescription to display.
 */
export interface DOTGraphDependencies extends ComponentDependencies {
  dotDescription: ComputedRef<string>;
}

/**
 * The DOTGraph-component may hold a static dotDescription in its componentData.
 */
export interface DotGraphComponentData extends ComponentData {
  dotDescription?: string;
}

/**
 * The SerializedDOTGraphComponent interface is used to define the serialised properties of the DOTGraph component.
 */
export interface SerializedDOTGraphComponent
  extends SerializedBaseComponent<
    DOTGraphComponentType,
    SerializedDOTGraphDependencies,
    DotGraphComponentData
  > {}

/**
 * The DOTGraphComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class DOTGraphComponent extends BaseComponent<
  SerializedDOTGraphComponent,
  SerializedDOTGraphDependencies,
  DOTGraphDependencies,
  DotGraphComponentData
> {
  /**
   * A DOTGraphComponent is valid, if it has a valid dotDescription.
   * @returns
   */
  public validate() {
    let isValid = false;
    const dependencies = this.loadDependencies();
    if (unref(unref(dependencies).dotDescription) !== "") isValid = true;
    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.isValid`,
      value: isValid
    });

    return isValid;
  }
}
