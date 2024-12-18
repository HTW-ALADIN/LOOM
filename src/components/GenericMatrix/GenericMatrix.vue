<template>
  <div></div>
</template>

<script lang="ts" setup>
import { onMounted, watch, toRefs, unref } from "vue";
import { GenericMatrixComponent } from "@/components/GenericMatrix/GenericMatrix";
import type { GenericMatrixProps } from "@/components/GenericMatrix/GenericMatrix";

const props = defineProps<GenericMatrixProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new GenericMatrixComponent(storeObject, unref(componentID), unref(componentPath));
const componentState = component.getComponentState();
const dependencies = component.loadDependencies();
</script>

<style></style>
