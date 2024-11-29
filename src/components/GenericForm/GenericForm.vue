<template>
  <div class="form">
    <div
      class="form__elements"
      v-for="(formFieldComponent, formFieldId) of nestedComponents.formComponents"
      :key="formFieldId"
    >
      <component
        :class="`form__elements-${formFieldId}`"
        :is="formFieldComponent.type"
        :storeObject="storeObject"
        :componentID="formFieldId"
        :componentPath="`${componentPath}.nestedComponents.formComponents.${formFieldId}`"
      />
    </div>
    <div class="form__actions">
      <component
        class="form__actions-submit"
        :is="nestedComponents.actionComponents.submit.type"
        :storeObject="storeObject"
        componentID="submit"
        :componentPath="`${componentPath}.nestedComponents.actionComponents.submit`"
        :isValid="validationResult[formIsSubmitableWhen]"
        @buttonClick="submitActionHandler"
      />
      <!-- TODO: implement optional reset action -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, unref, watch, ref } from "vue";
import { FormComponent } from "@/components/GenericForm/GenericForm";
import type { FormProps, ValidationResult } from "@/components/GenericForm/GenericForm";

const props = defineProps<FormProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new FormComponent(storeObject, unref(componentID), unref(componentPath));
const dependencies = component.loadDependencies();
const nestedComponents = component.getNestedComponents();

const validationResult = ref(component.validate());
const formIsSubmitableWhen: keyof ValidationResult = unref(storeObject).getProperty(
  `${unref(componentPath)}.validationConfiguration.submitableWhen`
);

const submitActionHandler = () => {
  console.warn("ACTION SUBMITTED");
  // TODO: implement submit action handler
  window.alert("Form submitted.");
};

/**
 * Watch for changes in external dependencies to validate the form.
 */
watch(
  () => dependencies,
  () => {
    validationResult.value = component.validate();
  },
  { deep: true, immediate: true }
);
/**
 * Watch for changes in the form fields to validate the form.
 */
watch(
  () => nestedComponents,
  () => {
    validationResult.value = component.validate();
  },
  { deep: true, immediate: true }
);
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
}

.form_elements {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: flex-end;

  justify-content: space-around;
  align-items: center;
}
</style>
