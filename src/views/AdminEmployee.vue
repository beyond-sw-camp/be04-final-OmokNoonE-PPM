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
                  @click="signUpPageLoad">
                회원가입
              </material-button>
              <!-- 회원 목록 테이블 -->
              <table v-if="!signUpButtonColor" class="table align-items-center mb-0">
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
                  <td class="text-center text-xs font-weight-bold mb-0">{{
                      employee.employeeCreatedDate.split(' ')[0]
                    }}
                  </td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.employeeModifiedDate }}</td>

                  <!-- 직원이 탈퇴한 경우에만 탈퇴일을 표시합니다. -->
                  <td class="text-center text-xs font-weight-bold mb-0">
                    <span v-if="!employee.employeeIsWithdrawn"
                          class="text-xs font-weight-bold mb-0">{{ employee.employeeWithdrawalDate }}</span>
                  </td>
                  <td class="text-center text-xs font-weight-bold mb-0">{{ employee.lastLoginDate }}</td>

                </tr>
                </tbody>
              </table>

              <!-- 회원가입 폼 -->
              <div v-if="signUpButtonColor" class="card-body centered-content">
                <form role="form" class="text-start mt-3 w-25">
                  <div class="mb-3">
                    <material-input
                        v-model="signUpEmployee.employeeId"
                        id="employeeId"
                        type="text"
                        label="사원번호"
                        name="employeeId"
                    />
                  </div>
                  <div class="mb-3">
                    <material-input
                        v-model="signUpEmployee.employeePassword"
                        id="employeePassword"
                        type="password"
                        label="비밀번호"
                        name="employeePassword"
                    />
                  </div>
                  <div class="mb-3">
                    <material-input
                        v-model="signUpEmployee.employeeName"
                        id="employeeName"
                        type="text"
                        label="이름"
                        name="employeeName"
                    />
                  </div>
                  <div class="mb-3">
                    <material-input
                        v-model="signUpEmployee.employeeEmail"
                        id="employeeEmail"
                        type="email"
                        label="이메일"
                        name="employeeEmail"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">연락처</label>
                    <div class="contact-inputs">
                      <material-input
                          v-model="signUpEmployee.employeeContact[0]"
                          id="employeeContact1"
                          type="text"
                          name="employeeContact1"
                          class="w-25"
                          maxlength="3"
                      />-
                      <material-input
                          v-model="signUpEmployee.employeeContact[1]"
                          id="employeeContact2"
                          type="text"
                          name="employeeContact2"
                          class="w-25"
                          maxlength="4"
                      />-
                      <material-input
                          v-model="signUpEmployee.employeeContact[2]"
                          id="employeeContact3"
                          type="text"
                          name="employeeContact3"
                          class="w-25"
                          maxlength="4"
                      />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">외부 관계자</label>
                    <material-checkbox
                        v-model="signUpEmployee.employeeIsExternalPartner"
                        id="employeeIsExternalPartner"
                        name="employeeIsExternalPartner"
                        @change="signUpEmployee.employeeIsExternalPartner = !signUpEmployee.employeeIsExternalPartner"
                    />
                  </div>
                  <div class="mb-3">
                    <material-input
                        v-model="signUpEmployee.employeeCompanyName"
                        id="employeeCompanyName"
                        type="text"
                        label="회사명"
                        name="employeeCompanyName"
                        :disabled="!signUpEmployee.employeeIsExternalPartner"
                    />
                  </div>
                  <div class="mb-3">
                    <material-input
                        v-model="signUpEmployee.employeeDepartment"
                        id="employeeDepartment"
                        type="text"
                        label="부서"
                        name="employeeDepartment"
                    />
                  </div>
                  <div class="text-center">
                    <material-button
                        class="my-4 mb-2"
                        variant="gradient"
                        color="success"
                        fullWidth
                        @click="signUp"
                    >회원가입
                    </material-button>
                  </div>
                </form>
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
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";

const toast = useToast();
const employeeList = ref([]);

const employeeListButtonColor = ref("outline-info");
const signUpButtonColor = ref("");

const signUpEmployee = ref({
  employeeId: '',
  employeePassword: '',
  employeeName: '',
  employeeEmail: '',
  employeeJoinDate: null,
  employeeEmploymentStatus: 10501,  // 기본값은 재직 상태입니다.
  employeeDepartment: '',
  employeeContact: ['', '', ''],
  employeeCompanyName: '',
  employeeIsExternalPartner: false,
});

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

function signUpPageLoad() {
  employeeListButtonColor.value = "";
  signUpButtonColor.value = "outline-info";
}

async function validateSignUp() {
  if (!signUpEmployee.value.employeeId) {
    toast.error('사원번호를 입력해주세요.');
    return false;
  }
  if (!signUpEmployee.value.employeePassword) {
    toast.error('비밀번호를 입력해주세요.');
    return false;
  }
  if (!signUpEmployee.value.employeeName) {
    toast.error('이름을 입력해주세요.');
    return false;
  }
  if (!signUpEmployee.value.employeeEmail) {
    toast.error('이메일을 입력해주세요.');
    return false;
  }

  // 이메일 형식 검사
  const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailPattern.test(signUpEmployee.value.employeeEmail)) {
    toast.error('올바른 이메일 형식을 입력해주세요.');
    return false;
  }

  if (!signUpEmployee.value.employeeContact[0] ||
      !signUpEmployee.value.employeeContact[1] ||
      !signUpEmployee.value.employeeContact[2]) {
    toast.error('연락처를 입력해주세요.');
    return false;
  }

  // 연락처 형식 검사
  const contactPattern = /^\d{3}-\d{3,4}-\d{4}$/;
  const contact = signUpEmployee.value.employeeContact.join('-');
  if (!contactPattern.test(contact)) {
    toast.error('올바른 연락처 형식을 입력해주세요. (예: 010-1234-5678)');
    return false;
  }

  if (signUpEmployee.value.employeeIsExternalPartner &&
      !signUpEmployee.value.employeeCompanyName) {
    toast.error('회사명을 입력해주세요.');
    return false;
  }
  if (!signUpEmployee.value.employeeDepartment) {
    toast.error('부서를 입력해주세요.');
    return false;
  }

  return true;
}

async function signUp() {
  try {
    const validationError = validateSignUp();
    if (validationError) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const requestBody = {
      employeeId: signUpEmployee.value.employeeId,
      employeePassword: signUpEmployee.value.employeePassword,
      employeeName: signUpEmployee.value.employeeName,
      employeeEmail: signUpEmployee.value.employeeEmail,
      employeeJoinDate: today,
      employeeEmploymentStatus: signUpEmployee.value.employeeEmploymentStatus,
      employeeDepartment: signUpEmployee.value.employeeDepartment,
      employeeContact: signUpEmployee.value.employeeContact.join('-'),
      employeeCompanyName: signUpEmployee.value.employeeIsExternalPartner ?
          signUpEmployee.value.employeeCompanyName : '한화부트캠프',  // 외부관계자가 아닐경우 회사명은 한화부트캠프
      employeeIsExternalPartner: signUpEmployee.value.employeeIsExternalPartner,
    };
    await defaultInstance.post('/employees/signup', requestBody);
    toast.success('회원가입이 완료되었습니다.');
    await getEmployeeList();

    // signUpEmployee 객체를 초기화합니다.
    signUpEmployee.value = {
      employeeId: '',
      employeePassword: '',
      employeeName: '',
      employeeEmail: '',
      employeeJoinDate: null,
      employeeEmploymentStatus: 10501,  // 기본값은 재직 상태입니다.
      employeeDepartment: '',
      employeeContact: ['', '', ''],
      employeeCompanyName: '',
      employeeIsExternalPartner: false,
    };
  } catch (error) {
    console.error(error);
    toast.error('회원가입에 실패했습니다.');
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
