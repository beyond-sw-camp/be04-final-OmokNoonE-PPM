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
              <MaterialButton color="info" size="md" variant="fill" class="me-3" @click="showModal = true">+ 새로운 구성원</MaterialButton>
            </div>
          </div>
          <div class="card-body px-0 pb-2" style="max-height: 400px; overflow-y: auto;">
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
                <tr v-if="filteredTeamMembers.length === 0">
                  <td class="text-left">
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">-</h6>
                      </div>
                    </div>
                  </td>
                  <td class="text-left">
                    <p class="text-xs font-weight-bold mb-0">-</p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <span class="text-secondary text-xs font-weight-bold text-center d-block">-</span>
                  </td>
                  <td class="align-middle text-left text-sm">
                    <span class="text-secondary text-xs font-weight-bold">-</span>
                  </td>
                  <td class="align-middle"></td>
                </tr>
                <tr v-for="teamMember in filteredTeamMembers" :key="teamMember.id">
                  <td class="text-left">
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ teamMember.name }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="text-left">
                    <p class="text-xs font-weight-bold mb-0">{{ teamMember.role }}</p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <span class="text-secondary text-xs font-weight-bold text-left d-inline-block">E-mail. {{ teamMember.email }}<br><span class="ps-1">Phone. {{ teamMember.phone }}</span></span>
                  </td>
                  <td class="align-middle text-left text-sm">
                    <span class="text-secondary text-xs font-weight-bold">{{ teamMember.startDate }}</span>
                  </td>
                  <td class="align-middle">
                    <button class="btn btn-link text-secondary mb-0" @click="confirmRemoveTeamMember(teamMember.id)" data-toggle="tooltip" data-original-title="팀에서 제외">
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

    <AddProjectMemberCard v-if="showModal" :available-members="filteredAvailableMembers" @close="showModal = false" @add-members="addMembers"></AddProjectMemberCard>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MaterialButton from '@/components/MaterialButton.vue';
import AddProjectMemberCard from '@/views/components/AddProjectMemberCard.vue';

// 팀 멤버 데이터를 저장하는 ref
const teamMembers = ref([]);

// 모달 표시 상태를 관리하는 ref
const showModal = ref(false);

// 선택 가능한 모든 멤버 목록 (예시 데이터를 사용)
const availableMembers = ref([
  {
    id: 1,
    name: '김철수',
    email: 'chulsoo@ppmtest.com',
    phone: '010-1234-5678',
    role: 'PM',
    startDate: '2022-01-15',
    deleted: false
  },
  {
    id: 2,
    name: '이영희',
    email: 'younghee@ppmtest.com',
    phone: '010-9876-5432',
    role: 'PA',
    startDate: '2022-02-20',
    deleted: false
  },
  {
    id: 3,
    name: '박영수',
    email: 'youngsoo@ppmtest.com',
    phone: '010-2222-3333',
    role: 'PA',
    startDate: '2022-03-15',
    deleted: false
  },
  {
    id: 4,
    name: '최민수',
    email: 'minsoo@ppmtest.com',
    phone: '010-4444-5555',
    role: 'PA',
    startDate: '2022-04-10',
    deleted: false
  },
  {
    id: 5,
    name: '홍길동',
    email: 'gildong@ppmtest.com',
    phone: '010-6666-7777',
    role: 'PA',
    startDate: '2022-05-05',
    deleted: false
  },
]);

// 새로운 팀 멤버를 추가하는 함수
const createTeamMember = (member) => {
  const existingMemberIndex = teamMembers.value.findIndex((m) => m.id === member.id);
  if (existingMemberIndex !== -1) {
    teamMembers.value[existingMemberIndex].deleted = false;
    teamMembers.value[existingMemberIndex].role = member.role; // 직책 업데이트
    teamMembers.value[existingMemberIndex].startDate = new Date().toISOString().split('T')[0];
  } else {
    teamMembers.value.push({ ...member, startDate: new Date().toISOString().split('T')[0], deleted: false });
  }
};

// 초기 팀 멤버 데이터를 로드하는 함수
const viewTeamMembers = () => {
  const initialMembers = [
    {
      id: 1,
      name: '김철수',
      email: 'chulsoo@ppmtest.com',
      phone: '010-1234-5678',
      role: 'PM',
      startDate: '2024-05-23',
      deleted: false
    },
  ];

  initialMembers.forEach(member => createTeamMember(member));
};

// 팀 멤버를 제거하기 전에 확인 메시지를 표시하는 함수
const confirmRemoveTeamMember = (teamMemberId) => {
  const confirmDelete = window.confirm('팀에서 제외 시키겠습니까?');
  if (confirmDelete) {
    removeTeamMember(teamMemberId);
  }
};

// 팀 멤버를 soft delete 하는 함수
const removeTeamMember = (teamMemberId) => {
  const teamMemberIndex = teamMembers.value.findIndex(member => member.id === teamMemberId);
  if (teamMemberIndex !== -1) {
    teamMembers.value[teamMemberIndex].deleted = true; // Soft delete
  }
};

// soft delete가 되지 않은 팀 멤버만 필터링하는 computed property
const filteredTeamMembers = computed(() => {
  return teamMembers.value.filter(member => !member.deleted);
});

// 현재 추가되지 않은 멤버를 필터링하는 computed property
const filteredAvailableMembers = computed(() => {
  const addedMemberIds = teamMembers.value.filter(member => !member.deleted).map(member => member.id);
  return availableMembers.value.filter(member => !addedMemberIds.includes(member.id));
});

// 컴포넌트가 마운트될 때 초기 팀 멤버 데이터를 로드
onMounted(() => {
  viewTeamMembers();
});

// 선택한 새로운 팀 멤버들을 추가하는 함수
const addMembers = (selectedMemberIds) => {
  if (selectedMemberIds.length === 0) {
    alert('추가할 구성원을 선택해 주세요.');
    return;
  }

  const selectedMembers = availableMembers.value.filter(member => selectedMemberIds.includes(member.id));
  selectedMembers.forEach(member => createTeamMember(member));
  showModal.value = false;
};
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
</style>
