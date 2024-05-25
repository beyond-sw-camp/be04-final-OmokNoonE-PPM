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
            <td>{{ project.projectTitle }}</td>
            <td>{{ project.projectStartDate }}</td>
            <td>{{ project.projectEndDate }}</td>
            <td>{{ project.projectStatus }}</td>
            <td>{{ project.projectModifiedDate }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="mx-3">
        <button
            class="btn mt-4 w-25"
            @click="create"
            :class="`bg-gradient-${this.$store.state.color}`"
        >생성
        </button>
        <button
            class="btn mt-4 w-25"
            @click="close"

        >취소
        </button>
      </div>
    </div>
  </div>
  <div class="modal" :class="{ 'is-active': isActive }" v-if="isActive">
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isActive: false,
      projects: [],
    };
  },
  methods: {
    async open() {
      this.isActive = true;
      try {
        let employeeId = "EP001";
        const response = await axios.get(`http://localhost:8888/projects/list/${employeeId}`);
        this.projects = response.data.result.viewProjectList;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    close() {
      this.isActive = false;
    },
    create() {
      // 프로젝트 생성 로직을 추가하세요.
      this.close();
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
  left: 25%;
  transform: translate(-25%, -50%);
}

.btn.mt-4:nth-child(2) {
  left: 75%;
  transform: translate(-75%, -50%);
  background-color: gray;
  color: white;
}

tr,
td {
  text-align: center;
}
</style>