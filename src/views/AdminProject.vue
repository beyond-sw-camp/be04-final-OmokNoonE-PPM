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
              <material-button
                  :color="projectHistoryButtonColor"
                  class="register-btn"
                  style="margin: 0 0 1rem 1rem;"
                  @click="projectHistoryPageLoad">
                프로젝트 수정내역
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
                    <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectIsDeleted ? 'O' : ''}}</td>
                    <td class="text-center text-xs font-weight-bold mb-0">{{ project.projectDeletedDate }}</td>
                  </tr>
                </tbody>
              </table>

              <!-- 프로젝트 수정내역 테이블 -->
              <div v-if="projectHistoryButtonColor" class="card-body centered-content">

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
    projectList.value = response.data.result.viewAllProjectList;
    console.log(projectList.value)
  } catch (error) {
    console.error(error);
    toast.error('직원 목록을 불러오는데 실패했습니다.');
  }
}

function projectHistoryPageLoad() {
  projectListButtonColor.value = "";
  projectHistoryButtonColor.value = "outline-info";
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

.centered-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.contact-inputs {
  display: flex;
  justify-content: space-between;
}
</style>
