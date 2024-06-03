<!-- AddProjectMemberCard.vue -->
<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <h5 class="modal-title">구성원 추가</h5>
          <!-- 검색 입력 -->
          <div class="search-container">
            <MaterialInput
                id="search"
                v-model="searchQuery"
                label="이름을 입력하세요..."
                @keyup.enter="searchMembers"
            />
            <i class="material-icons search-icon" @click="searchMembers">search</i>
          </div>
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
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">선택</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">사원번호</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">이름</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">권한</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">연락처</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="!searching && (availableMembersData?.length ?? 0) === 0">
                <td colspan="5" class="text-center text-muted" style="height: 320px;">
                  <span class="no-members-text">구성원 목록이 없습니다.</span>
                </td>
              </tr>
              <tr v-if="searching && (searchResults?.length ?? 0) === 0">
                <td colspan="5" class="text-center text-muted" style="height: 320px;">
                  <span class="no-members-text">검색 결과가 없습니다.</span>
                </td>
              </tr>
              <tr v-for="member in displayedMembers" :key="member.projectMemberEmployeeId">
                <td class="text-left">
                  <!-- 구성원 선택 체크박스 -->
                  <MaterialCheckbox :checked="isSelected(member)" @change="toggleSelection(member)"/>
                </td>
                <td class="text-center">
                  <!-- 구성원 사원번호 표시 -->
                  <p class="text-xs font-weight-bold mb-0">{{ member.projectMemberEmployeeId }}</p>
                </td>
                <td class="text-center">
                  <h6 class="mb-0 text-sm">{{ member.employeeName }}</h6>
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
                  <span class="text-secondary text-xs font-weight-bold text-left d-inline-block">
                      E-mail. {{ member.employeeEmail }}<br><span class="ps-1">Phone. {{ member.employeeContact }}</span>
                    </span>
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
import {ref, computed, watch, onMounted} from 'vue';
import {useStore} from 'vuex';
import MaterialInput from '@/components/MaterialInput.vue'; // MaterialInput 컴포넌트 임포트
import MaterialButton from '@/components/MaterialButton.vue'; // MaterialButton 컴포넌트 임포트
import MaterialCheckbox from '@/components/MaterialCheckbox.vue'; // MaterialCheckbox 컴포넌트 임포트
import {useToast} from 'vue-toastification';

// 이벤트를 부모 컴포넌트로 전달하기 위한 설정
const emit = defineEmits(['close']);

const selectedMembers = ref([]); // 선택된 구성원 목록을 저장
const searchQuery = ref(''); // 검색어를 저장
const store = useStore();
const toast = useToast();
const availableMembersLoading = ref(false); // 추가 가능한 구성원 로딩 상태
const searchResults = ref(); // 검색 결과를 저장
const availableMembersData = computed(() => store.getters.searchResults || []); // 원래의 추가 가능한 구성원 목록 가져오기

const searching = ref(false); // 검색 여부를 저장

const displayedMembers = computed(() => {
  if (searching.value) {
    return searchResults.value;
  }
  console.log(availableMembersData.value)
  return availableMembersData.value || [];
});

// 검색 함수
const searchMembers = async () => {
  searching.value = true;
  availableMembersLoading.value = true;
  try {
    await store.dispatch('fetchAvailableMembers', {query: searchQuery.value});
    searchResults.value = store.getters.searchResults ?? null;
    if (searchResults.value === null) {
      toast.error('검색 중 네트워크 오류가 발생했습니다.');
    } else if (searchResults.value.length === 0) {
      toast.info('검색 결과가 없습니다.');
    }
  } catch (error) {
    toast.error('검색 중 네트워크 오류가 발생했습니다.'); // 에러 메시지 처리
  } finally {
    availableMembersLoading.value = false;
  }
};

// 구성원 선택 상태 확인 함수
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

// 구성원 추가 함수
const addMembers = async () => {
  console.log(selectedMembers.value)
  if (selectedMembers.value.length === 0) {
    toast.error('추가할 구성원을 선택해 주세요.');
    return;
  }
  try {
    for (const member of selectedMembers.value) {
      await store.dispatch('addProjectMember', {member: member});
    }
    toast.success('구성원이 성공적으로 추가되었습니다.');
    selectedMembers.value = [];
    emit('close');
  } catch (error) {
    toast.error('구성원 추가 중 오류가 발생했습니다.'); // 에러 메시지 처리
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

// 모달이 열릴 때마다 기본 데이터 로드
watch(() => availableMembersData.value, async (newVal, oldVal) => {
  if (newVal.length === 0 && oldVal.length !== 0) {
    searching.value = false;
    await store.dispatch('fetchAvailableMembers');
  }
});

onMounted(async () => {
  await store.dispatch('fetchAvailableMembers');
});

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

.no-members-text {
  opacity: 0.5;
  font-size: 1.2rem;
}

.search-container {
  display: flex;
  align-items: center;
  width: 50%; /* 검색 창의 크기를 절반으로 설정 */
}

.search-icon {
  cursor: pointer;
  margin-left: 8px;
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

  .search-container {
    width: 100%; /* 작은 화면에서 검색 창의 크기를 100%로 설정 */
  }
}
</style>
