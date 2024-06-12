<template>
  <div class="card align-items-center text-center" style="padding-top: 20px; min-width: 500px;">
    <h5>프로젝트 진행 현황</h5>
    <div class="graph" ref="gaugeRef"></div>
  </div>
</template>

<script>
import Chart from '@toast-ui/chart';
import {ref, onMounted} from 'vue';
import {defaultInstance} from "@/axios/axios-instance";
import store from "@/store";
import {useToast} from 'vue-toastification';

const toast = useToast();

export default {

  setup() {
    const projectId = store.getters.projectId;

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
      chart: {
        width: 500,
        height: 300,
        animation: {
          duration: 1000
        }
      },
      circularAxis: {
        visible: false,
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
        dataLabels: {
          visible: true,
          formatter: data => `${data}%`
        },
        solid: true,
        clockHand: false
      },
      theme: {
        circularAxis: {
          title: {fontWeight: 500, fontSize: 30, color: 'white'},
          label: {color: 'white', fontSize: 0, textBubble: {visible: false}},
          tick: {strokeStyle: 'white'},
          strokeStyle: 'white',
        },
        series: {
          pin: {
            visible: false
          },
          clockHand: {
            visible: false
          },
          colors: ['#61cc39'],
          dataLabels: {
            visible: true,
            fontSize: 40,
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
      },
      tooltip: {
        template: (model, defaultTooltipTemplate, theme) => {
          theme.body.fontSize = '20px';
          const {body} = defaultTooltipTemplate;
          const {background} = theme;

          return `
        <div style="
          background: ${background};
          width: 130px;
          margin: 0px;
          text-align: center;
          color: white;
          ">
            🚩 ${body}
          </div>`;
        }
      }
    };

    const fetchData = async () => {
      try {
        const response = await defaultInstance.get(`graphs/${projectId}/gauge`);

        const dashboardData = response.data.result.viewProjectDashboardByProjectId;
        const progress = dashboardData.series.find(series => series.name === '전체진행률');

        data.series.find(series => series.name === '전체진행률').data = progress.data;

        progress.value = progress.data;

        return true;
      } catch (error) {

        toast.warning('[게이지] 표시할 데이터가 없습니다.');
        return false;
      }
    };

    onMounted(async () => {
      const result = await fetchData(); // 데이터를 먼저 fetch

      if (result) {
        const el = gaugeRef.value;
        Chart.gaugeChart({el, data, options});
      }
    });

    return {
      gaugeRef
    };
  },
};
</script>
<style>
.graph .toastui-chart-tooltip-container {
  position: absolute;
}
</style>
