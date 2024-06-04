<template>
  <div class="modal-overlay" @click="closeModal"></div>
  <div class="project_modal">
    <div class="py-4 container-fluid">
      <div class="modal-container">
        <!-- 헤더 추가 -->
        <h4 class="card-header">프로젝트 목록</h4>
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
            <th>수정</th>
            <th>삭제</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="project in projects" :key="project.projectId">
            <td>{{ project.projectId }}</td>
            <td>
              <material-input
                  v-if="project.isNew || (editMode === 'modify' && project.projectId === selectedProjectId)"
                  v-model="project.projectTitle"
                  class="w-90"
                  :label="editMode === 'modify' ? '' : '제목'"
                  required
              ></material-input>
              <span v-else>{{ project.projectTitle }}</span>
            </td>
            <td>
              <material-input
                  v-if="project.isNew || (editMode === 'modify' && project.projectId === selectedProjectId)"
                  v-model="project.projectStartDate"
                  class="w-90"
                  type="date"
                  required
              ></material-input>
              <span v-else>{{ project.projectStartDate }}</span>
            </td>
            <td>
              <material-input
                  v-if="project.isNew || (editMode === 'modify' && project.projectId === selectedProjectId)"
                  v-model="project.projectEndDate"
                  class="w-90"
                  type="date"
                  required
              ></material-input>
              <span v-else>{{ project.projectEndDate }}</span>
            </td>
            <td>
              <select v-if="editMode === 'modify' && project.projectId === selectedProjectId"
                      v-model="project.projectStatus" class="form-select form-select-sm"
                      :disabled="!(editMode === 'modify')">
                <option value="계획">계획</option>
                <option value="착수">착수</option>
                <option value="종료">종료</option>
                <option value="중단">중단</option>
              </select>
              <span v-else>{{ project.projectStatus }}</span>
            </td>
            <td>{{ project.projectModifiedDate }}</td>
            <td>
              <material-button
                  v-if="!project.isNew && !isEditing"
                  color="info"
                  @click="modifyProject(project)"
              >수정
              </material-button>

              <!-- 취소 버튼 -->
              <material-button
                  v-if="isEditing  && project.projectId === selectedProjectId"
                  color="warning"
                  @click="editMode === 'add' ? cancelAdd() : cancelModify()"
              >취소
              </material-button>
            </td>
            <td>
              <material-button
                  color="danger"
                  @click="deleteProject(project)"
              >삭제
              </material-button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="mx-3">
        <div v-if="isEditing">
          <material-button
              class="mt-4 w-25"
              @click="editMode === 'add' ? saveNewProject() : saveModifiedProject()"
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
      <div v-if="showModifyReasonModal" class="modify-reason-modal">
        <div class="modal-content w-100">
          <h5 class="text-center bg-dark text-white">수정 사유</h5>
          <material-input
              v-model="modifyReason"
              label="수정 사유를 입력하세요"
              required
          ></material-input>
          <div class="text-center">
            <material-button
                @click="confirmModify"
            >확인
            </material-button>
            <material-button
                color="danger"
                @click="cancelModify"
            >취소
            </material-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defaultInstance} from "@/axios/axios-instance";
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import store from "@/store";

export default {
  components: {MaterialButton, MaterialInput},
  data() {
    return {
      projects: [],
      isEditing: false,
      editMode: '',   // 'add' or 'modify'
      selectedProjectId: null,
      modifiedProject: null,
      showModifyReasonModal: false, // 수정 사유 입력 모달
      modifyReason: '',             // 수정 사유
      projectStatus: {
        '계획': 10201,
        '착수': 10202,
        '종료': 10203,
        '중단': 10204
      }
    };
  },
  mounted() {
    this.open();
  },
  methods: {
    async open() {
      try {
        const employeeId = store.getters.employeeId;
        const response = await defaultInstance.get(`projects/list/${employeeId}`);
        this.projects = response.data.result.viewProjectList;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    close() {
      store.commit("setIsProjectModalOpen", false);
      this.isEditing = false;
      this.editMode = '';
      this.selectedProjectId = null;
      this.modifiedProject = null;
      this.showModifyReasonModal = false;
      this.modifyReason = '';
    },
    create() {
      this.isEditing = true;
      this.editMode = 'add';
      this.projects.unshift({
        projectId: '',
        projectTitle: '',
        projectStartDate: '',
        projectEndDate: '',
        projectStatus: '계획',
        projectModifiedDate: '',
        employeeId: store.getters.employeeId,
        isNew: true,
      });
      this.selectedProjectId = this.projects[0].projectId;
    },
    async saveNewProject() {
      try {
        console.log('Saving project:', this.projects[0])
        const requestBody = {
          projectTitle: this.projects[0].projectTitle,
          projectStartDate: this.projects[0].projectStartDate,
          projectEndDate: this.projects[0].projectEndDate,
          projectStatus: this.projects[0].projectStatus,
          employeeId: store.getters.employeeId,
          employeeName: store.getters.employeeName
        }
        console.log('requestBody : ', requestBody);
        const response = await defaultInstance.post('/projects/create', requestBody);
        if (!(response.status >= 200 && response.status < 300)) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.projects[0].isNew = false;
        this.isEditing = false;
        await this.open();
      } catch (error) {
        console.error('Error creating projects:', error);
      }
    },
    async modifyProject(project) {
      this.isEditing = true;
      this.editMode = 'modify';
      this.selectedProjectId = project.projectId;
      this.modifiedProject = project;
      console.log('Modifying project:', project)
    },
    async deleteProject(project) {
      try {
        const response = await defaultInstance.delete(`/projects/delete/${project.projectId}`);
        if (!(response.status >= 200 && response.status < 300)) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await this.open();
      } catch (error) {
        console.error('Error deleting projects:', error);
      }
    },
    cancelAdd() {
      this.isEditing = false;
      this.projects.shift();
      this.selectedProjectId = null;
    },
    cancelModify() {
      this.isEditing = false;
      this.editMode = '';
      this.selectedProjectId = null;
      this.showModifyReasonModal = false;
    },
    saveModifiedProject() {
      this.showModifyReasonModal = true;
    },
    async confirmModify() {
      this.showModifyReasonModal = false;
      this.isEditing = false;
      this.editMode = '';
      this.selectedProjectId = null;
      try {
        const requestBody = {
          projectId: this.modifiedProject.projectId,
          projectMemberId: 1,
          projectTitle: this.modifiedProject.projectTitle,
          projectStartDate: this.modifiedProject.projectStartDate,
          projectEndDate: this.modifiedProject.projectEndDate,
          projectStatus: this.projectStatus[this.modifiedProject.projectStatus],
          projectHistoryReason: this.modifyReason
        }
        console.log('requestBody : ', requestBody);
        const response = await defaultInstance.put('/projects/modify', requestBody);
        if (!(response.status >= 200 && response.status < 300)) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.modifyReason = '';
        await this.open();
      } catch (error) {
        console.error('프로젝트 수정 중 오류가 발생하였습니다:', error);
      }
    },
    closeModal() {
      this.close();
    }
  },
};
</script>

<style>
.project_modal {
  position: absolute;
  top: 55%;
  left: 50%;
  min-width: 700px; /* 너비 설정 */
  min-height: 400px; /* 높이 설정 */
  width: 100%;
  height: 100%;
  max-width: 160vh;
  max-height: 83vh;
  transform: translate(-50%, -50%);
  background-color: #F0F2F5;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* 그림자 추가 */
  z-index: 1000;
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
.modify-reason-modal{
  width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #F0F2F5;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  padding: 20px;
}
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
}
</style>
