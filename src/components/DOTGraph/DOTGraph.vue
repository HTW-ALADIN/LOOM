<template>
  <div class="dotGraph" :style="props.style ?? {}" :id="completeGraphID"></div>
</template>

<script lang="ts" setup>
import { onMounted, watch, toRefs, unref } from "vue";
import { DOTGraphComponent } from "@/components/DOTGraph/DOTGraph";
import type { DOTGraphProps } from "@/components/DOTGraph/DOTGraph";
import * as d3 from "d3";
import { graphviz } from "d3-graphviz";

const props = defineProps<DOTGraphProps>();
const { storeObject, componentID, componentPath, graphID } = toRefs(props);

const component = new DOTGraphComponent(storeObject, unref(componentID), unref(componentPath));
const componentData = component.getComponentData();
const dependencies = component.loadDependencies();

const completeGraphID = unref(graphID)
  ? `graph_${unref(componentID)}_${unref(graphID)}`
  : `graph_${unref(componentID)}_default`;

const getDOTDescription = () => {
  const dependencies = component.loadDependencies();
  if (unref(unref(dependencies).dotDescription)) return unref(unref(dependencies).dotDescription);
  if (unref(componentData) && unref(componentData).dotDescription)
    return unref(componentData).dotDescription;
  return "";
};

const renderGraph = (description: string) => {
  const transitionEffect = () => {
    return d3.transition("animateGraph").duration(150).ease(d3.easeLinear);
  };

  graphviz(`#${completeGraphID}`, {
    fit: true,
    zoom: false,
    useWorker: false
  })
    .transition(() => transitionEffect() as any)
    .renderDot(description);
};

const renderIfGraph = () => {
  let dotDescription = "";
  if (component.validate()) {
    dotDescription = (<string>getDOTDescription()) as string;
  }
  renderGraph(dotDescription);
};

watch(
  () => dependencies.value.DOTGraph,
  () => {
    renderIfGraph();
  }
);

onMounted(() => {
  renderIfGraph();
});
</script>

<style>
.dotGraph {
  display: flex;
  justify-items: center;
  align-content: center;
  width: 100%;
  height: 100%;
}

.dotGraph > svg {
  display: flex;
  justify-items: center;
  align-content: center;
  width: 100%;
  height: 100%;
}

.graph {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
