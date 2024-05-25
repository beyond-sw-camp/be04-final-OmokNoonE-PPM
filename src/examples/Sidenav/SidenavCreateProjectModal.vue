<template>
  <div class="project_modal" v-if="isActive">
    <div class="py-4 container-fluid">
      <div class="modal-container">
        <!-- 헤더 추가 -->
        <h2 class="card-header">프로젝트 목록</h2>
        <!-- 프로젝트 목록 -->
        <table class="table">
          <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>시작일</th>
            <th>마감일</th>
            <th>상태</th>
            <th>마지막 수정 날짜</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="project in projects" :key="project.projectId">
            <td>{{ project.projectId }}</td>
            <td>
              <material-input
                  v-if="project.isNew"
                  v-model="project.projectTitle"
                  class="w-90"
                  label="제목"
                  required
              ></material-input>
              <span v-else>{{ project.projectTitle }}</span>
            </td>
            <td>
              <material-input
                  v-if="project.isNew"
                  v-model="project.projectStartDate"
                  class="w-90"
                  type="date"
                  required
              ></material-input>
              <span v-else>{{ project.projectStartDate }}</span>
            </td>
            <td>
              <material-input
                  v-if="project.isNew"
                  v-model="project.projectEndDate"
                  class="w-90"
                  type="date"
                  required
              ></material-input>
              <span v-else>{{ project.projectEndDate }}</span>
            </td>
            <td>{{ project.projectStatus }}</td>
            <td>{{ project.projectModifiedDate }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="mx-3">
        <div v-if="isEditing">
          <material-button
              class="mt-4 w-25"
              @click="saveProject"
              :class="`bg-gradient-${this.$store.state.color}`"
          >저장
          </material-button>
        </div>
        <div v-else>
          <material-button
              class="mt-4 w-25"
              @click="create"
              :class="`bg-gradient-${this.$store.state.color}`"
          >추가
          </material-button>
        </div>
        <material-button
            class="mt-4 w-25"
            color="cancel"
            @click="close"
        >닫기
        </material-button>
      </div>
    </div>
  </div>
  <div class="modal" :class="{ 'is-active': isActive }" v-if="isActive">
  </div>
</template>

<script>
import {authInstance, defaultInstance} from "@/axios/axios-instance";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialInput from "@/components/MaterialInput.vue";
// import router from "@/router";

export default {
  components: {MaterialButton, MaterialInput},
  data() {
    return {
      isActive: false,
      projects: [],
      isEditing: false,
    };
  },
  methods: {
    async open() {
      this.isActive = true;
      try {
        let employeeId = "EP001";
        const response = await authInstance.get(`projects/list/${employeeId}`);
        this.projects = response.data.result.viewProjectList;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    close() {
      this.isActive = false;
      this.isEditing = false;
    },
    selectProject(project) {
      console.log(`Selected project ID: ${project.projectId}`);
    },
    create() {
      this.isEditing = true;
      this.projects.unshift({
        projectId: '',
        projectTitle: '',
        projectStartDate: '',
        projectEndDate: '',
        projectStatus: '계획',
        projectModifiedDate: '',
        isNew: true,
      });
    },
    async saveProject() {
      try {
        await defaultInstance.post(`projects/create`, this.projects[0]);
        this.projects[0].isNew = false;
        this.isEditing = false;
        await this.open();
      } catch (error) {
        console.error('Error creating projects:', error);
      }
    },
  },
};
</script>

<style>
.project_modal {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 800px; /* 너비 설정 */
  height: 600px; /* 높이 설정 */
  transform: translate(-50%, -50%);
  background-color: #F0F2F5;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* 그림자 추가 */
}

.modal-container {
  width: 95%; /* project_modal보다 살짝 작게 설정 */
  height: 95%; /* project_modal보다 살짝 작게 설정 */
  background-color: #ffffff; /* 흰색 배경 적용 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px
}

.project_modal .button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.btn.mt-4 {
  position: absolute;
  top: 80%;
  font-size: large;
  /* 기타 필요한 스타일 */
}

.btn.mt-4:nth-child(1) {
  left: 20%;
}

.btn.mt-4:nth-child(2) {
  left: 55%;
  background-color: gray;
  color: white;
}

tr,
td {
  text-align: center;
  vertical-align: middle;
}
</style>