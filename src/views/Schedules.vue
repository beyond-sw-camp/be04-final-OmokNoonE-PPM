<template>
<div v-if="projectId">
  <ScheduleSheet/>
</div>
<div v-else class="no-dashboard">
  <span>표시할 일정이 없습니다.</span>
</div>
</template>

<script>
import ScheduleSheet from "@/views/ScheduleSheet.vue";
import store from "@/store";
import { useToast } from 'vue-toastification';

export default {
  name: "Billing",
  components: {
    ScheduleSheet
  },
  computed: {
    projectId() {
      return store.getters.projectId;
    }
  },
  mounted() {
    const toast = useToast(); // 토스트 메시지를 사용할 수 있는 toast 객체를 생성합니다.
    if (!this.projectId) {
      toast.warning("표시할 일정이 없습니다."); // projectId가 없는 경우 토스트 메시지를 표시합니다.
    }
  }
};
</script>
<style>
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