<template>
  <div ref="pieRef"></div>
</template>

<script>
import Chart from '@toast-ui/chart';
import {ref, onMounted} from 'vue';
import {defaultInstance} from "@/axios/axios-instance";
import store from "@/store";

export default {
  setup() {
    const projectId = store.getters.projectId;

    const pieRef = ref(null);

    const ready = ref({});
    const inProgress = ref({});
    const done = ref({});

    const data = {

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
      chart: {width: 600, height: 500},
      exportMenu: {
        visible: false
      },
      series: {
        dataLabels: {
          visible: true,
          pieSeriesName: {
            visible: true,
            anchor: 'outer'
          }
        },
      },
      theme: {
        series: {
          colors: [
            '#ffba26', '#24a8ef', '#61cc39'
          ],
          dataLabels: {
            color: '#3d3d3d',
            pieSeriesName: {
              fontSize: 20
            }
          },
        },
      },
    };

    const fetchData = async () => {
      try {
        const response = defaultInstance.get(`/graphs/${projectId}/pie`);

        // 예상 진행률 및 실제 진행률 데이터 업데이트
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

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(async () => {
      await fetchData(); // 데이터를 먼저 fetch
      if (pieRef.value) {
        const el = pieRef.value;
        const chart = Chart.pieChart({el, data, options});
        console.log(chart);
      }
    });

    return {
      pieRef
    };
  },
};
</script>
