<template>
  <div class="form">
    <div
      class="form_elements"
      v-for="(formFieldComponent, formFieldName) of nestedComponents.formComponents"
      :key="formFieldName"
    >
      <component
        :is="formFieldComponent.type"
        :storeObject="storeObject"
        :componentID="formFieldName"
        :componentPath="`${componentPath}.nestedComponents.formComponents.${formFieldName}`"
      />
    </div>
    <div
      class="actions"
      v-for="(actionComponent, actionName) of nestedComponents.actionComponents"
      :key="actionName"
    >
      <component
        :is="actionComponent.type"
        :storeObject="storeObject"
        :componentID="actionName"
        :componentPath="`${componentPath}.nestedComponents.actionComponents.${actionName}`"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, unref } from "vue";
import { FormComponent } from "@/components/GenericForm/Form";
import type { FormProps } from "@/components/GenericForm/Form";

const props = defineProps<FormProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new FormComponent(storeObject, unref(componentID), unref(componentPath));
const componentData = component.getComponentData();
const dependencies = component.loadDependencies();

const nestedComponents = component.getNestedComponents();
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.form_elements {
  display: flex;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
