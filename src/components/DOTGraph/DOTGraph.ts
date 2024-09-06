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

export interface DOTGraphProps extends ComponentProps {
  graphID?: string | number;
}

export type DOTGraphComponentType = "DOTGraph";

export interface SerializedDOTGraphDependencies extends SerialisedDependencies {
  dotDescription?: JSONPathExpression;
}

export interface DOTGraphDependencies extends ComponentDependencies {
  dotDescription?: ComputedRef<string>;
}

export interface DotGraphComponentData extends ComponentData {
  dotDescription?: string;
}

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
