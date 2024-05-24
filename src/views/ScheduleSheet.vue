<template>
  <div id="example">
    <div class="content-container">
      <Handsontable :settings="editMode ? hotSettings : readOnlyHotSettings"></Handsontable>
      <div class="edit-button-container">
        <button class="edit-button" @click="toggleEditMode">{{ editMode ? '수정 완료' : '수정' }}</button>
      </div>
    </div>
    <MaterialSchedule :isOpen="modalOpen" :modalUrl="modalUrl" @close="modalOpen = false"></MaterialSchedule>
    <StakeholderModal
        :isOpen="stakeholderModalOpen"
        :selectedStakeholders="selectedStakeholders"
        @close="closeStakeholderModal"
        @select="updateStakeholder"
    ></StakeholderModal>
  </div>
</template>

<script>
import {defineComponent, ref} from 'vue';
import HandsontableComponent from '../components/Handsontable.vue';
import MaterialSchedule from '@/components/MaterialSchedule.vue';
import 'handsontable/dist/handsontable.full.css';

export default defineComponent({
  name: 'ScheduleSheet',
  components: {
    Handsontable: HandsontableComponent,
    MaterialSchedule,
  },
  setup() {

    const stakeholders = ['조조', '유비', '관우', '장비', '손권'];

    const dummyData = ref(Array.from({ length: 20 }, (_, i) => {
      const stakeholder = stakeholders[Math.floor(Math.random() * stakeholders.length)];
      return [`${i}`, `Project ${i+1}`, '2024-05-01', '2024-06-30', 10, 80, '진행', 20, stakeholder, `${i+1}`];
    }));

    const hotSettings = ref({
      data: dummyData,
      colHeaders: [
        '부모', '제목', '시작일', '종료일', '가중치', '진행률', '상태', '공수', '담당자', '자세히'
      ],
      columns: [
        {
          data: 0, type: 'text', renderer(instance, td, row, col, prop, value) {
            td.title = `${value}의 일정 제목`;
            td.innerText = value;
            return td;
          }
        },
        {
          data: 1, type: 'text', renderer(instance, td, row, col, prop, value) {
            td.title = value;
            td.innerText = value;
            return td;
          }
        },
        {data: 2, type: 'date'},
        {data: 3, type: 'date'},
        {data: 4, type: 'numeric', validator: 'numeric'},
        {data: 5, type: 'numeric', format: 'd%'},
        {data: 6, type: 'dropdown', source: ['준비', '진행', '완료']},
        {data: 7, type: 'numeric'},
        {
          data: 8, type: 'text', renderer(instance, td, row, col, prop, value) {
            const button = document.createElement('button');
            button.innerText = value;
            button.style.cssText = 'background-color: #4CAF50; color: white; border: none; padding: 8px 22px; cursor: pointer;';
            button.addEventListener('click', () => openStakeholderModal(row, value));
            td.innerHTML = '';
            td.appendChild(button);

            return td;
          }
        },
        {
          data: 9, renderer(instance, td, row, col, prop, value) {
            const button = document.createElement('button');
            button.innerText = 'link';
            button.style.cssText = 'background-color: #4CAF50; color: white; border: none; padding: 8px 22px; cursor: pointer;';
            button.addEventListener('click', () => openModal(`http://localhost:8887/schedule/details/${value}`));
            td.innerHTML = '';
            td.appendChild(button);
            return td;
          }
        },
      ],
      className: 'htCenter',
      licenseKey: 'non-commercial-and-evaluation',
      rowHeaders: true,
      dropdownMenu: true,
      hiddenColumns: {indicators: true},
      contextMenu: {
        items: {
          row_above: {name: 'Insert row above'},
          row_below: {name: 'Insert row below'},
          remove_row: {name: 'Remove row'},
          cut: {name: 'Cut'},
          copy: {name: 'Copy'},
          paste: {name: 'Paste'},
          alignment: {name: 'Alignment'}
        }
      },
      filters: {readOnly: false},
      search: true,
      multiColumnSorting: true,
      readOnly: false,
      allowInsertRow: false,
      allowInsertColumn: false,
      allowRemoveRow: false,
      allowRemoveColumn: false,
      colWidths: [60, 150, 100, 100, 70, 70, 70, 50, 150, 70],
    });

    const readOnlyHotSettings = ref({
      ...hotSettings.value,
      readOnly: true
    });
    const selectedRow = ref(null);
    const modalOpen = ref(false);
    const modalUrl = ref('');
    const editMode = ref(false);
    const stakeholderModalOpen = ref(false);
    const selectedStakeholders = ref([]);

    const openModal = (url) => {
      modalUrl.value = url;
      modalOpen.value = true;
    };

    const openStakeholderModal = (rowIndex, value) => {
      if (editMode.value) {
        stakeholderModalOpen.value = true;
        selectedStakeholders.value = value.split(',').map(str => str.trim());
        selectedRow.value = rowIndex;
      }
    };

    const closeStakeholderModal = () => {
      stakeholderModalOpen.value = false;
    };

    const updateStakeholder = (stakeholders) => {
      selectedStakeholders.value = stakeholders;
      closeStakeholderModal();

      dummyData.value = dummyData.value.map((row, i) => {
        if (i === selectedRow.value) {
          return [...row.slice(0, 8), stakeholders.join(', '), ...row.slice(9)];
        }
        return row;
      });
    };

    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    return {
      hotSettings,
      modalOpen,
      modalUrl,
      openModal,
      editMode,
      toggleEditMode,
      stakeholderModalOpen,
      closeStakeholderModal,
      selectedStakeholders,
      updateStakeholder,
      readOnlyHotSettings,
      selectedRow,
      openStakeholderModal,
    };
  },
});

</script>

<style lang="scss">
table.htCore {
  tr.odd td {
    background: #FAFBFF;
  }
}

.handsontable {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;

  .htCenter td {
    text-align: center; // 모든 열을 가운데 정렬
  }
}

.content-container {
  display: flex;
  justify-content: space-between;
}

.edit-button-container {
  position: fixed;
  bottom: 30px;
  right: 120px;
}

.edit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
}
</style>
