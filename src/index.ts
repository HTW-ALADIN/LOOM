/**
 * Export LOOM
 */
import LOOM from "@/LOOM/LOOM.vue";
export { LOOM };

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
import GenericButton from "./components/GenericButton/GenericButton.vue";
import GenericForm from "./components/GenericForm/GenericForm.vue";
import CodeEditor from "./components/CodeEditor/CodeEditor.vue";

export const CARPETComponents = { DOTGraph, InputField, GenericButton, GenericForm, CodeEditor };

import type { SerializedDOTGraphComponent } from "./components/DOTGraph/DOTGraph";
import type { SerializedInputFieldComponent } from "./components/InputField/InputField";
import type { SerializedButtonComponent } from "./components/GenericButton/GenericButton";
import type { SerializedFormComponent } from "./components/GenericForm/GenericForm";
import type { SerializedCodeEditorComponent } from "./components/CodeEditor/CodeEditor";
export type SerializedCARPETComponents =
  | SerializedDOTGraphComponent
  | SerializedInputFieldComponent
  | SerializedButtonComponent
  | SerializedFormComponent
  | SerializedCodeEditorComponent;

export interface SerialisedComponents {
  [id: number]: SerializedCARPETComponents;
}

/**
 * Export all types
 */
export * from "./stores/Store";
export * from "./components/BaseComponent/BaseComponent";
export * from "./components/DOTGraph/DOTGraph";
export * from "./components/InputField/InputField";
export * from "./components/GenericButton/GenericButton";
export * from "./components/GenericForm/GenericForm";
export * from "./components/CodeEditor/CodeEditor";
