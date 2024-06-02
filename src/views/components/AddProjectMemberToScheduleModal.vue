<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <h5 class="modal-title">이해관계자 추가</h5>
          <!-- 검색 입력 -->
          <div class="search-container">
            <MaterialInput id="search" v-model="searchQuery" label="이름을 입력하세요..." @keyup.enter="searchMembers"
            />
            <i class="material-icons search-icon" @click="searchMembers">search</i>
          </div>
        </div>
        <div class="modal-body">
          <!-- 로딩 중일 때 로딩 스피너를 표시 -->
          <div v-if="loadingState && !searchState" class="loading-spinner">로딩 중...</div>
          <!-- 로딩이 완료되면 구성원 추가 테이블을 표시 -->
          <div v-else class="table-responsive p-0">
            <table class="table align-items-center mb-0">
              <!-- 컬럼 헤더 -->
              <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-left ps-3">선택</th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-left ps-3">이름(사원번호)
                </th>
                <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-left ps-1">직책</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="member in searchResults" :key="member.projectMemberId">
                <!-- 구성원 선택 체크박스 -->
                <td class="text-left">
                  <input type="checkbox" v-model="member.isChecked">
                </td>
                <!-- 구성원 이름(사원번호) 표시 -->
                <td class="text-left">
                  <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{ member.name }}({{ member.employeeId }})</h6>
                    </div>
                  </div>
                </td>
                <!-- 구성원 직책 -->
                <td class="text-left">
                  <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{
                          member.roleName === 10601 ? 'PM' : (member.roleName === 10602 ? 'PL' : 'PA')
                        }}</h6>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="!(searchState && searchResults.length > 0)">
                <td colspan="3" class="text-center text-muted" style="height: 320px;">
                  <span class="no-members-text">검색 결과가 없습니다.</span>
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
          <MaterialButton color="info" size="md" variant="fill" @click="async () => {
            await addMembers();
            await confirmClose();
          }">추가하기
          </MaterialButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import MaterialInput from '@/components/MaterialInput.vue'; // MaterialInput 컴포넌트 임포트
import MaterialButton from '@/components/MaterialButton.vue'; // MaterialButton 컴포넌트 임포트
// import {useToast} from 'vue-toastification';
import {defaultInstance} from "@/axios/axios-instance";

// 이벤트를 부모 컴포넌트로 전달하기 위한 설정
const emit = defineEmits(['close', 'add-members']);

const searchQuery = ref(''); // 검색어를 저장
// const toast = useToast();
const loadingState = ref(true); // 추가 가능한 구성원 로딩 상태
const searchState = ref(false);

const projectMembers = ref([]);
const copyProjectMembers = ref([]);
const searchResults = ref([]); // 검색 결과를 저장

onMounted(async () => {
  try {
    // const projectId = store.getters['project/getProjectId'];
    const projectId = 1;
    /* 실질적인 API 주소 확인해야함. Controller 메소드 확인 */
    const response = await defaultInstance.get(`projectMembers/list/${projectId}`);
    projectMembers.value = response.data.result.viewProjectMembersByProject;
    for (let i = 0; i < projectMembers.value.length; i++) {
      const projectMemberEmployeeId = projectMembers.value[i].projectMemberEmployeeId;
      const projectMemberId = projectMembers.value[i].projectMemberId;

      copyProjectMembers.value[i] = {
        name: '데이터 필요',
        employeeId: projectMemberEmployeeId,
        projectMemberId: projectMemberId,
        roleName: 10603, // 실제 값을 넣어야 함. 지금은 다 PA로 표시
        isChecked: false, // 체크박스에 활용될 Value 추가
      };
    }
    searchResults.value = copyProjectMembers.value;
    loadingState.value = false;
    console.log('copySchedule.value : ', copyProjectMembers.value);

  } catch (error) {
    console.error(error);
  }
});


// 검색 함수
const searchMembers = async () => {
  searchState.value = true;
  searchResults.value = copyProjectMembers.value.filter(member =>
      member.name.includes(searchQuery.value)
  );
  searchState.value = false;
};

// 구성원 추가 함수
const addMembers = async () => {
  if (!copyProjectMembers.value.some(member => member.isChecked)) {
    alert('추가할 구성원을 선택해 주세요.');
    return;
  }
  try {
    const selectedMembers = copyProjectMembers.value.filter(member => member.isChecked);
    console.log('selectedMembers : ', selectedMembers);
    console.log('copyProjectMembers.value.filter: ', copyProjectMembers.value.filter(member => member.isChecked));
    emit('add-members', selectedMembers);
    emit('close');
  } catch (error) {
    alert('구성원 추가 중 오류가 발생했습니다.'); // 에러 메시지 처리
  }
};

// 취소 버튼 클릭 시 확인 메시지 표시
const confirmClose = () => {
  if (copyProjectMembers.value.some(member => member.isChecked)) {
    if (confirm('구성원 추가를 취소하시겠습니까?')) {
      copyProjectMembers.value.forEach(member => {
        member.isChecked = false;
      });
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

  .btn {
    margin-bottom: 10px;
  }

  .search-container {
    width: 100%; /* 작은 화면에서 검색 창의 크기를 100%로 설정 */
  }
}
</style>
