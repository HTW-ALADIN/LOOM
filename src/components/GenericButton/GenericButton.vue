<template>
  <QBtn
    :loading="componentData.loadingState"
    :percentage="progressPercentage"
    color="primary"
    @click="$emit('buttonClick')"
    :style="`width: ${buttonConfiguration.dimensions ? buttonConfiguration.dimensions.width : 100}px; height: ${buttonConfiguration.dimensions ? buttonConfiguration.dimensions.height : 50}px;`"
    :icon="buttonConfiguration.icon"
    :disable="buttonConfiguration.disableOnInvalid && !isValid ? true : undefined"
  >
    {{ componentData.label }}
    <template v-slot:loading>
      <QSpinnerHourglass class="on-left"> </QSpinnerHourglass>
    </template>
  </QBtn>
</template>

<script lang="ts" setup>
import { toRefs, unref, ref } from "vue";
import { ButtonComponent } from "@/components/GenericButton/GenericButton";
import type { ButtonProps, ButtonEmits } from "@/components/GenericButton/GenericButton";

import { QBtn, QSpinnerHourglass } from "quasar";

defineEmits<ButtonEmits>();
const props = defineProps<ButtonProps>();
const { storeObject, componentID, componentPath, isValid } = toRefs(props);

const component = new ButtonComponent(storeObject, unref(componentID), unref(componentPath));
const componentData = component.getComponentData();
const buttonConfiguration = unref(componentData).buttonConfiguration;

const progressPercentage = ref(<number | undefined>unref(componentData).progressPercentage);
</script>

<style></style>
