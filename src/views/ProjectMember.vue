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
                <i class="material-icons text-white me-2">groups</i>
                <h6 class="text-white text-capitalize mb-0">프로젝트 구성원</h6>
              </div>
              <div>
                <MaterialButton color="info" size="md" variant="fill" class="me-3" @click="isModifyModalVisible = true">
                  권한 변경
                </MaterialButton>
                <MaterialButton color="info" size="md" variant="fill" class="me-3" @click="isAddModalVisible = true">+
                  새로운 구성원
                </MaterialButton>
              </div>
            </div>
          </div>
          <!-- 카드 본문 -->
          <div class="card-body px-0 pb-2" style="max-height: 480px; min-height: 480px; overflow-y: auto;">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">사원번호
                  </th>
                  <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">이름</th>
                  <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">권한</th>
                  <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">연락처</th>
                  <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 text-center">시작일</th>
                  <th class="text-secondary opacity-7"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="projectMembersLoading">
                  <td colspan="5" class="text-center">
                    <span class="text-secondary">로딩 중...</span>
                  </td>
                </tr>
                <tr v-if="!projectMembersLoading && (!projectMembers || projectMembers.length === 0)">
                  <td colspan="5" class="text-center text-muted" style="height: 320px;">
                    <span class="no-members-text">프로젝트에 참여하는 구성원이 없습니다.</span>
                  </td>
                </tr>
                <tr v-else v-for="projectMember in projectMembers" :key="projectMember.projectMemberId">
                  <td class="text-center">
                    <p class="text-xs font-weight-bold mb-0">{{ projectMember.projectMemberEmployeeId }}</p>
                  </td>
                  <td class="text-center">
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{ projectMember.employeeName }}</h6>
                    </div>
                  </td>
                  <td class="text-center">
                    <p class="text-xs font-weight-bold mb-0">{{ projectMember.codeName || '-' }}</p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <span class="text-secondary text-xs font-weight-bold text-left d-inline-block">
                      E-mail. {{ projectMember.employeeEmail }}
                      <br><span class="ps-1">Phone. {{ projectMember.employeeContact }}</span>
                    </span>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <span class="text-secondary text-xs font-weight-bold">{{ convertArrayToDate(projectMember.projectMemberCreatedDate) }}</span>
                  </td>
                  <td class="align-middle">
                    <material-button
                            color="danger"
                            @click="confirmRemoveProjectMember(projectMember.projectMemberId)" data-toggle="tooltip"
                            data-original-title="팀에서 제외">
                      X
                    </material-button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 구성원 추가 모달 -->
    <AddProjectMemberCard v-if="isAddModalVisible"
                          @close="isAddModalVisible = false"/>
    <!-- 직책 변경 모달 -->
    <ModifyProjectMemberRoleCard v-if="isModifyModalVisible"
                                 @close="isModifyModalVisible = false"/>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import {useStore} from 'vuex';
import MaterialButton from '@/components/MaterialButton.vue';
import AddProjectMemberCard from '@/views/components/AddProjectMemberCard.vue';
import ModifyProjectMemberRoleCard from '@/views/components/ModifyProjectMemberRoleCard.vue';
import {useToast} from 'vue-toastification';

const store = useStore();
const toast = useToast();
const isAddModalVisible = ref(false); // 구성원 추가 모달 표시 상태
const isModifyModalVisible = ref(false); // 직책 변경 모달 표시 상태

// 프로젝트 구성원 데이터를 가져오는 함수
const fetchProjectMembers = async () => {
  try {
    await store.dispatch('fetchProjectMembers');
  } catch (error) {
    toast.error(error.message); // 에러 메시지 처리
  }
};

// 필터링된 프로젝트 구성원 목록을 가져오는 computed property
const projectMembers = computed(() => store.getters.projectMembers || []);
const projectMembersLoading = computed(() => store.state.projectMembersLoading); // 프로젝트 구성원 로딩 상태

// 구성원을 제외하기 전에 확인 메시지를 표시하는 함수
const confirmRemoveProjectMember = async (projectMemberId) => {
  const reason = window.prompt('구성원을 제외하는 이유를 입력하세요:');
  if (reason !== null && reason.trim() !== '') {
    const confirmDelete = window.confirm('팀에서 제외 시키겠습니까?');
    if (confirmDelete) {
      try {
        await store.dispatch('removeProjectMember', {memberId: projectMemberId, reason});
        toast.success('구성원이 성공적으로 제외되었습니다.');
      } catch (error) {
        toast.error(error.message); // 에러 메시지 처리
      } finally {
        await fetchProjectMembers();
      }
    }
  } else {
    toast.error('제외 사유를 입력해 주세요.');
  }
};

function convertArrayToDate(arr) {

    let date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);

    let formattedDate = date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + ' ' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2);

    return formattedDate;
}

// 컴포넌트가 마운트될 때 프로젝트 ID를 설정하고 데이터를 가져옴
onMounted(async () => {
  await fetchProjectMembers();
});
</script>

<style scoped>
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
</style>
