<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">구성원 추가</h5>
        </div>
        <div class="modal-body">
          <!-- 로딩 중일 때 로딩 스피너를 표시 -->
          <div v-if="availableMembersLoading" class="loading-spinner">로딩 중...</div>
          <!-- 로딩이 완료되면 구성원 추가 테이블을 표시 -->
          <div v-else class="table-responsive p-0">
            <table class="table align-items-center mb-0">
              <thead>
              <tr>
                <!-- 각 컬럼 헤더 -->
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">선택</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">이름</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-1">직책</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center ps-2">연락처</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-4">가입일</th>
              </tr>
              </thead>
              <tbody>
              <!-- availableMembers 배열을 순회하여 각 구성원 표시 -->
              <tr v-for="member in availableMembers" :key="member.id">
                <td class="text-left">
                  <!-- 구성원 선택 체크박스 -->
                  <input type="checkbox" v-model="selectedMembers" :value="member.id" />
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
                  <select v-model="member.role" class="form-select form-select-sm">
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
          <!-- 추가하기 버튼 클릭 시 addMembers 함수 호출 -->
          <MaterialButton color="info" size="md" variant="fill" @click="addMembers">추가하기</MaterialButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import MaterialButton from '@/components/MaterialButton.vue'; // MaterialButton 컴포넌트 임포트

// 부모 컴포넌트에서 전달된 속성 정의
const props = defineProps({
  availableMembers: {
    type: Array,
    default: () => [],
  },
});

// 이벤트를 부모 컴포넌트로 전달하기 위한 설정
const emit = defineEmits(['close', 'add-members']);

const selectedMembers = ref([]); // 선택된 구성원 목록을 저장
const store = useStore();
const availableMembersLoading = computed(() => store.state.availableMembersLoading); // 추가 가능한 구성원 로딩 상태

// 컴포넌트가 처음 마운트될 때 선택된 구성원을 초기화
onMounted(() => {
  selectedMembers.value = props.availableMembers.map(member => ({
    ...member,
    role: 'PA', // 기본 직책을 PA로 설정
  }));
});

// availableMembers가 변경되었을 때 선택된 구성원을 초기화하는 로직
watch(() => props.availableMembers, (newAvailableMembers, oldAvailableMembers) => {
  if (oldAvailableMembers.length === 0) {
    // 초기 로드 시
    selectedMembers.value = newAvailableMembers.map(member => ({
      ...member,
      role: 'PA', // 기본 직책을 PA로 설정
    }));
  } else {
    // 기존 선택 유지 및 새로운 구성원 추가
    const newSelectedMembers = newAvailableMembers.map(member => ({
      ...member,
      role: 'PA', // 기본 직책을 PA로 설정
    }));
    selectedMembers.value = [...selectedMembers.value, ...newSelectedMembers];
  }
});

// 구성원 추가 함수
const addMembers = async () => {
  if (selectedMembers.value.length === 0) {
    alert('추가할 구성원을 선택해 주세요.');
    return;
  }
  try {
    await emit('add-members', selectedMembers.value);
    alert('구성원이 성공적으로 추가되었습니다.');
    selectedMembers.value = [];
  } catch (error) {
    alert('구성원 추가 중 오류가 발생했습니다.'); // 에러 메시지 처리
  }
};

// 취소 버튼 클릭 시 확인 메시지 표시
const confirmClose = () => {
  if (selectedMembers.value.length > 0) {
    if (confirm('구성원 추가를 취소하시겠습니까?')) {
      emit('close');
    }
  } else {
    emit('close');
  }
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

@media (max-width: 768px) {
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
