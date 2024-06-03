<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">직책 변경</h5>
        </div>
        <div class="modal-body">
          <div v-if="isLoading" class="loading-spinner">로딩 중...</div>
          <div v-else class="table-responsive p-0">
            <table class="table align-items-center mb-0">
              <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">선택</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">사원번호</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">이름</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">권한</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">연락처</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="member in projectMembers" :key="member.id">
                <!-- 구성원 선택 체크박스 -->
                <td class="text-left">
                  <MaterialCheckbox :checked="isSelected(member)" @change="toggleSelection(member)"/>
                </td>
                <!-- 구성원 사원번호 -->
                <td class="text-left">
                  <h6 class="mb-0 text-sm">{{ member.projectMemberEmployeeId }}</h6>
                </td>
                <!-- 구성원 이름 -->
                <td class="text-left">
                  <h6 class="mb-0 text-sm">{{ member.employeeName }}</h6>
                </td>
                <!-- 구성원 직책 드롭다운 -->
                <td class="text-left">
                  <select v-model="member.codeName" class="form-select form-select-sm"
                          :disabled="!isSelected(member)">
                    <option value="PA">PA</option>
                    <option value="PL">PL</option>
                    <option value="PM">PM</option>
                  </select>
                </td>
                <!-- 구성원 연락처 -->
                <td class="align-middle text-center text-sm">
                    <span class="text-secondary text-xs font-weight-bold text-left d-inline-block">
                      E-mail. {{ member.employeeEmail }}<br/><span class="ps-1">Phone. {{ member.employeeContact }}</span>
                    </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <!-- 취소 버튼 -->
          <MaterialButton color="secondary" size="md" variant="fill" @click="confirmClose">취소</MaterialButton>
          <!-- 저장 버튼 -->
          <MaterialButton color="info" size="md" variant="fill" @click="saveChanges">저장</MaterialButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import MaterialButton from '@/components/MaterialButton.vue';
import MaterialCheckbox from '@/components/MaterialCheckbox.vue';
import {useToast} from 'vue-toastification';
import {useStore} from "vuex";

const store = useStore();

// 이벤트를 부모 컴포넌트로 전달하기 위한 설정
const emit = defineEmits(['close']);

const selectedMembers = ref([]); // 선택된 구성원의 ID를 저장
const isLoading = ref(false);
const toast = useToast(); // toast 초기화
const projectMembers = computed(() => store.getters.projectMembers || []); // 원래의 추가 가능한 구성원 목록 가져오기

// 변경 사항 저장 함수
const saveChanges = async () => {
  if (selectedMembers.value.length === 0) {
    toast.error('직책을 변경할 구성원을 선택해 주세요.');
    return;
  }
  try {
    for (const member of selectedMembers) {
      await store.dispatch('modifyProjectMember', {projectMemberId: member.id, role: member.role});
    }
    toast.success('구성원의 직책이 성공적으로 변경되었습니다.');
  } catch (error) {
    toast.error('구성원 직책 변경 중 오류가 발생했습니다.');
  }
};

// 모달 닫기 확인 함수
const confirmClose = () => {
  if (selectedMembers.value.length > 0) {
    if (confirm('직책 변경을 취소하시겠습니까?')) {
      emit('close');
    }
  } else {
    emit('close');
  }
};

const isSelected = (member) => {
  return selectedMembers.value.includes(member);
};

// 구성원 선택/해제 토글 함수
const toggleSelection = (member) => {
  const index = selectedMembers.value.indexOf(member);
  if (index > -1) {
    selectedMembers.value.splice(index, 1); // 이미 선택된 경우 선택 해제
  } else {
    selectedMembers.value.push(member); // 선택되지 않은 경우 선택 추가
  }
};

onMounted(async () => {
  isLoading.value = true;
  console.log('fetching project members');
  console.log(projectMembers.value)
  isLoading.value = false;
});
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5); /* 모달 배경을 반투명하게 설정 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-dialog {
  background: white;
  border-radius: 5px;
  padding: 20px;
  max-width: 800px;
  width: 70%;
  height: 70%;
}

.modal-content {
  height: 100%;
}

.modal-body {
  height: 70%;
  overflow-y: auto;
}

.loading-spinner {
  text-align: center;
  font-size: 1.5rem;
}

.is-selected {
  background-color: rgba(0, 123, 255, 0.1); /* 선택된 구성원의 배경색 설정 */
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 90%;
    height: 90%;
  }

  .modal-content {
    height: 100%;
  }

  .modal-body {
    height: 80%;
    overflow-y: auto;
  }

  .table-responsive {
    overflow-x: auto;
  }

  .modal-footer {
    display: flex;
    flex-direction: column;
  }
}
</style>
