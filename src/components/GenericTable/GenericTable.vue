<template>Here goes your custom component HTML</template>

<script lang="ts" setup>
import { toRefs, unref } from "vue";
import { TemplateComponentComponent } from "@/components/_TemplateComponent/TemplateComponent";
import type { TemplateComponentProps } from "@/components/_TemplateComponent/TemplateComponent";

const props = defineProps<TemplateComponentProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new TemplateComponentComponent(
  storeObject,
  unref(componentID),
  unref(componentPath)
);
const componentState = component.getComponentState();
const dependencies = component.loadDependencies();

// Here goes your custom component logic
</script>

<style>
/* Here goes your custom component styles */
</style>
