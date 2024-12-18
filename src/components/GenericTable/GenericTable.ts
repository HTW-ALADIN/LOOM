import type {
  SerializedBaseComponent,
  SerialisedDependencies,
  ComponentDependencies,
  ComponentProps,
  ComponentTypeSpecification
} from "@/components/BaseComponent/BaseComponent";
import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";

/**
 * The TableProps interface is used to define the properties of the Table component.
 */
export interface TableProps extends ComponentProps {}

/**
 * The type of the Table component.
 */
export type TableComponentType = "Table";

/**
 * The Table-component requires the following dependencies. The paths to the dependencies are defined here via JSONPathExpression.
 */
export interface SerializedTableDependencies extends SerialisedDependencies {}

/**
 * The Table-component requires the following dependencies. The types of the dependencies are defined here.
 */
export interface TableDependencies extends ComponentDependencies {}

/**
 * The SerializedTableComponent interface is used to define the serialised properties of the Table component.
 */
export interface SerializedTableComponent extends SerializedBaseComponent<TableComponentType> {
  dependencies: SerializedTableDependencies;
}

export interface TableSpecification extends ComponentTypeSpecification {}

/**
 * The TableComponent class is a derived taskComponent, that displays a Graph specified in the Graphviz-DOT language.
 */
export class TableComponent extends BaseComponent<TableSpecification> {
  /**
   * This function determines when a TableComponent is valid and when it is correct.
   * @returns
   */
  public validate() {
    const validity = { isValid: false, isCorrect: false };

    return validity;
  }
}
