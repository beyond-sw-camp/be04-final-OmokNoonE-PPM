<template>
  <div id="example">
    <div v-if="!loadingState" class="content-container">
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
import {defineComponent, onMounted, ref} from 'vue';
import HandsontableComponent from '../components/Handsontable.vue';
import MaterialSchedule from '@/components/MaterialSchedule.vue';
import StakeholderModal from '@/components/StakeholderModal.vue';
import 'handsontable/dist/handsontable.full.css';
import axios from "axios";
import {format} from 'date-fns';
// import store from "@/store";

export default defineComponent({
  name: 'ScheduleSheet',
  components: {
    Handsontable: HandsontableComponent,
    MaterialSchedule,
    StakeholderModal
  },

  setup() {

    const schedules = [];
    const copySchedules = ref([{}]);

    const loadingState = ref(true);

    onMounted(async () => {
      try {
        // const employeeId = store.getters['auth/getEmployeeId'];  // 로그인한 사용자의 ID, 향후 이 코드로 바꿔야함.
        const employeeId = "EP001"
        // const projectId = store.getters['project/getProjectId'];
        const projectId = 1;
        const response = await axios.get(`http://localhost:8888/schedules/sheet/${projectId}`, {
          headers: {
            'employeeId': employeeId
          }
        });
        schedules.value = response.data.result.SheetData;
        for (let i = 0; i < schedules.value.length; i++) {
          const scheduleId = schedules.value[i].scheduleId;
          const scheduleTitle = schedules.value[i].scheduleTitle;
          const scheduleStartDate = formatDate(schedules.value[i].scheduleStartDate);
          const scheduleEndDate = formatDate(schedules.value[i].scheduleEndDate);
          const scheduleDepth = schedules.value[i].scheduleDepth;
          const schedulePriority = schedules.value[i].schedulePriority;
          const scheduleProgress = schedules.value[i].scheduleProgress;
          const scheduleStatus = schedules.value[i].scheduleStatus;
          const scheduleManHours = schedules.value[i].scheduleManHours;
          const scheduleEmployeeInfoList = schedules.value[i].scheduleEmployeeInfoList === null ? [] : schedules.value[i].scheduleEmployeeInfoList;
          const scheduleParentScheduleId = schedules.value[i].scheduleParentScheduleId;
          const schedulePrecedingScheduleId = schedules.value[i].schedulePrecedingScheduleId;
          const __children = schedules.value[i].__children === null ? [] : schedules.value[i].__children;

          copySchedules.value[i] = {
            scheduleId: scheduleId,
            scheduleTitle: scheduleTitle,
            scheduleStartDate: scheduleStartDate,
            scheduleEndDate: scheduleEndDate,
            scheduleDepth: scheduleDepth,
            schedulePriority: schedulePriority,
            scheduleProgress: scheduleProgress,
            scheduleStatus: scheduleStatus,
            scheduleManHours: scheduleManHours,
            scheduleEmployeeInfoList: scheduleEmployeeInfoList,
            scheduleParentScheduleId: scheduleParentScheduleId,
            schedulePrecedingScheduleId: schedulePrecedingScheduleId,
            __children: __children
          };

          if (copySchedules.value[i].__children) {
            formatChildrenDates(copySchedules.value[i].__children);
          }
        }

        loadingState.value = false;
        console.log('copySchedule.value : ', copySchedules.value);

      } catch (error) {
        console.error(error);
      }
    });

    const hotSettings = ref({
      data: copySchedules,
      colHeaders: [
        '부모', '제목', '시작일', '종료일', '가중치', '진행률', '상태', '공수', '담당자', '자세히'
      ],
      columns: [
        {
          data: 'scheduleParentScheduleId', type: 'text', renderer(instance, td, row, col, prop, value) {
            td.title = `${value}의 일정 제목`;
            td.innerText = value;
            return td;
          }
        },
        {
          data: 'scheduleTitle', type: 'text', renderer(instance, td, row, col, prop, value) {
            td.title = value;
            td.innerText = value;
            return td;
          }
        },
        {data: 'scheduleStartDate', type: 'date'},
        {data: 'scheduleEndDate', type: 'date'},
        {data: 'schedulePriority', type: 'numeric', validator: 'numeric'},
        {data: 'scheduleProgress', type: 'numeric', format: 'd%'},
        {data: 'scheduleStatus', type: 'dropdown', source: ['준비', '진행', '완료']},
        {data: 'scheduleManHours', type: 'numeric'},
        {
          data: 'scheduleEmployeeInfoList', type: 'text', renderer(instance, td, row, col, prop, value) {
            const button = document.createElement('button');
            if (!value || value.length === 0) {
              button.innerText = '담당자 없음';
            } else {
              button.innerText = '';
              for (let i = 0; i < value.length; i++) {
                const employeeName = value[i].employeeName;
                const employeeId = value[i].employeeId;
                button.innerText = button.innerText + (i > 0 ? ', ' : '') + employeeName + '(' + employeeId + ')';
              }
            }
            button.style.cssText = 'background-color: #4CAF50; color: white; border: none; padding: 8px 22px; cursor: pointer;';
            button.addEventListener('click', () => openStakeholderModal(row, value));
            button.addEventListener('change', () => {
                  console.log('change value');
                  if (!value) {
                    button.innerText = '담당자 없음';
                  } else {
                    button.innerText = '';
                    for (let i = 0; i < value.length; i++) {
                      const employeeName = value[i].employeeName;
                      const employeeId = value[i].employeeId;
                      button.innerText = button.innerText + (i > 0 ? ', ' : '') + employeeName + '(' + employeeId + ')';
                    }
                  }
                }
            );
            td.innerHTML = '';
            td.appendChild(button);

            return td;
          }
        },
        {
          data: 'scheduleId', renderer(instance, td, row, col, prop, value) {
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
      licenseKey:
          'non-commercial-and-evaluation',
      rowHeaders:
          true,
      dropdownMenu:
          true,
      hiddenColumns:
          {
            indicators: true
          }
      ,
      nestedRows: true,
      contextMenu:
          true,
      bindRowsWithHeaders:
          true,
      autoWrapRow:
          true,
      autoWrapCol:
          true,
      filters:
          {
            readOnly: false
          }
      ,
      search: true,
      multiColumnSorting:
          true,
      readOnly:
          false,
      colWidths:
          [60, 150, 100, 100, 70, 70, 70, 50, 150, 70],
      afterChange() {
        console.log('afterChange');
        hotSettings.value.data = [...copySchedules.value]; // 트리거를 위한 데이터 갱신
      }
      ,
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
      console.log(stakeholders); // 콘솔에 받은 이해관계자들 출력
      selectedStakeholders.value = stakeholders;
      closeStakeholderModal();

      copySchedules.value[selectedRow.value]['scheduleEmployeeInfoList'] = stakeholders.join(', ');

      console.log(copySchedules.value); // 콘솔에 업데이트된 dummyData 출력

      hotSettings.value.afterChange();

    };

    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    const formatDate = (date) => {
      return format(new Date(date[0], date[1] - 1, date[2]), 'dd/MM/yyyy');
    };

    const formatChildrenDates = (children) => {
      for (let i = 0; i < children.length; i++) {
        children[i].scheduleStartDate = formatDate(children[i].scheduleStartDate);
        children[i].scheduleEndDate = formatDate(children[i].scheduleEndDate);

        if (children[i].__children) {
          formatChildrenDates(children[i].__children);
        }
      }
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
      loadingState,
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
