<template>
  <div ref="gaugeRef"></div>
</template>

<script>
import Chart from '@toast-ui/chart';
import { ref, onMounted } from 'vue';

export default {

  setup() {
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
      chart: {width: 500, height: 300},
      series: {
        dataLabels : {visible:true},
        solid: true
      },
      circularAxis : {
        scale: {
          min: 0,
          max: 90
        }
      },
      theme: {
        series : {
          solid: {
            barWidth: 10,
            strokeStyle : 'red',
          },
          pin : {
            radius : 555
          },
          dataLabels: {
            useSeriesColor : true,
            fontSize: 30,
            textBubble : {
              visible: false
            }
          }
        }
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8888/graphs/2/gauge');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        const progress = result.series.find(series => series.name === '전체진행률');

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
