/**
 * Export Base Component
 */
import { BaseComponent } from "./components/BaseComponent/BaseComponent";
export { BaseComponent };

/**
 * Export all Vue-components
 */
import DOTGraph from "./components/DOTGraph/DOTGraph.vue";
import InputField from "./components/InputField/InputField.vue";

export const CARPETComponents = { DOTGraph, InputField };

import type { SerializedDOTGraphComponent } from "./components/DOTGraph/DOTGraph";
import type { SerializedInputFieldComponent } from "./components/InputField/InputField";
export type SerializedCARPETComponents =
  | SerializedDOTGraphComponent
  | SerializedInputFieldComponent;

/**
 * Export all types
 */
export * from "./components/DOTGraph/DOTGraph";
export * from "./stores/Store";
export * from "./components/BaseComponent/BaseComponent";
export * from "./components/InputField/InputField";
