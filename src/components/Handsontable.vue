<template>
  <div ref="hot"></div>
</template>
<script>
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
export default {
  name: 'Handsontable',
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.hot = new Handsontable(this.$refs.hot, this.settings);
  },
  beforeUnmount() {
    if (this.hot) {
      this.hot.destroy();
    }
  }
};
</script>
<style scoped>
@import 'handsontable/dist/handsontable.full.css';
</style>
