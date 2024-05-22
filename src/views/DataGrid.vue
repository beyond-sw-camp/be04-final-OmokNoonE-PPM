<template>
  <div id="example">
    <Handsontable :settings="hotSettings"></Handsontable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import HandsontableComponent from '../components/Handsontable.vue';
import 'handsontable/dist/handsontable.full.css';

export default defineComponent({
  name: 'DataGrid',
  components: {
    Handsontable: HandsontableComponent,
  },
  setup() {
    // 더미 데이터
    const dummyData = [
      ['Project A', '2024-05-01', '2024-06-30', 10, 0.8, '진행', 20, '<a href="http://www.naver.com">네이버</a>'],
      ['Project B', '2024-05-15', '2024-07-15', 8, 0.6, '준비', 15, '<a href="google.co.kr">구글</a>'],
      ['Project C', '2024-06-01', '2024-08-15', 12, 0.9, '완료', 25, '<a href="daum.net">다음</a>'],
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
        { data: 0, type: 'text' }, // 제목
        {
          data: 1,
          type: 'date',
          allowInvalid: false,
          sortEmptyCells: true // 시작일
        },
        { data: 2, type: 'date' }, // 종료일
        { data: 3, type: 'numeric' }, // 가중치
        { data: 4, type: 'numeric', format: '0%' }, // 진행률
        {
          data: 5,
          type: 'dropdown',
          source: ['준비', '진행', '완료'] // 상태
        },
        { data: 6, type: 'numeric' }, // 공수
        { data: 7, type: 'text', renderer: 'html' }, // 상세 링크
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
      colWidths: [200, 150, 150, 100, 100, 100, 100, 200], // 열 너비
    });

    return {
      hotSettings,
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
