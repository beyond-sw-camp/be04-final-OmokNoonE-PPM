<template>
  <div ref="lineRef"></div>
</template>

<script>
import Chart from '@toast-ui/chart';
import { ref, onMounted } from 'vue';

export default {
  setup() {
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
        const response = await fetch('http://localhost:8888/graphs/2/line');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        categories.value = result.categories;

        // data 객체 업데이트
        linedata.categories = categories.value;

        // 예상 진행률 및 실제 진행률 데이터 업데이트
        const expectedSeries = result.series.find(series => series.name === '예상진행률');
        const actualSeries = result.series.find(series => series.name === '실제진행률');

        // data.series의 데이터 업데이트
        linedata.series.find(series => series.name === '예상진행률').data = expectedSeries.data;
        linedata.series.find(series => series.name === '실제진행률').data = actualSeries.data;

        expectProgress.value = expectedSeries.data;
        progress.value = actualSeries.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(async () => {
      await fetchData(); // 데이터를 먼저 fetch
      if (lineRef.value) {
        const el = lineRef.value;
        const chart = Chart.lineChart({el, data: linedata, options});
        console.log(chart);
      }
    });

    return {
      lineRef
    };
  },
};
</script>
