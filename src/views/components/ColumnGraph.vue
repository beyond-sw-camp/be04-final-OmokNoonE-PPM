<template>
  <div ref="columnRef"></div>
</template>

<script>
import Chart from '@toast-ui/chart';
import { ref, onMounted } from 'vue';
import {defaultInstance} from "@/axios/axios-instance";
import store from "@/store";
import { useToast } from 'vue-toastification';

const toast = useToast();

export default {
  setup() {
    const projectId = store.getters.projectId;

    const columnRef = ref(null);

    const categories = ref([]); // categories를 반응형 변수로 선언

    const ready = ref({});
    const inProgress = ref({});
    const done = ref({});

    const data = {

      categories: categories.value,

      series: [
        {
          name: '준비',
          data: ready.value,
        },
        {
          name: '진행',
          data: inProgress.value,
        },
        {
          name: '완료',
          data: done.value,
        }
      ]
    }

    const options = {
      chart: {width: 900, height: 500},
      exportMenu :{
        visible: false
      },
      theme: {
        series: {
          colors: [
            '#ffba26', '#24a8ef', '#61cc39'
          ],
        }
      }

    };

    const fetchData = async () => {
      try {
        const response = await defaultInstance.get(`graphs/${projectId}/column`)

        // 준비, 진행, 완료 데이터 업데이트
        const dashboardData = response.data.result.viewProjectDashboardByProjectId;
        const ready = dashboardData.series.find(series => series.name === '준비');
        const inProgress = dashboardData.series.find(series => series.name === '진행');
        const done = dashboardData.series.find(series => series.name === '완료');


        // data.series의 데이터 업데이트
        data.series.find(series => series.name === '준비').data = ready.data;
        data.series.find(series => series.name === '진행').data = inProgress.data;
        data.series.find(series => series.name === '완료').data = done.data;

        ready.value = ready.data;
        inProgress.value = inProgress.data;
        done.value = done.data;

        categories.value = dashboardData.categories;
        data.categories = categories.value;

        return true;
      } catch (error) {
        toast.warning('표시할 데이터가 없습니다.');
        return false;
      }
    };

    onMounted(async () => {
      const result = await fetchData(); // 데이터를 먼저 fetch

      if (result) {
        const el = columnRef.value;
        Chart.columnChart({el, data, options});
      }
    });

    return {
      columnRef
    };
  },
};
</script>