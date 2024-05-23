<template>
  <div class="grid-container">
    <PieGraph />
    <ColumnGraph />
    <LineGraph />
    <Gaugegraph/>
  </div>
</template>

<script>
import PieGraph from "@/views/piegraph.vue"
import ColumnGraph from "@/views/columngraph.vue"
import LineGraph from "@/views/linegraph.vue";
import Gaugegraph from "@/views/gaugegraph.vue";

export default {
  components: {
    Gaugegraph,
    PieGraph,
    ColumnGraph,
    LineGraph
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