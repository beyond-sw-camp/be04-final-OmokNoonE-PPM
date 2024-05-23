<template>
  <div ref="columnRef"></div>
</template>

<script>
import Chart from '@toast-ui/chart';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const columnRef = ref(null);

    const categories = ref([]); // categories를 반응형 변수로 선언

    const ready = ref({});
    const inProgress = ref({});
    const done = ref({});

    const data = {

      categories: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

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
      chart: {width: 500, height: 300},
    };

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8888/graphs/1/column');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // 예상 진행률 및 실제 진행률 데이터 업데이트
        const ready = result.series.find(series => series.name === '준비');
        const inProgress = result.series.find(series => series.name === '진행');
        const done = result.series.find(series => series.name === '완료');

        // data.series의 데이터 업데이트
        data.series.find(series => series.name === '준비').data = ready.data;
        data.series.find(series => series.name === '진행').data = inProgress.data;
        data.series.find(series => series.name === '완료').data = done.data;

        ready.value = ready.data;
        inProgress.value = inProgress.data;
        done.value = done.data;

        categories.value = result.categories;
        data.categories = categories.value;


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(async () => {
      await fetchData(); // 데이터를 먼저 fetch
      if (columnRef.value) {
        const el = columnRef.value;
        const chart = Chart.columnChart({el, data, options});
        console.log(chart);
      }
    });

    return {
      columnRef
    };
  },
};
</script>