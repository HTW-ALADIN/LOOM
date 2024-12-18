<template>
  <!-- TODO: Add Diff-Editor. https://microsoft.github.io/monaco-editor/ https://github.com/imguolao/monaco-vue?tab=readme-ov-file -->

  <VueMonacoEditor
    :value="code"
    @change="updateCode"
    :theme="isDarkMode ? 'vs-dark' : 'vs'"
    :language="editorConfiguration?.language"
  ></VueMonacoEditor>
</template>

<script lang="ts" setup>
import { toRefs, unref, watch, ref } from "vue";
import type { Ref } from "vue";
import { CodeEditorComponent } from "@/components/CodeEditor/CodeEditor";
import type { CodeEditorProps } from "@/components/CodeEditor/CodeEditor";

import { loader } from "@guolao/vue-monaco-editor";
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"
  }
});
import { VueMonacoEditor } from "@guolao/vue-monaco-editor";

const props = defineProps<CodeEditorProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new CodeEditorComponent(storeObject, unref(componentID), unref(componentPath));
const componentState = component.getComponentState();
const dependencies = component.getDependencies();
const editorConfiguration = component.getComponentConfiguration();

const isDarkMode: Ref<boolean | undefined> = ref(
  unref(dependencies).darkMode ?? unref(editorConfiguration)?.darkMode ?? false
);

const code = ref(unref(dependencies).code ?? componentState.value.code ?? "");
const updateCode = (code: string) => {
  unref(storeObject).setProperty({ path: `${unref(componentPath)}.state.code`, value: code });
};

watch(
  () => dependencies.value.darkMode,
  (newValue) => {
    isDarkMode.value = newValue;
  }
);

watch(
  () => componentState.value.code,
  (newValue) => {
    code.value = newValue;
  }
);

watch(
  () => dependencies.value.code,
  (newValue) => {
    code.value = <string>newValue;
  }
);
</script>

<style></style>
