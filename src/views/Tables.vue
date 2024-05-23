<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3">
              <h6 class="text-white text-capitalize ps-3">프로젝트 구성원</h6>
            </div>
          </div>
          <div class="card-body px-0 pb-2" style="max-height: 300px; overflow-y: auto;">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">이름</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-1">직책</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center ps-2">연락처</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-4">등록일</th>
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
                    <p class="text-xs font-weight-bold mb-0">{{ teamMember.role === 'Manager' ? 'PM' : teamMember.role === 'Programator' ? 'PA' : teamMember.role }}</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// 팀 멤버 데이터를 저장하는 ref
const teamMembers = ref([]);

// 새로운 팀 멤버를 추가하는 함수
const createTeamMember = (member) => {
  teamMembers.value.push(member);
};

// 초기 팀 멤버 데이터를 로드하는 함수
const viewTeamMembers = () => {
  const initialMembers = [
    {
      id: 1,
      name: '김철수',
      email: 'chulsoo@ppmtest.com',
      phone: '010-1234-5678',
      role: 'Manager',
      startDate: '2024-05-23',
      deleted: false
    },
    {
      id: 2,
      name: '이영희',
      email: 'younghee@ppmtest.com',
      phone: '010-9876-5432',
      role: 'Programator',
      startDate: '2024-05-23',
      deleted: false
    },
    // 추가 사용자 데이터
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
  const teamMember = teamMembers.value.find(member => member.id === teamMemberId);
  if (teamMember) {
    teamMember.deleted = true; // Soft delete
  }
};

// soft delete가 되지 않은 팀 멤버만 필터링하는 computed property
const filteredTeamMembers = computed(() => {
  return teamMembers.value.filter(member => !member.deleted);
});

// 컴포넌트가 마운트될 때 초기 팀 멤버 데이터를 로드
onMounted(() => {
  viewTeamMembers();
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
</style>
