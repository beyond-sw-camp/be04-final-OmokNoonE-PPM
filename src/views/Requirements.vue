<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3">
              <h6 class="text-white text-capitalize ps-3">요구사항</h6>
              <button @click="goRegisterRequirement" class="btn btn-success register-btn">요구사항 등록</button>
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
                      <div class="d-flex fl ex-column justify-content-center ps-4">
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
                    <p class="text-xs text-secondary mb-0">{{ requirement.requirementsModifiedDate }}</p>
                  </td>
                  <td class="align-middle text-end">
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
import axios from 'axios';
import { useRoute } from "vue-router";
import RegisterRequirement from '@/views/RegisterRequirement.vue';
import ModifyRequirement from '@/views/ModifyRequirement.vue';  // 경로 확인 및 수정

const requirements = ref([]);
const route = useRoute();
const projectId = route.params.projectId;
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const selectedRequirement = ref({});
const currentUserId = ref(1);

const fetchRequirements = async () => {
  try {
    const response = await axios.get(`http://localhost:8888/requirements/list/${projectId}`);
    const data = response.data;
    console.log(data.result.viewRequirementsList.projectRequirementsList);
    requirements.value = data.result.viewRequirementsList.projectRequirementsList;

    requirements.value.sort((a, b) => b.requirementsId - a.requirementsId);

  } catch (error) {
    console.error('Error fetching requirements:', error);
  }
};

const deleteRequirement = async (requirementsId) => {
  const reason = prompt("삭제 사유를 입력해주세요:");
  if (!reason) {
    alert("삭제 사유가 필요합니다.");
    return;
  }

  try {
    const response = await axios.delete(`http://localhost:8888/requirements/remove/${requirementsId}`, {
      data: {
        requirementHistoryReason: reason,
        requirementHistoryProjectMemberId: currentUserId.value
      }
    });

    if (response.status === 204) {
      requirements.value = requirements.value.filter(requirement => requirement.requirementsId !== requirementsId);
      alert('요구사항이 성공적으로 삭제되었습니다.');
    } else {
      alert('요구사항 삭제 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('Error deleting requirement:', error);
    alert('요구사항 삭제 중 오류가 발생했습니다.');
  }
};

const editRequirement = (requirement) => {
  selectedRequirement.value = {...requirement};
  isEditModalVisible.value = true;
};

const confirmDelete = (requirement) => {
  if (confirm('정말로 이 요구사항을 삭제하시겠습니까?')) {
    deleteRequirement(requirement.requirementsId);
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
  width: 100%;
  height: 80vh;
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
  right: 60px;  /* 오른쪽에서 20픽셀 떨어진 위치에 배치합니다. */
  transform: translateY(10%);
  top: 10%;
  background-color: #147e23;  /* 배경색을 추가합니다. */
  position: fixed;
  bottom: 20px;
  z-index: 1000;
  padding: 5px 20px !important;  /* 위아래 패딩을 5픽셀로 줄입니다. */
  font-size: 16px;
  height: 40px;
}

.requirement-content p {
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
