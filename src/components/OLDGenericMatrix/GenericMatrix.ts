// import type {
//   SerializedBaseComponent,
//   SerialisedDependencies,
//   ComponentDependencies,
//   ComponentProps,
//   ComponentData
// } from "@/components/BaseComponent/BaseComponent";
// import { BaseComponent } from "@/components/BaseComponent/BaseComponent";
// import type { JSONPathExpression } from "@/stores/Store";
// import type { ComputedRef } from "vue";
// import { unref } from "vue";

// export interface MatrixProps extends ComponentProps {}

// export type MatrixComponentType = "GenericMatrix";

// export interface SerializedMatrixDependencies extends SerialisedDependencies {
//   Matrix: JSONPathExpression;
//   RowLabel?: JSONPathExpression;
//   ColumnLabel?: JSONPathExpression;
// }

// export interface MatrixDependencies extends ComponentDependencies {}

// export interface MatrixComponentData extends ComponentData {
//   readOnly: boolean;
//   rowLabel: string;
//   columnlabel: string;
// }

// export interface SerializedMatrixComponent
//   extends SerializedBaseComponent<
//     MatrixComponentType,
//     SerializedMatrixDependencies,
//     MatrixComponentData
//   > {}

// export class MatrixComponent extends BaseComponent<
//   SerializedMatrixComponent,
//   SerializedMatrixDependencies,
//   MatrixDependencies,
//   MatrixComponentData
// > {
//   /**
//    * The MatrixComponent class is a derived taskComponent, that allows for displaying Matrices with arbitrary values.
//    */
//   public validate() {
//     let isValid = false;
//     const dependencies = this.loadDependencies();
//     if (unref(unref(dependencies).dotDescription) !== "") isValid = true;
//     unref(this.storeObject).setProperty({
//       path: `${this.serialisedBaseComponentPath}.isValid`,
//       value: isValid
//     });

//     return isValid;
//   }
// }

// /**
//  * The MatrixFieldProps interface is used to define the properties of the MatrixField component.
//  */
// export interface MatrixFieldProps extends ComponentProps {
//   /**
//    * The rowIndex is the index of the row in the matrix.
//    */
//   rowIndex: number;
//   /**
//    * The columnIndex is the index of the column in the matrix.
//    */
//   columnIndex: number;
//   /**
//    * The isReadOnly flag indicates, whether the field is read-only.
//    */
//   isReadOnly: boolean;
//   /**
//    * The element is the value of the field.
//    */
//   element: number;
//   /**
//    * The inputType is the type of the input field.
//    */
//   inputType: string;
//   taskComponent: MatrixComponent;
// }
