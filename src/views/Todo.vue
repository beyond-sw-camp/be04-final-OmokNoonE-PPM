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
                <i class="material-icons text-white me-2">list_alt</i>
                <h6 class="text-white text-capitalize mb-0">할 일 목록</h6>
              </div>
            </div>
          </div>
          <!-- 카드 본문 -->
          <div class="card-body px-0 pb-2" style="max-height: 480px; min-height: 480px; overflow-y: auto;">
            <div class="table-responsive p-0">
              <material-button
                  :color="thisWeekButtonColor"
                  class="register-btn"
                  style="margin: 0 0 1rem 1rem;"
                  @click="thisWeek">
                금주 할 일
              </material-button>
              <material-button
                  :color="nextWeekButtonColor"
                  class="register-btn"
                  style="margin: 0 0 1rem 1rem;"
                  @click="nextWeek">
                차주 할 일
              </material-button>
              <div class="status-description">
                <span class="status-circle status-pending"></span> 준비
                <span class="status-circle status-in-progress"></span> 진행중&nbsp;&nbsp;
                <span class="status-circle status-completed"></span> 완료 &nbsp;&nbsp;
              </div>
              <table class="table align-items-center mb-0">
                <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-lg font-weight-bolder text-center">제목
                  </th>
                  <th class="text-uppercase text-secondary text-lg font-weight-bolder text-center">작성자
                  </th>
                  <th class="text-uppercase text-secondary text-lg font-weight-bolder text-center">담당자
                  </th>
                  <th class="text-uppercase text-secondary text-lg font-weight-bolder text-center">진행 상태
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="!todoList || todoList.length === 0">
                  <td colspan="5" class="text-center text-muted" style="height: 320px;">
                    <span class="no-members-text">할 일이 더이상 없습니다.</span>
                  </td>
                </tr>
                <tr v-else v-for="todo in todoList" :key="todo.id">
                  <td class="text-left">
                    <div class="d-flex px-5 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ todo.title }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    <p class="text-xs font-weight-bold mb-0">{{ todo.authorName }}</p>
                  </td>
                  <td class="text-center">
                    <span class="text-secondary text-xs font-weight-bold text-left d-inline-block">
                      <span v-for="(assignee, index) in todo.assignee" :key="index">
                        {{ assignee.employeeName }}<span v-if="index < todo.assignee.length - 1">, </span>
                      </span>
                    </span>
                  </td>
                  <td class="text-center text-sm">
                    <span class="text-secondary text-xs font-weight-bold text-left d-inline-block">
                      <span v-if="todo.status === '진행'" class="status-circle status-in-progress"></span>
                      <span v-else-if="todo.status === '완료'" class="status-circle status-completed"></span>
                      <span v-else-if="todo.status === '준비'" class="status-circle status-pending"></span>
                    </span>
                  </td>
                </tr>
                </tbody>
              </table>
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
import store from "@/store";
import {useToast} from 'vue-toastification';

const projectId = store.getters.projectId;
const toast = useToast();

const thisWeekButtonColor = ref("outline-info");
const nextWeekButtonColor = ref("");

const todoList = ref([
  {
    id: null,
    title: '',
    authorId: '',
    authorName: '',
    assignee: [],  // 담당자는 여러명일 수 있다
    status: null
  },
]);
async function nextWeek() {
  try {
    thisWeekButtonColor.value = "";
    nextWeekButtonColor.value = "outline-info";

    const response = await defaultInstance.get(`/schedules/nextweek/${projectId}`);
    const responseData = response.data.result.findSchedulesForNextWeek;
    console.log(responseData);

    // TODO. assignee 속성을 받아올 수 있게 Controller 수정이 필요함
    todoList.value = responseData.map(item => ({
      id: item.scheduleId,
      title: item.scheduleTitle,
      authorId: item.authorId,
      authorName: item.authorName,
      assignee: item.assigneeList,
      status: item.scheduleStatus
    }));
  } catch (error) {
    toast.warning('차주 할 일이 없습니다.');
  }

}

async function thisWeek() {
  try {
    thisWeekButtonColor.value = "outline-info";
    nextWeekButtonColor.value = "";

    const response = await defaultInstance.get(`/schedules/thisweek/${projectId}`);
    const responseData = response.data.result.findSchedulesForThisWeek;
    console.log(responseData)

    // TODO. assignee 속성을 받아올 수 있게 Controller 수정이 필요함
    todoList.value = responseData.map(item => ({
      id: item.scheduleId,
      title: item.scheduleTitle,
      authorId: item.authorId,
      authorName: item.authorName,
      assignee: item.assigneeList,
      status: item.scheduleStatus
    }));
  } catch (error) {
    toast.warning('금주 할 일이 없습니다.');
  }
}

// 컴포넌트가 마운트될 때 프로젝트 ID를 설정하고 데이터를 가져옴
onMounted(async () => {
  await thisWeek();
});
</script>

<style scoped>
.table {
  table-layout: fixed;
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

.table th:nth-child(1) {
  width: 50%; /* 제목 열의 너비를 35%로 설정 */
}

.table th:nth-child(2) {
  width: 15%; /* PL 열의 너비를 10%로 설정 */
}

.table th:nth-child(3) {
  width: 25%; /* 담당자 열의 너비를 35%로 설정 */
}

.table th:nth-child(4) {
  width: 10%; /* 진행상태 열의 너비를 20%로 설정 */
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

.status-circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-pending {
  background-color: #ffba26; /* 준비 상태의 색상 */
}

.status-in-progress {
  background-color: #24a8ef; /* 진행중 상태의 색상 */
}

.status-completed {
  background-color: #61cc39; /* 완료 상태의 색상 */
}

.status-description {
  float: right;
  margin-right: 30px;
}

</style>
