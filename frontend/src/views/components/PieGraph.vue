<template>
  <div class="card align-items-center text-center" style="padding-top: 20px; min-width: 500px;">
    <h5>프로젝트 일정 진행 현황</h5>
    <div class="graph" ref="pieRef"></div>
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
      chart: {
        width: 500,
        height: 300,
        animation: {
          duration: 1000
        }
      },
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
              fontSize: 20,
            }
          },
        },
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
            🏃 ${body}
          </div>`;
        }
      }
    };

    const fetchData = async () => {
      try {
        const response = await defaultInstance.get(`graphs/${projectId}/pie`);

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

        return true;
      } catch (error) {
        toast.warning('[파이] 표시할 데이터가 없습니다.');
        return false;
      }
    };

    onMounted(async () => {
      const result = await fetchData(); // 데이터를 먼저 fetch

      if (result) {
        const el = pieRef.value;
        Chart.pieChart({el, data, options});
      }
    });

    return {
      pieRef
    };
  },
};
</script>
<style>
.graph .toastui-chart-tooltip-container {
  position: absolute;
}
</style>
