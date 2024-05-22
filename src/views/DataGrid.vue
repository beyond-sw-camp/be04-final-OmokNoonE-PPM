<template>
  <div id="example">
    <Handsontable :settings="hotSettings"></Handsontable>
    <MaterialSchedule :isOpen="modalOpen" :modalUrl="modalUrl" @close="modalOpen = false"></MaterialSchedule>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import HandsontableComponent from '../components/Handsontable.vue';
import MaterialSchedule from '@/components/MaterialSchedule.vue';
import 'handsontable/dist/handsontable.full.css';

export default defineComponent({
  name: 'DataGrid',
  components: {
    Handsontable: HandsontableComponent,
    MaterialSchedule
  },
  setup() {
    // 더미 데이터
    const dummyData = [
      ['Project A', '2024-05-01', '2024-06-30', 10, 80, '진행', 20, '1'],
      ['Project B', '2024-05-15', '2024-07-15', 8, 60, '준비', 15, '2'],
      ['Project C', '2024-06-01', '2024-08-15', 12, 90, '완료', 25, '3'],
    ];

    const hotSettings = ref({
      data: dummyData,
      colHeaders: [
        '제목',
        '시작일',
        '종료일',
        '가중치',
        '진행률',
        '상태',
        '공수',
        '상세 링크'
      ],
      columns: [
        {data: 0, type: 'text'}, // 제목
        {
          data: 1,
          type: 'date',
          allowInvalid: false,
          sortEmptyCells: true // 시작일
        },
        {data: 2, type: 'date'}, // 종료일
        {data: 3, type: 'numeric'}, // 가중치
        {data: 4, type: 'numeric', format: 'd%'}, // 진행률
        {
          data: 5,
          type: 'dropdown',
          source: ['준비', '진행', '완료'] // 상태
        },
        {data: 6, type: 'numeric'}, // 공수
        {
          data: 7,
          renderer(instance, td, row, col, prop, value) {
            const button = document.createElement('button');
            button.innerText = value;
            button.style = 'background-color: #4CAF50; color: white; border: none; padding: 10px 24px; cursor: pointer;';
            button.addEventListener('click', () => {
              openModal('http://localhost:8887/schedule/details/' + value);
            });

            td.innerHTML = '';
            td.appendChild(button);

            return td;
          }
        }, // 상세 링크
      ],
      licenseKey: 'non-commercial-and-evaluation',
      rowHeaders: true,
      dropdownMenu: true,
      hiddenColumns: {
        indicators: true,
      },
      contextMenu: true,
      multiColumnSorting: true,
      filters: true,
      colWidths: [200, 150, 150, 100, 100, 100, 100, 100], // 열 너비
    });

    const modalOpen = ref(false);
    const modalUrl = ref('');

    const openModal = (url) => {
      modalUrl.value = url;
      modalOpen.value = true;
    };

    return {
      hotSettings,
      modalOpen,
      modalUrl,
      openModal
    };
  },
});
</script>

<style lang="scss">
/*
  A stylesheet customizing app (custom renderers)
*/
table.htCore {
  tr.odd td {
    background: #FAFBFF;
  }
}

/*
  A stylesheet customizing Handsontable style
*/
.handsontable {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;

  .collapsibleIndicator {
    text-align: center;
  }
}
</style>
