<template>
  <div id="example">
    <div v-if="!loadingState" class="content-container">
      <Handsontable :settings="hotSettings"></Handsontable>
      <!--      <Handsontable v-if="!editMode" :settings="hotSettings"></Handsontable>-->
      <!--      <Handsontable v-if="editMode" :settings="editableHotSettings"></Handsontable>-->
      <div class="edit-button-container">
        <!--        <button class="create-button" @click="goToCreateSchedulePage({{ store.getters['project/getProjectId'] }})">등록-->
        <button class="create-button" @click="goToCreateSchedulePage(projectId)">등록
        </button>
        <!--      일괄 편집 기능 추후 개발 예정-->
        <!--        <button class="edit-button" @click="toggleEditMode">{{ editMode ? '수정 완료' : '수정' }}</button>-->
        <!--        <button @click="checkCopySchedules">CopySchedules 값 확인</button>-->
      </div>
    </div>
    <div class="delete-reason" v-if="showDeleteModal">
      <div class="delete-reason-content">
        <h5>삭제 사유</h5>
        <textarea v-model="deleteReason" placeholder="삭제 사유를 입력하세요." rows="4"></textarea>
        <div class="delete-reason-actions">
          <MaterialButton @click="confirmDelete">확인</MaterialButton>
          <MaterialButton @click="cancelDelete">취소</MaterialButton>
        </div>
      </div>
    </div>
    <MaterialSchedule :isOpen="modalOpen" :modalUrl="modalUrl"
                      :requirementList="copyRequirementList" :projectMembers="copyProjectMembers"
                      @close="modalOpen = false"></MaterialSchedule>
    <!--    <StakeholderModal-->
    <!--        :isOpen="stakeholderModalOpen"-->
    <!--        :selectedStakeholders="selectedStakeholders"-->
    <!--        @close="closeStakeholderModal"-->
    <!--        @select="updateStakeholder"-->
    <!--    ></StakeholderModal>-->
  </div>

</template>

<script>
import {defineComponent, onMounted, ref} from 'vue';
import HandsontableComponent from '../components/Handsontable.vue';
import MaterialSchedule from '@/components/MaterialSchedule.vue';
// import StakeholderModal from '@/components/StakeholderModal.vue';
import 'handsontable/dist/handsontable.full.css';
import {format} from 'date-fns';
import {defaultInstance} from "@/axios/axios-instance";
import router from "@/router";
import MaterialButton from "@/components/MaterialButton.vue";
import {useStore} from "vuex";

const store = useStore();

export default defineComponent({
  name: 'ScheduleSheet',
  components: {
    MaterialButton,
    Handsontable: HandsontableComponent,
    MaterialSchedule,
    // StakeholderModal
  },

  setup() {
    const projectId = store.getters.projectId;
    const employeeId = store.getters.employeeId;
    const projectMemberId = store.getters.projectMemberId;

    const schedules = ref([]);
    const copySchedules = ref([]);

    const requirementList = ref([]);
    const copyRequirementList = ref([]);

    const projectMembers = ref([]);
    const copyProjectMembers = ref([]);

    const loadingState = ref(true);

    onMounted(async () => {
      await getProjectSchedules();
      await getProjectRequirements();
      await getProjectMembers();
    });

    const hotSettings = ref({
      data: copySchedules.value,
      colHeaders: [
        '제목', '시작일', '종료일', '가중치', '진행률', '상태', '공수', '담당자', '자세히', '삭제'
      ],
      columns: [
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
            // const button = document.createElement('button');
            // if (!value || value.length === 0) {
            //   button.innerText = '담당자 없음';
            // } else if (value.length === 1) {
            //   button.innerText = value[0].employeeName + '(' + value[0].employeeId + ')';
            // } else {
            //   button.innerText = value[0].employeeName + '(' + value[0].employeeId + ') 등 ' + (value.length) + '명';
            // }
            // button.style.cssText = 'background-color: #4CAF50; color: white; border: none; padding: 8px 22px; cursor: pointer;';
            // button.addEventListener('click', () => openStakeholderModal(row, value));
            // button.addEventListener('change', () => {
            //       console.log('change value');
            //       if (!value || value.length === 0) {
            //         button.innerText = '담당자 없음';
            //       } else if (value.length === 1) {
            //         button.innerText = value[0].employeeName + '(' + value[0].employeeId + ')';
            //       } else {
            //         button.innerText = value[0].employeeName + '(' + value[0].employeeId + ') 등 ' + (value.length) + '명';
            //       }
            //     }
            // );
            // td.innerHTML = '';
            // td.appendChild(button);

            if (!value || value.length === 0) {
              td.value = '담당자 없음';
              td.innerText = '담당자 없음';
            } else if (value.length === 1) {
              td.value = value[0].employeeName + '(' + value[0].employeeId + ')';
              td.innerText = value[0].employeeName + '(' + value[0].employeeId + ')';
            } else {
              for (let i = 0; i < value.length; i++) {
                if (i === 0) {
                  td.value = value[i].employeeName + '(' + value[i].employeeId + ')';
                } else {
                  td.value += ', ' + value[i].employeeName + '(' + value[i].employeeId + ')';
                }
              }
              td.innerText = value[0].employeeName + '(' + value[0].employeeId + ') 등 ' + (value.length) + '명';
            }

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
        {
          data: 'scheduleId', renderer(instance, td, row, col, prop, value) {
            const button = document.createElement('button');
            button.innerText = 'X';
            button.style.cssText = 'background-color: #e72222; color: white; border: none; padding: 8px 22px; cursor: pointer;';
            button.addEventListener('click', () => openDeleteModal(value));
            td.innerHTML = '';
            td.appendChild(button);
            return td;
          }
        },
      ],
      className: 'htCenter',
      licenseKey: 'non-commercial-and-evaluation',
      rowHeaders: true,
      dropdownMenu: {
        items: {
          // 필터 메뉴에서 'readOnly' 항목 제거
          'filter_by_condition': {},
          'filter_action_bar': {},
          'filter_by_condition2': {},
          'filter_by_value': {},
          'filter_operators': {},
        },
        condition: function (column) {
          // 'scheduleId' 열의 인덱스가 0이라고 가정
          if (column === 8 || column === 9) {
            return false; // 'scheduleId' 열에는 필터링을 적용하지 않음
          }
          return true; // 다른 열에는 필터링을 적용
        },
      },
      hiddenColumns: {indicators: true},
      nestedRows: true,
      contextMenu: false,
      bindRowsWithHeaders: true,
      autoWrapRow: true,
      autoWrapCol: true,
      filters: true,
      search: true,
      multiColumnSorting: true,
      readOnly: true,
      colWidths: [250, 100, 100, 70, 70, 70, 50, 175, 70, 50],

      // afterChange(changes) {
      //   console.log('afterChange');
      //   hotSettings.value.data = [...copySchedules.value]; // 트리거를 위한 데이터 갱신
      //   console.log('changes : ', changes);
      // },
    });

    const selectedRow = ref(null);
    const modalOpen = ref(false);
    const modalUrl = ref('');
    // const editMode = ref(false);
    const stakeholderModalOpen = ref(false);
    const selectedStakeholders = ref([]);
    const showDeleteModal = ref(false);
    const deleteReason = ref('');
    const deleteId = ref(0);


    const openModal = (url) => {
      modalUrl.value = url;
      modalOpen.value = true;
    };

    // const openStakeholderModal = (rowIndex, value) => {
    //   if (editMode.value) {
    //     stakeholderModalOpen.value = true;
    //     selectedStakeholders.value = value.split(',').map(str => str.trim());
    //     selectedRow.value = rowIndex;
    //   }
    // };

    const closeStakeholderModal = () => {
      stakeholderModalOpen.value = false;
    };

    const updateStakeholder = (stakeholders) => {
      selectedStakeholders.value = stakeholders;
      closeStakeholderModal();

      copySchedules.value[selectedRow.value]['scheduleEmployeeInfoList'] = stakeholders.join(', ');

      // hotSettings.value.afterChange();
    };

    const formatDate = (date) => {
      return format(new Date(date[0], date[1] - 1, date[2]), 'dd/MM/yyyy');
    };

    const formatChildrenAttributes = (children) => {
      for (let i = 0; i < children.length; i++) {
        children[i].scheduleStartDate = formatDate(children[i].scheduleStartDate);
        children[i].scheduleEndDate = formatDate(children[i].scheduleEndDate);
        children[i].scheduleStatus = children[i].scheduleStatus === 10303 ? '완료' : (children[i].scheduleStatus === 10302 ? '진행' : '준비');

        if (children[i].__children) {
          formatChildrenAttributes(children[i].__children);
        }
      }
    };

    // const toggleEditMode = () => {
    //   /* 일괄 편집 시 사용할 변화 감지 코드, 추후 개발 예정 */
    //   // if (editMode.value) { // editMode가 true에서 false로 변경될 때
    //   //   const changeList = [];
    //   //
    //   //   copySchedules.value.forEach((schedule, index) => {
    //   //     const initialSchedule = initialCopySchedules[index];
    //   //
    //   //     Object.keys(schedule).forEach(key => {
    //   //       if (JSON.stringify(schedule[key]) !== JSON.stringify(initialSchedule[key])) {
    //   //         changeList.push({
    //   //           row: index,
    //   //           prop: key,
    //   //           oldVal: initialSchedule[key],
    //   //           newVal: schedule[key]
    //   //         });
    //   //       }
    //   //     });
    //   //   });
    //   //
    //   //   console.log('Change List:', changeList);
    //   // } else { // editMode가 false에서 true로 변경될 때
    //   //   initialCopySchedules = JSON.parse(JSON.stringify(copySchedules.value)); // copySchedules의 현재 상태 저장
    //   // }
    //
    //   editMode.value = !editMode.value;
    // };

    const deleteSchedule = async (id, reason) => {
      try {
        const requestBody = {
          scheduleId: id,
          scheduleTitle: null,
          scheduleContent: null,
          scheduleStartDate: null,
          scheduleEndDate: null,
          schedulePriority: null,
          scheduleStatus: null,
          scheduleHistoryReason: reason,
          scheduleHistoryProjectMemberId: projectMemberId,
        }
        await defaultInstance.delete(`schedules/remove/${id}`, {
          data: requestBody
        });
        console.log(id, '삭제 요청됨');
        showDeleteModal.value = false;
        deleteReason.value = '';
        location.reload();
      } catch (error) {
        console.error(error);
      }
    }

    const confirmDelete = () => {
      if (deleteReason.value) {
        deleteSchedule(deleteId.value, deleteReason.value);

      } else {
        alert('삭제 사유를 입력해주세요.');
      }
    };
    const cancelDelete = () => {
      showDeleteModal.value = false;
      deleteReason.value = '';
    };
    const openDeleteModal = (id) => {
      deleteId.value = id;
      showDeleteModal.value = true;
    };

    const goToCreateSchedulePage = (projectId) => {
      // router를 활용하여 페이지 이동
      router.push({name: 'CreateSchedule', params: {projectId: projectId}});
    }

    const getProjectSchedules = async () => {
      try {
        // const employeeId = store.getters['auth/getEmployeeId'];  // 로그인한 사용자의 ID, 향후 이 코드로 바꿔야함.
        // const projectId = store.getters['project/getProjectId'];
        const response = await defaultInstance.get(`schedules/sheet/${projectId}`, {
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
          const scheduleStatus = schedules.value[i].scheduleStatus === 10303 ? '완료' : (schedules.value[i].scheduleStatus === 10302 ? '진행' : '준비');
          const scheduleManHours = schedules.value[i].scheduleManHours;
          const scheduleEmployeeInfoList = schedules.value[i].scheduleEmployeeInfoList;
          const scheduleParentScheduleId = schedules.value[i].scheduleParentScheduleId;
          const schedulePrecedingScheduleId = schedules.value[i].schedulePrecedingScheduleId;
          const __children = schedules.value[i].__children;

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
          };

          if (__children) {
            copySchedules.value[i].__children = __children;
            formatChildrenAttributes(copySchedules.value[i].__children);
          }
        }

        loadingState.value = false;
        console.log('copySchedule.value : ', copySchedules.value);

      } catch (error) {
        console.error(error);
      }
    };

    const getProjectRequirements = async () => {
      // 요구사항 목록 조회 로직 구현
      try {
        const response = await defaultInstance.get(`/requirements/list/${projectId}`);
        requirementList.value = response.data.result.viewRequirementsList.projectRequirementsList;
        for (let i = 0; i < requirementList.value.length; i++) {
          const requirementId = requirementList.value[i].requirementsId;
          const requirementName = requirementList.value[i].requirementsName;
          const requirementContent = requirementList.value[i].requirementsContent;

          copyRequirementList.value[i] = {
            requirementId: requirementId,
            requirementName: requirementName,
            requirementContent: requirementContent,
          };
        }

        console.log('requirementList :', requirementList);
        console.log('copyRequirementList :', copyRequirementList);
      } catch (error) {
        console.log(error);
      }
    };

    const getProjectMembers = async () => {
      try {
        /* 실질적인 API 주소 확인해야함. Controller 메소드 확인 */
        const response = await defaultInstance.get(`projectMembers/list/${projectId}`);
        projectMembers.value = response.data.result.viewProjectMembersByProject;
        for (let i = 0; i < projectMembers.value.length; i++) {
          const employeeName = projectMembers.value[i].employeeName;
          const projectMemberEmployeeId = projectMembers.value[i].projectMemberEmployeeId;      // TODO. projectId로 구성원 조회할때 같이 받아오도록 수정 요청
          const projectMemberId = projectMembers.value[i].projectMemberId;                      // TODO. projectId로 구성원 조회할때 같이 받아오도록 수정 요청
          const projectMemberRoleName = projectMembers.value[i].projectMemberRoleName;

          copyProjectMembers.value[i] = {
            name: employeeName,
            employeeId: projectMemberEmployeeId,
            projectMemberId: projectMemberId,
            roleName: projectMemberRoleName,
            isChecked: false, // 체크박스에 활용될 Value 추가
          };
        }
        console.log('copySchedule.value : ', copyProjectMembers.value);

      } catch (error) {
        console.error(error);
      }
    };

    /* 일괄 편집 기능 추후 개발 예정 */
    // const editableHotSettings = ref({
    //   ...hotSettings.value,
    //   readOnly: false,
    //   contextMenu: true,
    // });

    // 추후 개발 시 사용할 value 확인용 함수
    // const checkCopySchedules = () => {
    //   console.log('copySchedules.value : ', copySchedules.value);
    // };

    /* 시트에서 편집 시 사용할 변화 내용 감지 코드, 추후 개발 예정*/
    // let initialCopySchedules = JSON.parse(JSON.stringify(copySchedules.value)); // copySchedules의 초기 상태 저장


    return {
      getProjectSchedules,
      getProjectMembers,
      getProjectRequirements,
      projectId,
      employeeId,
      requirementList,
      copyRequirementList,
      projectMembers,
      copyProjectMembers,
      hotSettings,
      modalOpen,
      modalUrl,
      openModal,
      // editMode,
      // toggleEditMode,
      stakeholderModalOpen,
      closeStakeholderModal,
      selectedStakeholders,
      updateStakeholder,
      // editableHotSettings,
      selectedRow,
      // openStakeholderModal,
      loadingState,
      // checkCopySchedules,
      deleteSchedule,
      confirmDelete,
      goToCreateSchedulePage,
      showDeleteModal,
      deleteReason,
      deleteId,
      cancelDelete,
      openDeleteModal,
    };
  },
});

</script>

<style lang="scss">+
.delete-reason {
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.modal-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
}

.delete-reason-content {
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  width: 30%;
  height: fit-content;
  left: 50%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 21000;
}

.delete-reason-content textarea {
  width: 300px;
  padding: 10px;
  overflow-y: auto;
  white-space: pre-wrap;
}


.delete-reason-actions {
  bottom: 10px;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  right: 10px;
}

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

.create-button {
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
