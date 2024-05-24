<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center ps-3">
                <i class="material-icons text-white me-2">groups</i>
                <h6 class="text-white text-capitalize mb-0">프로젝트 구성원</h6>
              </div>
              <MaterialButton color="info" size="md" variant="fill" class="me-3" @click="isModalVisible = true">+ 새로운 구성원</MaterialButton>
            </div>
          </div>
          <div class="card-body px-0 pb-2" style="max-height: 480px; min-height: 480px; overflow-y: auto;">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">이름</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-1">직책</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center ps-2">연락처</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-4">시작일</th>
                  <th class="text-secondary opacity-7"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="!projectMembers || projectMembers.length === 0">
                  <td colspan="5" class="text-center text-muted" style="height: 320px;">
                    <span class="no-members-text">프로젝트에 참여하는 구성원이 없습니다.</span>
                  </td>
                </tr>
                <tr v-else v-for="projectMember in projectMembers" :key="projectMember.id">
                  <td class="text-left">
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ projectMember.name }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="text-left">
                    <p class="text-xs font-weight-bold mb-0">{{ projectMember.role }}</p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <span class="text-secondary text-xs font-weight-bold text-left d-inline-block">E-mail. {{ projectMember.email }}<br><span class="ps-1">Phone. {{ projectMember.phone }}</span></span>
                  </td>
                  <td class="align-middle text-left text-sm">
                    <span class="text-secondary text-xs font-weight-bold">{{ projectMember.startDate }}</span>
                  </td>
                  <td class="align-middle">
                    <button class="btn btn-link text-secondary mb-0" @click="confirmRemoveProjectMember(projectMember.id)" data-toggle="tooltip" data-original-title="팀에서 제외">
                      x
                    </button>
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
    <AddProjectMemberCard v-if="isModalVisible" :available-members="availableMembers" @close="isModalVisible = false" @add-members="addMembers"></AddProjectMemberCard>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import MaterialButton from '@/components/MaterialButton.vue';
import AddProjectMemberCard from '@/views/components/AddProjectMemberCard.vue';

const props = defineProps({
  projectId: Number,
});

const store = useStore();
const isModalVisible = ref(false); // 모달 표시 상태

// 프로젝트 구성원 데이터를 가져오는 함수
const fetchProjectMembers = async () => {
  await store.dispatch('fetchProjectMembers');
};

// 현재 프로젝트에 추가되지 않은 회원 데이터를 가져오는 함수
const fetchAvailableMembers = async () => {
  await store.dispatch('fetchAvailableMembers');
};

// 필터링된 프로젝트 구성원 및 추가 가능한 구성원 목록을 가져오는 computed property
const projectMembers = computed(() => store.getters.filteredProjectMembers || []);
const availableMembers = computed(() => store.getters.filteredAvailableMembers || []);

// 새로운 구성원을 추가하는 함수
const addMembers = async (selectedMembers) => {
  if (selectedMembers.length === 0) {
    alert('추가할 구성원을 선택해 주세요.');
    return;
  }

  for (const member of selectedMembers) {
    await store.dispatch('addProjectMember', { memberId: member.id, role: member.role });
  }

  isModalVisible.value = false;
  await fetchProjectMembers();
  await fetchAvailableMembers();
};

// 구성원을 제외하기 전에 확인 메시지를 표시하는 함수
const confirmRemoveProjectMember = async (projectMemberId) => {
  const confirmDelete = window.confirm('팀에서 제외 시키겠습니까?');
  if (confirmDelete) {
    await store.dispatch('removeProjectMember', projectMemberId);
  }
};

// 컴포넌트가 마운트될 때 프로젝트 ID를 설정하고 데이터를 가져옴
onMounted(async () => {
  store.commit('SET_PROJECT_ID', props.projectId);
  await fetchProjectMembers();
  await fetchAvailableMembers();
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
