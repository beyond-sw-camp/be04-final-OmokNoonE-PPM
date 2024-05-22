<template>
  <div id="example">
    <Handsontable :settings="hotSettings"></Handsontable>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import HandsontableComponent from '../components/Handsontable.vue';
import 'handsontable/dist/handsontable.full.css';
import { getData } from '../utils/constants';
import { alignHeaders, addClassesToRows } from '../utils/hooks-callbacks';
export default defineComponent({
  name: 'DataGrid',
  components: {
    Handsontable: HandsontableComponent
  },
  data() {
    return {
      hotSettings: {
        data: getData(),
        colHeaders: [
          'Company name',
          'Name',
          'Sell date',
          'In stock',
          'Qty',
          'Order ID',
          'Country'
        ],
        columns: [
          { data: 1, type: 'text' },
          { data: 3, type: 'text' },
          {
            data: 4,
            type: 'date',
            allowInvalid: false
          },
          {
            data: 6,
            type: 'checkbox',
            className: 'htCenter'
          },
          {
            data: 7,
            type: 'numeric'
          },
          { data: 5, type: 'text' },
          { data: 2, type: 'text' }
        ],
        licenseKey: 'non-commercial-and-evaluation',
        rowHeaders: true,
        dropdownMenu: true,
        hiddenColumns: {
          indicators: true
        },
        contextMenu: true,
        multiColumnSorting: true,
        filters: true,
        colWidths: [170, 222, 130, 120, 120, 130, 156],
        afterGetColHeader: alignHeaders,
        beforeRenderer: addClassesToRows
      }
    };
  }
});
</script>
<style lang="scss">
/*
  A stylesheet customizing app (custom renderers)
*/
table.htCore {
  tr.odd td {
    background: #FAFBFF;
  }
}
/*
  A stylesheet customizing Handsontable style
*/
.handsontable {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;
  .collapsibleIndicator {
    text-align: center;
  }
}
</style>
