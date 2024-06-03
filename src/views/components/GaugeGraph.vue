<template>
  <div ref="gaugeRef"></div>
</template>

<script>
import Chart from '@toast-ui/chart';
import {ref, onMounted} from 'vue';
import {useStore} from "vuex";
import {defaultInstance} from "@/axios/axios-instance";

const store = useStore();

export default {

  setup() {
    const projectId = store.state.projectId;

    const gaugeRef = ref(null);

    const progress = ref({});

    const data = {

      series: [
        {
          name: '전체진행률',
          data: progress.value
        },
      ],
    };

    const options = {
      chart: {width: 600, height: 500},
      circularAxis: {
        visible : false,
        scale: {
          min: 0,
          max: 90
        }

      },
      exportMenu: {
        visible: false
      },
      series: {
        pin: {
          visible: false,
        },
        dataLabels: {visible: true,
        formatter : data => `${data}%`},
        solid: true,
        clockHand : false
      },
      theme: {
        circularAxis: {
          title: { fontWeight: 500, fontSize: 30, color: 'white' },
          label: { color: 'white', fontSize: 15, textBubble:{visible: false} },
          tick: { strokeStyle: 'white' },
          strokeStyle: 'white',
        },
        series: {
          pin : {
            visible : false
          },
          clockHand: {
            visible : false
          },
          colors: ['#61cc39'],
          dataLabels: {
            visible: true,
            fontSize: 50,
            // offsetX: -20, // X축 방향으로 dataLabels를 이동
            // offsetY: -10, // Y축 방향으로 dataLabels를 이동
            color: '#61cc39',

            textBubble: {
              visible: false,
            }
          },
          solid: {
            barWidth: 20,
          },
        }
      }
    };

    const fetchData = async () => {
      try {
        const response = await defaultInstance.get(`/graphs/${projectId}/gauge`);

        const dashboardData = response.data.result.viewProjectDashboardByProjectId;
        const progress = dashboardData.series.find(series => series.name === '전체진행률');


        data.series.find(series => series.name === '전체진행률').data = progress.data;

        progress.value = progress.data;

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(async () => {
      await fetchData(); // 데이터를 먼저 fetch
      if (gaugeRef.value) {
        const el = gaugeRef.value;
        const chart = Chart.gaugeChart({el, data, options});
        console.log(chart);
      }
    });

    return {
      gaugeRef
    };
  },
};
</script>
