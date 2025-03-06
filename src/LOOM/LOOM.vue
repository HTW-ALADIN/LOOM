<template>
  <div class="loom">
    <VueFlow
      :nodes="componentContainers"
      :edges="[]"
      :class="darkMode ? 'dark' : ''"
      class="basic-flow"
      :default-viewport="{ zoom: 1.0 }"
      :min-zoom="0.1"
      :max-zoom="10"
      :snap-to-grid="true"
      :snap-grid="grid"
      :fit-view-on-init="true"
    >
      <Background pattern-color="#aaa" :gap="30" />
      <ControlBar v-if="showControlBar" :darkMode @update:dark-mode="$emit('update:darkMode')" />
      <MiniMap v-if="showMiniMap" />

      <template #node-ThreadContainer="nodeProps">
        <ThreadContainer
          v-bind="nodeProps"
          :grid
          :store-object="taskGraphStore"
          @action="$emit('action', $event)"
        />
      </template>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { VueFlow } from "@vue-flow/core";

import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";
import ControlBar from "./ControlBar.vue";
import { computed, unref, watch } from "vue";

import ThreadContainer from "./ThreadContainer.vue";
import type {
  SerializedCARPETComponents,
  StoreAPI,
  LayoutSizes,
  Layouts
} from "carpet-component-library";

import type { SerialisedComponents } from "@/index";

const props = defineProps<{
  storeObject: StoreAPI;
  layoutSize: LayoutSizes;
  currentNodeId: string;
  grid: [number, number];
  darkMode?: boolean;
  showControlBar?: boolean;
  showMiniMap?: boolean;
}>();

defineEmits(["update:darkMode", "action"]);

const taskGraphStore = props.storeObject;
const { getProperty, setProperty } = taskGraphStore;

interface ComponentContainer {
  id: string;
  position: { x: number; y: number };
  data: object;
  type: string;
}

const currentNode = computed(() => getProperty(`$.nodes.${props.currentNodeId}`));

const componentContainers = computed(() => {
  const layouts = <Layouts>unref(currentNode).layouts;
  const layout = layouts[props.layoutSize];

  return Object.entries(layout).reduce((containers, [id, component]) => {
    const { x, y, height, width } = component;

    const [xModifier, yModifier] = props.grid;
    return [
      ...containers,
      {
        id: id.toString(),
        position: { x: x * xModifier, y: y * yModifier },
        data: {
          height: height * yModifier,
          width: width * xModifier,
          componentId: id
        },
        type: "ThreadContainer"
      }
    ];
  }, [] as Array<ComponentContainer>);
});

const components = computed(
  () => <SerialisedComponents>getProperty(`$.nodes.${props.currentNodeId}.components`)
);

const validateTaskNode = () => {
  const isCorrect = (<Array<SerializedCARPETComponents>>Object.values(unref(components))).every(
    (component) => component.state.isCorrect
  );
  const isValid = (<Array<SerializedCARPETComponents>>Object.values(unref(components))).every(
    (component) => component.state.isValid
  );

  return { isValid, isCorrect };
};

watch(
  () => components,
  () => {
    setTimeout(() => {
      const { isValid, isCorrect } = validateTaskNode();
      setProperty({
        path: `$.nodes.${props.currentNodeId}.state.isValid`,
        value: isValid
      });
      setProperty({
        path: `$.nodes.${props.currentNodeId}.state.isCorrect`,
        value: isCorrect
      });
    }, 50);
  },
  { deep: true }
);

// TODO: Implement tracking of Pane handling (see https://vueflow.dev/guide/utils/instance.html)
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.2/dist/style.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.2/dist/theme-default.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css";

.loom {
  height: 100%;
  width: 100%;
}

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.basic-flow.dark {
  background: #2d3748;
  color: #fffffb;
}

.basic-flow.dark .vue-flow__node {
  background: #4a5568;
  color: #fffffb;
}

.basic-flow.dark .vue-flow__node.selected {
  background: #333;
  box-shadow: 0 0 0 2px #2563eb;
}

.basic-flow .vue-flow__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.basic-flow.dark .vue-flow__controls {
  border: 1px solid #fffffb;
}

.basic-flow .vue-flow__controls .vue-flow__controls-button {
  border: none;
  border-right: 1px solid #eee;
}

.basic-flow .vue-flow__controls .vue-flow__controls-button svg {
  height: 100%;
  width: 100%;
}

.basic-flow.dark .vue-flow__controls .vue-flow__controls-button {
  background: #333;
  fill: #fffffb;
  border: none;
}

.basic-flow.dark .vue-flow__controls .vue-flow__controls-button:hover {
  background: #4d4d4d;
}

.basic-flow.dark .vue-flow__edge-textbg {
  fill: #292524;
}

.basic-flow.dark .vue-flow__edge-text {
  fill: #fffffb;
}

.vue-flow__minimap {
  border: 1px solid #333;
  border-radius: 4px;
}
</style>
