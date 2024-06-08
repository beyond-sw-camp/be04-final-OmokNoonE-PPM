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
                <i class="material-icons text-white me-2">face</i>
                <h6 class="text-white text-capitalize mb-0">회원 관리</h6>
              </div>
            </div>
          </div>
          <!-- 카드 본문 -->
          <div class="card-body px-0 pb-2" style="max-height: 900px; min-height: 900px; overflow-y: auto;">
            <div class="table-responsive p-0" style="height: 900px">
              <material-button
                  :color="employeeListButtonColor"
                  class="register-btn"
                  style="margin: 0 0 1rem 1rem;"
                  @click="getEmployeeList">
                회원 목록
              </material-button>
              <material-button
                  :color="signUpButtonColor"
                  class="register-btn"
                  style="margin: 0 0 1rem 1rem;"
                  @click="getEmployeeList">
                회원가입
              </material-button>
              <table class="table align-items-center mb-0">
                <thead>
                <tr>
                  <th class="text-uppercase font-weight-bolder text-center">아이디</th>
                  <th class="text-uppercase font-weight-bolder text-center">이름</th>
                  <th class="text-uppercase font-weight-bolder text-center">이메일</th>
                  <th class="text-uppercase font-weight-bolder text-center">가입일</th>
                  <th class="text-uppercase font-weight-bolder text-center">재직 상태</th>
                  <th class="text-uppercase font-weight-bolder text-center">부서</th>
                  <th class="text-uppercase font-weight-bolder text-center">연락처</th>
                  <th class="text-uppercase font-weight-bolder text-center">회사명</th>
                  <th class="text-uppercase font-weight-bolder text-center">외부 관계자</th>
                  <th class="text-uppercase font-weight-bolder text-center">생성일</th>
                  <th class="text-uppercase font-weight-bolder text-center">수정일</th>
                  <th class="text-uppercase font-weight-bolder text-center">탈퇴일</th>
                  <th class="text-uppercase font-weight-bolder text-center">마지막 로그인</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="!employeeList || employeeList.length === 0">
                  <td colspan="14" class="text-center text-muted" style="height: 320px;">
                    <span class="no-members-text">가입된 회원이 없습니다.</span>
                  </td>
                </tr>
                <tr v-else v-for="employee in employeeList" :key="employee.id">
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeId }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeName }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeEmail }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeJoinDate }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeEmploymentStatus }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeDepartment }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeContact }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeCompanyName }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">
                    <span v-if="employee.employeeIsExternalPartner">O</span>
                  </td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeCreatedDate.split(' ')[0] }}</td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeModifiedDate }}</td>

                  <!-- 직원이 탈퇴한 경우에만 탈퇴일을 표시합니다. -->
                  <td class="text-center text-xs font-weight-bold mb-0">
                    <span v-if="!employee.employeeIsWithdrawn" class="text-xs font-weight-bold mb-0">{{ employee.employeeWithdrawalDate }}</span>
                  </td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.lastLoginDate }}</td>

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
import {useToast} from 'vue-toastification';

const toast = useToast();
const employeeList = ref([]);

const employeeListButtonColor = ref("outline-info");
const signUpButtonColor = ref("");

// 컴포넌트가 마운트되면 직원 목록을 불러옵니다.
onMounted(async () => {
  await getEmployeeList();
});

async function getEmployeeList() {
  try {
    employeeListButtonColor.value = "outline-info";
    signUpButtonColor.value = "";

    const response = await defaultInstance.get('/employees/list');
    employeeList.value = response.data.result.viewEmployeeList;
    console.log(employeeList.value)
  } catch (error) {
    console.error(error);
    toast.error('직원 목록을 불러오는데 실패했습니다.');
  }
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

.status-circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-in-progress {
  background-color: #f0ad4e; /* 진행중 상태의 색상 */
}

.status-completed {
  background-color: #5cb85c; /* 완료 상태의 색상 */
}

.status-pending {
  background-color: #d9534f; /* 보류중 상태의 색상 */
}

.status-description {
  float: right;
  margin-right: 30px;
}

</style>
