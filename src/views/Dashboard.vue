<template>
  <div class="grid-container">
    <ColumnGraph />
    <PieGraph />
    <LineGraph />
    <Gaugegraph/>
  </div>
</template>

<script>
import PieGraph from "@/views/components/PieGraph.vue"
import ColumnGraph from "@/views/components/ColumnGraph.vue"
import LineGraph from "@/views/components/LineGraph.vue";
import Gaugegraph from "@/views/components/GaugeGraph.vue";

export default {
  components: {
    ColumnGraph,
    PieGraph,
    LineGraph,
    Gaugegraph
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
}
</style>