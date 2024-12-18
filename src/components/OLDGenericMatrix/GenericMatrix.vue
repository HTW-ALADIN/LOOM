<!-- <template>
  <table :id="`matrix_${id}`" class="matrix">
    <tr v-if="columnLabel && columnLabel.length">
      <p class="placeholder">&nbsp;</p>
      <th v-for="(label, i) in columnLabel" :key="i">
        <p class="matrix_label column_label">{{ label }}</p>
      </th>
    </tr>
    <tr v-for="(row, i) in userData" :key="i">
      <th v-if="rowLabel && rowLabel.length">
        <p class="matrix_label row_label">{{ rowLabel[i] }}</p>
      </th>
      <td class="matrix_element" v-for="(element, j) in userData[i]" :key="j">
        <MatrixField
          :rowIndex="i"
          :columnIndex="j"
          :storeObject="storeObject"
          :componentID="id"
          :isReadOnly="isReadOnly"
          :element="element"
          :inputType="inputType ?? 'number'"
        />
      </td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import type { MatrixProps } from "@/components/GenericMatrix/GenericMatrix";

const props = defineProps<MatrixProps>();
const { store, getProperty, setProperty } = props.storeObject;
</script>

<style></style> -->
