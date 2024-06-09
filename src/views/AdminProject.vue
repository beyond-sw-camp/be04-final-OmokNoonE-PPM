<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <!-- 카드 헤더 -->
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div
                class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center ps-3">
                <i class="material-icons text-white me-2">settings</i>
                <h6 class="text-white text-capitalize mb-0">프로젝트 관리</h6>
              </div>
            </div>
          </div>
          <!-- 카드 본문 -->
          <div class="card-body px-0 pb-2" style="max-height: 900px; min-height: 900px; overflow-y: auto;">
            <div class="table-responsive p-0" style="height: 900px">
              <material-button
                  :color="projectListButtonColor"
                  class="register-btn"
                  style="margin: 0 0 1rem 1rem;"
                  @click="getProjectList">
                프로젝트 목록
              </material-button>
              <!-- 프로젝트 목록 테이블 -->
              <table v-if="!projectHistoryButtonColor" class="table align-items-center mb-0">
                <thead>
                <tr>
                  <th class="text-uppercase font-weight-bolder text-center">ID</th>
                  <th class="text-uppercase font-weight-bolder text-center">제목</th>
                  <th class="text-uppercase font-weight-bolder text-center">시작일</th>
                  <th class="text-uppercase font-weight-bolder text-center">종료일</th>
                  <th class="text-uppercase font-weight-bolder text-center">상태</th>
                  <th class="text-uppercase font-weight-bolder text-center">생성일</th>
                  <th class="text-uppercase font-weight-bolder text-center">수정일</th>
                  <th class="text-uppercase font-weight-bolder text-center">삭제 여부</th>
                  <th class="text-uppercase font-weight-bolder text-center">삭제일</th>
                  <th class="text-uppercase font-weight-bolder text-center">수정내역</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="!projectList || projectList.length === 0">
                  <td colspan="9" class="text-center text-muted" style="height: 320px;">
                    <span class="no-members-text">등록된 프로젝트가 없습니다.</span>
                  </td>
                </tr>
                <tr v-else v-for="project in projectList" :key="project.projectId">
                  <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectId }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectTitle }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectStartDate }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectEndDate }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectStatus }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectCreatedDate }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectModifiedDate }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectIsDeleted ? 'O' : '' }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectDeletedDate }}</td>
                  <td class="text-center">
                    <material-button
                        color="info"
                        class="register-btn"
                        style="margin: 0 0 1rem 1rem;"
                        @click="getProjectHistory(project.projectId)">
                      수정내역
                    </material-button>
                  </td>
                </tr>
                </tbody>
              </table>

              <!-- 프로젝트 수정내역 modal -->
              <div class="modal-overlay" @click.self="closeModal" v-if="showProjectHistoryModal">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">프로젝트 수정내역</h5>
                      <material-button
                          color="danger"
                          class="register-btn"
                          style="margin: 0 0 1rem 1rem;"
                          @click="closeModal">
                        닫기
                      </material-button>
                    </div>

                    <div class="modal-body">
                      <table class="table align-items-center mb-0">
                        <thead>
                        <tr>
                          <th class="text-uppercase font-weight-bolder text-center">사유</th>
                          <th class="text-uppercase font-weight-bolder text-center">수정일시</th>
                          <th class="text-uppercase font-weight-bolder text-center">사원번호</th>
                          <th class="text-uppercase font-weight-bolder text-center">이름</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="history in projectHistory" :key="history.id">
                          <td class="text-center text-xs font-weight-bold mb-0">{{ history.projectHistoryReason }}</td>
                          <td class="text-center text-xs font-weight-bold mb-0">
                            {{ history.projectHistoryModifiedDate }}
                          </td>
                          <td class="text-center text-xs font-weight-bold mb-0">{{ history.employeeId }}</td>
                          <td class="text-center text-xs font-weight-bold mb-0">{{ history.employeeName }}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import MaterialButton from "@/components/MaterialButton.vue";
import {defaultInstance} from "@/axios/axios-instance";
import {useToast} from 'vue-toastification';

const toast = useToast();
const projectList = ref([]);
const projectHistory = ref([]);

const showProjectHistoryModal = ref(false);

const projectListButtonColor = ref("outline-info");
const projectHistoryButtonColor = ref("");

// 컴포넌트가 마운트되면 직원 목록을 불러옵니다.
onMounted(async () => {
  await getProjectList();
});

async function getProjectList() {
  try {
    projectListButtonColor.value = "outline-info";
    projectHistoryButtonColor.value = "";

    const response = await defaultInstance.get('/projects/admin/list');
    console.log(response.data)
    projectList.value = response.data.result.viewAllProjectList;
    console.log(projectList.value)
  } catch (error) {
    console.error(error);
    toast.error('프로젝트 목록을 불러오는데 실패했습니다.');
  }
}

async function getProjectHistory(projectId) {
  try {
    const response = await defaultInstance.get(`/projectHistories/view/${projectId}`);
    projectHistory.value = response.data.result.viewProjectHistory;
    if (projectHistory.value.length === 0) {
      toast.info('수정내역이 없습니다.');
      return;
    }
    showProjectHistoryModal.value = true;
    console.log(projectHistory.value)
  } catch (error) {
    console.error(error);
    toast.warning('프로젝트 수정내역을 불러오는데 실패했습니다.');
  }
}

function closeModal() {
  showProjectHistoryModal.value = false;
}

</script>

<style scoped>
.table {
  table-layout: auto;
  width: 100%; /* 필요한 경우 테이블의 너비를 설정할 수 있습니다. */
}

.table th,
.table td {
  padding: 0.3rem;
  text-align: left;
  vertical-align: middle;
}

.table th.text-center,
.table td.text-center {
  text-align: center;
}

.text-center {
  text-align: center;
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
}

.no-members-text {
  opacity: 0.5;
  font-size: 1.2rem;
}

.modal-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.modal-dialog {
  max-width: 600px;
  margin: 1.75rem auto;
}

.modal-content {
  border-radius: 0.5rem;
}

.modal-header {
  border-bottom: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.modal-body {
  padding: 1.5rem;
}

</style>
