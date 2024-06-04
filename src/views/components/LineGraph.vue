<template>
  <div ref="lineRef"></div>
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
    const lineRef = ref(null);
    const categories = ref([]); // categories를 반응형 변수로 선언
    const expectProgress = ref([]);
    const progress = ref([]);

    const linedata = {
      categories: categories.value, // categories 변수를 사용
      series: [
        {
          name: '예상진행률',
          data: expectProgress.value,
        },
        {
          name: '실제진행률',
          data: progress.value,
        },
      ],
    };

    const options = {
      chart: {width: 900, height: 500},
      exportMenu :{
        visible: false
      },
      theme: {
        series: {
          lineWidth: 3,
          colors: [
            '#ccd1d2', '#49be1b'
          ],
        }
      }
    };

    const fetchData = async () => {
      try {
        const response = await defaultInstance.get(`graphs/${projectId}/line`);

        // 예상진행률, 실제진행률 데이터 업데이트
        const dashboardData = response.data.result.viewProjectDashboardByProjectId;
        const expectedProgress = dashboardData.series.find(series => series.name === '예상진행률');
        const actualProgress = dashboardData.series.find(series => series.name === '실제진행률');

        // data.series의 데이터 업데이트
        linedata.series.find(series => series.name === '예상진행률').data = expectedProgress.data;
        linedata.series.find(series => series.name === '실제진행률').data = actualProgress.data;

        expectedProgress.value = expectedProgress.data;
        actualProgress.value = actualProgress.data;

        categories.value = dashboardData.categories;

        linedata.categories = categories.value;

        return true;
      } catch (error) {
        toast.warning('표시할 데이터가 없습니다.');
        return false;
      }
    };

    onMounted(async () => {
      const result = await fetchData(); // 데이터를 먼저 fetch

      if (result) {
        const el = lineRef.value;
        Chart.lineChart({el, data: linedata, options});
      }
    });

    return {
      lineRef
    };
  },
};
</script>
