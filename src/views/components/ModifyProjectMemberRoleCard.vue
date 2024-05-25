<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">직책 변경</h5>
        </div>
        <div class="modal-body">
          <!-- 로딩 중일 때 로딩 스피너를 표시 -->
          <div v-if="isLoading" class="loading-spinner">로딩 중...</div>
          <!-- 로딩이 완료되면 구성원 변경 테이블을 표시 -->
          <div v-else class="table-responsive p-0">
            <table class="table align-items-center mb-0">
              <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">선택</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">이름</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-1">직책</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center ps-2">연락처
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-4">시작일</th>
              </tr>
              </thead>
              <tbody>
              <!-- projectMembers 배열을 순회하여 각 구성원 표시 -->
              <tr v-for="member in projectMembers" :key="member.id"
                  :class="{ 'is-selected': selectedMemberIds.includes(member.id) }">
                <td class="text-left">
                  <!-- 구성원 선택 체크박스 -->
                  <MaterialCheckbox v-model="selectedMemberIds" :value="member.id"/>
                </td>
                <td class="text-left">
                  <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center">
                      <!-- 구성원 이름 표시 -->
                      <h6 class="mb-0 text-sm">{{ member.name }}</h6>
                    </div>
                  </div>
                </td>
                <td class="text-left">
                  <!-- 구성원 직책 선택 드롭다운 -->
                  <select v-model="member.role" class="form-select form-select-sm"
                          :disabled="!selectedMemberIds.includes(member.id)">
                    <option value="PA">PA</option>
                    <option value="PL">PL</option>
                    <option value="PM">PM</option>
                  </select>
                </td>
                <td class="align-middle text-center text-sm">
                  <!-- 구성원의 이메일 및 전화번호 표시 -->
                  <span class="text-secondary text-xs font-weight-bold text-left d-inline-block">E-mail. {{
                      member.email
                    }}<br><span class="ps-1">Phone. {{ member.phone }}</span></span>
                </td>
                <td class="align-middle text-left text-sm">
                  <!-- 구성원의 가입일 표시 -->
                  <span class="text-secondary text-xs font-weight-bold">{{ member.startDate }}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <!-- 취소 버튼 클릭 시 confirmClose 함수 호출 -->
          <MaterialButton color="secondary" size="md" variant="fill" @click="confirmClose">취소</MaterialButton>
          <!-- 저장 버튼 클릭 시 saveChanges 함수 호출 -->
          <MaterialButton color="info" size="md" variant="fill" @click="saveChanges">저장</MaterialButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import MaterialButton from '@/components/MaterialButton.vue'; // MaterialButton 컴포넌트 임포트
import MaterialCheckbox from '@/components/MaterialCheckbox.vue'; // MaterialCheckbox 컴포넌트 임포트

// 부모 컴포넌트에서 전달된 속성 정의
const props = defineProps({
  projectMembers: {
    type: Array,
    default: () => [],
  },
});

// 이벤트를 부모 컴포넌트로 전달하기 위한 설정
const emit = defineEmits(['close', 'save-changes']);

const selectedMemberIds = ref([]); // 선택된 구성원의 ID 배열
const isLoading = ref(false); // 로딩 상태 관리

// 직책 변경 함수
const saveChanges = async () => {
  if (selectedMemberIds.value.length === 0) {
    alert('직책을 변경할 구성원을 선택해 주세요.');
    return;
  }
  const selectedMembers = props.projectMembers.filter(member => selectedMemberIds.value.includes(member.id));
  if (selectedMembers.length === 0) {
    alert('유효하지 않은 구성원입니다.');
    return;
  }
  try {
    await emit('save-changes', selectedMembers);
    alert('구성원의 직책이 성공적으로 변경되었습니다.');
  } catch (error) {
    alert('구성원 직책 변경 중 오류가 발생했습니다.'); // 에러 메시지 처리
  }
};

// 취소 버튼 클릭 시 확인 메시지 표시
const confirmClose = () => {
  emit('close');
};
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5); /* 모달 배경 반투명 처리 */
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
  height: 70%; /* 모달의 높이를 고정 */
}

.modal-content {
  height: 100%; /* 고정 높이를 설정 */
}

.modal-body {
  height: 70%; /* 모달 본문의 높이를 설정 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
}

.loading-spinner {
  text-align: center;
  font-size: 1.5rem;
}

.is-selected {
  background-color: rgba(0, 123, 255, 0.1); /* 선택된 구성원 시각적 강조 */
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 90%;
    height: 90%; /* 작은 화면에서 모달의 높이 조정 */
  }

  .modal-content {
    height: 100%; /* 고정 높이를 설정 */
  }

  .modal-body {
    height: 80%; /* 모달 본문의 높이를 설정 */
    overflow-y: auto; /* 세로 스크롤 활성화 */
  }

  .table-responsive {
    overflow-x: auto; /* 작은 화면에서 테이블 가로 스크롤 활성화 */
  }

  .modal-footer {
    display: flex;
    flex-direction: column;
  }

  .btn {
    margin-bottom: 10px;
  }
}
</style>
