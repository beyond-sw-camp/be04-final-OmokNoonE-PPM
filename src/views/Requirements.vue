<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
              <h6 class="text-white text-capitalize ps-3">요구사항</h6>
              <button @click="goRegisterRequirement" class="btn btn-info register-btn">요구사항 등록</button>
            </div>
          </div>
          <div class="card-body px-0 pb-2">
            <table class="table align-items-center mb-0">
              <thead class="sticky-header">
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-cate">요구사항ID</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-cate">요구사항명</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-cate">요구사항 내용</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-cate">요구사항 수정일자</th>
                <th class="text-secondary opacity-7"></th>
                <th class="text-secondary opacity-7"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="requirement in requirements" :key="requirement.requirementsId">
                <td>
                  <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center ps-4">
                      <h6 class="mb-0 text-sm">{{ requirement.requirementsId }}</h6>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0">{{ requirement.requirementsName }}</p>
                </td>
                <td class="align-middle text-center text-sm requirement-content">
                  <p class="text-xs text-secondary mb-0">{{ requirement.requirementsContent }}</p>
                </td>
                <td class="align-middle text-center text-sm requirement-created-date">
                  <p class="text-xs text-secondary mb-0">{{ transferDateTime(requirement.requirementsModifiedDate) }}</p>
                </td>
                <td v-if="projectMemberRoleId == 10601" class="align-middle text-end">
                  <button @click="editRequirement(requirement)" class="btn btn-warning btn-sm">Edit</button>
                  <button @click="confirmDelete(requirement)" class="btn btn-danger btn-sm">X</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <RegisterRequirement :isVisible="isModalVisible" @close="isModalVisible = false" @update="fetchRequirements"/>
    <ModifyRequirement :isVisible="isEditModalVisible" :requirement="selectedRequirement" @close="isEditModalVisible = false" @update="fetchRequirements" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RegisterRequirement from '@/views/RegisterRequirement.vue';
import ModifyRequirement from '@/views/components/ModifyRequirement.vue';
import {defaultInstance} from "@/axios/axios-instance";
import store from "@/store";
import { useToast } from 'vue-toastification';

const toast = useToast();
const requirements = ref([]);
const projectId = store.getters.projectId;
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const selectedRequirement = ref({});
const projectMemberId = store.getters.projectMemberId;
const projectMemberRoleId = store.getters.roleId;

const transferDateTime = (dateTime) => {
  return `${dateTime.slice(0, 3).map(part => String(part).padStart(2, '0')).join('-')}
                              ${dateTime.slice(3, 6).map(part => String(part).padStart(2, '0')).join(':')}`
}

const fetchRequirements = async () => {
  try {
    const response = await defaultInstance.get(`/requirements/list/${projectId}`);
    const data = response.data;
    requirements.value = data.result.viewRequirementsList.projectRequirementsList;

    requirements.value.sort((a, b) => b.requirementsId - a.requirementsId);

  } catch (error) {
    console.error('Error fetching requirements:', error);
    toast.warning("표시할 요구사항이 없습니다.")
  }
};

const deleteRequirement = async (recievedRequirement) => {
  const reason = prompt("삭제 사유를 입력해주세요:");
  if (!reason) {
    toast.warning('삭제 사유를 입력하세요.')
    console.log(projectMemberRoleId);
    return;
  }

  try {
    const response = await defaultInstance.delete(`/requirements/remove/${recievedRequirement.requirementsId}`, {
      data: {
        requirementsId: recievedRequirement.requirementsId,
        requirementsName: recievedRequirement.requirementsName,
        requirementsContent: recievedRequirement.requirementsContent,
        requirementHistoryReason: reason,
        requirementHistoryProjectMemberId: projectMemberId,
      }
    });

    if (response.status === 204) {
      requirements.value = requirements.value.filter(requirement => requirement.requirementsId !== recievedRequirement.requirementsId);
      toast.success('요구사항이 성공적으로 삭제되었습니다.');
    } else {
      alert('요구사항 삭제 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('Error deleting requirement:', error);
    toast.error('요구사항 삭제 중 오류가 발생했습니다.');
  }
};

const editRequirement = (requirement) => {
  selectedRequirement.value = {...requirement};
  isEditModalVisible.value = true;
};

const confirmDelete = (requirement) => {
  if (confirm('정말로 이 요구사항을 삭제하시겠습니까?')) {
    deleteRequirement(requirement);
  }
};

onMounted(() => {
  fetchRequirements();
});

const goRegisterRequirement = () => {
  isModalVisible.value = true;
};
</script>

<style scoped>

.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;  /* 배경색을 추가하여 아래의 행이 헤더를 가리지 않도록 합니다. */
  z-index: 10;  /* z-index를 추가하여 헤더가 다른 요소 위에 나타나도록 합니다. */
  transform: translateY(-20px);
}

.text-cate {
  font-size: 17px !important;  /* 원하는 크기로 조정합니다. */
}

.card{
  width: 93%;
  height: 74vh;
  overfolow: auto;
}

.card-body{
  overflow: auto;
  height: calc(80vh - 100px);
}

.btn-warning {
  background-color: #147e23;
  border-color: #147e23;
  color: white;
}

.btn-danger {
  margin-left: 5px;
}

.register-btn {
  margin-right: 20px;
  padding: 5px 20px !important;  /* 위아래 패딩을 5픽셀로 줄입니다. */
  font-size: 16px;
  height: 40px;
}

.requirement-content p {
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
