<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div
    class="threadContainer nowheel"
    :id="`componentContainer-${props.data.componentId}`"
    :style="{
      width: `${props.data.width}px`,
      height: `${props.data.height}px`
    }"
  >
    <div class="threadContainer__header">
      {{ serialisedComponent.name }}
    </div>
    <div class="threadContainer__body nodrag">
      <component
        class="nodrag"
        :is="serialisedComponent.type"
        :componentID="props.id"
        :storeObject="{
          store: taskGraphStore,
          getProperty: taskGraphStore.getProperty,
          setProperty: taskGraphStore.setProperty
        }"
        :componentPath="`$.nodes.${currentNodeId}.components.${props.id}`"
        @action="$emit('action', $event)"
      >
        <!-- TODO: See if this is really necessary/smart to solve with slots? Only relevant when layout is to be configurable? -->
        <!-- <template
          v-if="serialisedComponent.nestedComponents"
          v-for="nestedComponent in serialisedComponent.nestedComponents"
          :key="nestedComponent.name"
          #[nestedComponent.name]
        >
        </template> -->
      </component>
    </div>

    <NodeResizer
      :min-width="minWidth"
      :min-height="minHeight"
      :lineStyle="{ display: 'none' }"
      @resizeStart="resizeHandler"
      @resize="resizeHandler"
      @resizeEnd="resizeHandler"
    />
  </div>
</template>

<script lang="ts" setup>
import { NodeResizer } from "@vue-flow/node-resizer";
import type { OnResizeStart, OnResize, OnResizeEnd } from "@vue-flow/node-resizer";
import "@vue-flow/node-resizer/dist/style.css";
import type { NodeProps, NodeDragEvent } from "@vue-flow/core";
import { useVueFlow } from "@vue-flow/core";
import { unref, ref, computed } from "vue";
import type { StoreAPI, Layout } from "@/stores/Store";
import type { ComponentEmits } from "@/components/BaseComponent/BaseComponent";

export interface ThreadContainerProps extends NodeProps {
  grid: [number, number];
  storeObject: StoreAPI;
}

defineEmits<ComponentEmits>();
const props = defineProps<ThreadContainerProps>();

const minHeight = unref(props.data.height);
const minWidth = unref(props.data.width);

const [xModifier, yModifier] = props.grid;

const taskGraphStore = props.storeObject;
const currentNodeId = computed(() => taskGraphStore.getProperty("$.currentNode"));
const currentNode = computed(() => taskGraphStore.getProperty(`$.nodes.${unref(currentNodeId)}`));
const layoutSize = computed(() => taskGraphStore.getProperty(`$.layoutSize`));
const serialisedComponent = unref(currentNode).components[props.data.componentId];

const collisionEvaluation = ref({
  hasOccured: false,
  lastValidPosition: { x: props.position.x, y: props.position.y }
});

// TODO: Add collision detection to resizeHandler, once https://github.com/bcakmakoglu/vue-flow/discussions/1627 is resolved
const resizeHandler = (e: OnResizeStart | OnResize | OnResizeEnd) => {
  const { height, width } = e.params;

  taskGraphStore.setProperty({
    path: `$.nodes.${unref(currentNodeId)}.layouts.${unref(layoutSize)}.${props.data.componentId}.width`,
    value: width / xModifier
  });
  taskGraphStore.setProperty({
    path: `$.nodes.${unref(currentNodeId)}.layouts.${unref(layoutSize)}.${props.data.componentId}.height`,
    value: height / yModifier
  });
};

const { onNodeDragStart, onNodeDrag, onNodeDragStop } = useVueFlow();
const nodeDragHandler = (event: NodeDragEvent) => {
  let { x, y } = event.node.position;
  const { height, width } = event.node.dimensions;
  const { id } = event.node;

  const { newX, newY } = collisionCorrection(x, y, width, height, id);

  // set the last valid position of the dragged component
  x = event.node.position.x = newX * xModifier;
  y = event.node.position.y = newY * yModifier;

  // track the last valid position of the dragged component in the taskGraphStore
  taskGraphStore.setProperty({
    path: `$.nodes.${unref(currentNodeId)}.layouts.${unref(layoutSize)}.${id}.x`,
    value: x / xModifier
  });
  taskGraphStore.setProperty({
    path: `$.nodes.${unref(currentNodeId)}.layouts.${unref(layoutSize)}.${id}.y`,
    value: y / yModifier
  });
};
onNodeDragStart(nodeDragHandler);
onNodeDrag(nodeDragHandler);
onNodeDragStop(nodeDragHandler);

const collisionDetection = (
  targetX: number,
  targetY: number,
  draggedComponentWidth: number,
  draggedComponentHeight: number,
  currentId: string
) => {
  const layout: Layout = taskGraphStore.getProperty(
    `$.nodes.${unref(currentNodeId)}.layouts.${unref(layoutSize)}`
  );

  for (const [id, component] of Object.entries(layout)) {
    // skip position of currently dragged component
    if (id === currentId) continue;

    const { x, y, width, height } = component;
    const padding = component.padding ?? 1;
    const lowerBoundX = x - padding;
    const upperBoundX = x + width + padding;
    const lowerBoundY = y - padding;
    const upperBoundY = y + height + padding;

    if (
      targetX + draggedComponentWidth > lowerBoundX &&
      targetX < upperBoundX &&
      targetY + draggedComponentHeight > lowerBoundY &&
      targetY < upperBoundY
    ) {
      // break on first collision
      collisionEvaluation.value.hasOccured = true;
      break;
    } else {
      collisionEvaluation.value.hasOccured = false;
    }
  }

  // only update lastValidPosition if no collision has occured
  if (!collisionEvaluation.value.hasOccured) {
    collisionEvaluation.value.lastValidPosition.x = targetX;
    collisionEvaluation.value.lastValidPosition.y = targetY;
  }

  return collisionEvaluation;
};

const collisionCorrection = (x: number, y: number, width: number, height: number, id: string) => {
  let newX = x / xModifier;
  let newY = y / yModifier;

  const collision = collisionDetection(newX, newY, width / xModifier, height / yModifier, id);
  if (collision.value.hasOccured) {
    newX = <number>collision.value.lastValidPosition.x;
    newY = <number>collision.value.lastValidPosition.y;
  }

  return { newX, newY };
};

// TODO: Implement configurable Handles/Ports (for connecting Containers via edges)
// import type { CSSProperties } from "vue";
// import { Handle, Position } from "@vue-flow/core";
// const targetHandleStyle: CSSProperties = { background: "#555" };
// const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle, top: "10px" };
// const sourceHandleStyleB: CSSProperties = {
//   ...targetHandleStyle,
//   bottom: "10px",
//   top: "auto",
// };
</script>

<style>
/* TODO: Adapt color-scheme https://tailwindcss.com/docs/customizing-colors */

.threadContainer {
  display: flex;
  flex-direction: column;
  background-color: #eff6ff;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.threadContainer__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 5px;
  color: white;
  background-color: var(--q-primary);
  border-bottom: 1px solid rgb(128, 128, 128);
  border-radius: 5px 5px 0 0;
  cursor: move;
}

.threadContainer__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100% - 30px);
  cursor: auto;

  overflow-y: auto;
}

.vue-flow__resize-control.top,
.vue-flow__resize-control.bottom.left {
  display: none;
}

.vue-flow__resize-control.bottom.right {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  padding: none;
  margin: none;
  background-position: 100% 100%;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  border: none;
  background: url("data:image/svg+xml;base64,PHN2ZyBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjYiIGhlaWdodD0iNiI+PHBhdGggZD0iTTYgNkgwVjQuMmg0LjJWMEg2djZ6IiBvcGFjaXR5PSIuMzAyIi8+PC9zdmc+");
}
</style>
