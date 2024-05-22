<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3">
              <h6 class="text-white text-capitalize ps-3">팀 멤버</h6>
            </div>
          </div>
          <div class="card-body px-0 pb-2" style="max-height: 300px; overflow-y: auto;">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left">이름</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-2">직책</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center ps-2">연락처</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-2">착수일</th>
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
                  <td class="align-middle text-left text-sm">
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
                  <td class="align-middle text-left text-sm">
                    <span class="text-secondary text-xs font-weight-bold text-center d-block">{{ teamMember.email }}<br>{{ teamMember.phone }}</span>
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

const teamMembers = ref([]);

const createTeamMember = (member) => {
  teamMembers.value.push(member);
};

const viewTeamMembers = () => {
  const initialMembers = [
    {
      id: 1,
      name: '김철수',
      email: 'chulsoo@creative-tim.com',
      phone: '010-1234-5678',
      role: 'Manager',
      status: 'Online',
      startDate: '23/04/18',
      deleted: false
    },
    {
      id: 2,
      name: '이영희',
      email: 'younghee@creative-tim.com',
      phone: '010-9876-5432',
      role: 'Programator',
      status: 'Offline',
      startDate: '11/01/19',
      deleted: false
    },
    // 추가 사용자 데이터
  ];

  initialMembers.forEach(member => createTeamMember(member));
};

const confirmRemoveTeamMember = (teamMemberId) => {
  const confirmDelete = window.confirm('팀에서 제외 시키겠습니까?');
  if (confirmDelete) {
    removeTeamMember(teamMemberId);
  }
};

const removeTeamMember = (teamMemberId) => {
  const teamMember = teamMembers.value.find(member => member.id === teamMemberId);
  if (teamMember) {
    teamMember.deleted = true; // Soft delete
  }
};

const filteredTeamMembers = computed(() => {
  return teamMembers.value.filter(member => !member.deleted);
});

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

.table th.text-center {
  text-align: center;
}

.text-center {
  text-align: center;
}
</style>
