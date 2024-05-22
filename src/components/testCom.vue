<template>
  <div id="example1">
    <hot-table :settings="hotSettings"></hot-table>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import router from "@/router";

// register Handsontable's modules
registerAllModules();

const ExampleComponent = defineComponent({
  data() {
    return {
      hotSettings: {
        data:
            [
              ['A1', 'https://handsontable.com/docs/img/examples/professional-javascript-developers-nicholas-zakas.jpg'],
              ['A2', 'https://handsontable.com/docs/img/examples/javascript-the-good-parts.jpg']
            ],
        columns: [
          {},
          {
            renderer(instance, td, row, col, prop, value) {
              const img = document.createElement('img');

              img.src = value;

              img.addEventListener('mousedown', () => {
                router.push("billing");
              });

              td.innerText = '';
              td.appendChild(img);

              return td;
            }
          }
        ],
        colHeaders: true,
        rowHeights: 55,
        height: 'auto',
        autoWrapRow: true,
        autoWrapCol: true,
        licenseKey: 'non-commercial-and-evaluation'
      }
    };
  },
  components: {
    HotTable,
  }
});

export default ExampleComponent;
</script>


<style scoped>

</style>
