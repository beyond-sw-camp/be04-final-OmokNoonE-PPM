<template>
<div >
  <ScheduleSheet/>
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

</style>
