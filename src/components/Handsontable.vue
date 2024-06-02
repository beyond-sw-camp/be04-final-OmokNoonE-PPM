<template>
  <div ref="hot"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

export default defineComponent({
  name: 'HandsontableComponent',
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const hot = ref<HTMLElement | null>(null);
    const hotInstance = ref<Handsontable | null>(null);

    onMounted(() => {
      if (hot.value) {
        hotInstance.value = new Handsontable(hot.value, props.settings);
      }
    });

    onBeforeUnmount(() => {
      if (hotInstance.value) {
        hotInstance.value.destroy();
      }
    });

    return {
      hot
    };
  }
});
</script>

<style scoped>
@import 'handsontable/dist/handsontable.full.css';
</style>
