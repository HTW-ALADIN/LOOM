<script setup lang="ts">
import DOTGraph from "@/components/DOTGraph/DOTGraph.vue";
import { useStore } from "@/stores/Store";

const store = useStore({
  0: {
    type: "DOTGraph",
    name: "Gozintograph",
    isValid: true,
    isCorrect: true,
    dependencies: {
      dotDescription: "$.0.component.dotDescription"
    },
    component: {
      dotDescription: `digraph {            graph [bgcolor="transparent" rankdir="BT" splines="polyline" bgcolor="transparent"]            node [shape="circle" style="filled"]             0 [label="R0" tooltip="2"] 1 [label="R1" tooltip="7"] 2 [label="R2" tooltip="3"] 3 [label="K0" tooltip="4"] 4 [label="R3" tooltip="8"] 5 [label="B0" tooltip="4"] 6 [label="B1" tooltip="4"] 7 [label="B2" tooltip="8"] 8 [label="P0" tooltip="7"] 9 [label="P1" tooltip="2"]            edge []             2 -> 5 [label="2"] 0 -> 6 [label="2"] 2 -> 6 [label="6"] 4 -> 7 [label="3"] 5 -> 7 [label="8"] 6 -> 7 [label="5"] 0 -> 8 [label="6"] 1 -> 8 [label="7"] 1 -> 9 [label="2"] 3 -> 9 [label="4"] 5 -> 9 [label="9"] 6 -> 9 [label="8"] 7 -> 9 [label="6"]        { rank=max; 8;9 } }`
    }
  }
});
</script>

<template>
  <h2>Stuff</h2>
  hisad

  <div>
    Hi
    <DOTGraph :storeObject="store" :componentID="1" :componentPath="'$.0'" :graphID="1" />
  </div>
</template>

<style scoped></style>
