<template>
  <div class="grid-container" v-if="projectId">
    <ColumnGraph/>
    <PieGraph/>
    <LineGraph/>
    <GaugeGraph/>
  </div>
  <div v-else class="no-dashboard">
    <span>표시할 데이터가 없습니다.</span>
  </div>
</template>

<script>
import ColumnGraph from "@/views/components/ColumnGraph.vue"
import PieGraph from "@/views/components/PieGraph.vue"
import LineGraph from "@/views/components/LineGraph.vue";
import GaugeGraph from "@/views/components/GaugeGraph.vue";
import store from "@/store";
import { useToast } from 'vue-toastification'; // vue-toastification 라이브러리에서 useToast 함수를 가져옵니다.

export default {
  components: {
    ColumnGraph,
    PieGraph,
    LineGraph,
    GaugeGraph
  },
  computed: {
    projectId() {
      return store.getters.projectId;
    }
  },
  mounted() {
    const toast = useToast(); // 토스트 메시지를 사용할 수 있는 toast 객체를 생성합니다.
    if (!this.projectId) {
      toast.warning("표시할 데이터가 없습니다."); // projectId가 없는 경우 토스트 메시지를 표시합니다.
    }
  }
}
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  width: 70%;
  height: 70%;
}
.no-dashboard {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #868e96;
  width: 90%;
  height: 80vh;
}
</style>