<template>
  <div class="card align-items-center text-center" style="padding-top: 20px; min-width: 650px;">
    <h5>PA별 일정 진행 현황</h5>
    <div class="graph" ref="columnRef"></div>
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
      chart: {
        width: 650,
        height: 300,
        animation: {
          duration: 10000
        }
      },
      exportMenu: {
        visible: false
      },
      theme: {
        series: {
          colors: [
            '#ffba26', '#24a8ef', '#61cc39'
          ],
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
            🥺 ${model.category}
            ${body}
          </div>`;
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
        toast.warning('[컬럼] 표시할 데이터가 없습니다.');
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
<style>
.graph .toastui-chart-tooltip-container {
  position: absolute;
}
</style>
