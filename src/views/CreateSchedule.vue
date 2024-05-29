<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div
                class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center ps-3">
                <div class="d-flex flex-column justify-content-center">
                  <h6 style="color: white !important;">일정 등록</h6>
                  <p class="modal-project-name" style="color: lightgray !important;">{{ schedule.projectName }}</p>
                </div>
              </div>
              <div class="modal-actions">
                <MaterialButton color="info" size="md" variant="fill" style="margin-right: 1em;"
                                @click="changeTab('details')">세부사항
                </MaterialButton>
                <MaterialButton color="info" size="md" variant="fill" style="margin-right: 1em;"
                                @click="changeTab('requirement')">요구사항
                </MaterialButton>
              </div>
            </div>
          </div>
          <div class="card-body px-0 pb-2">
            <div v-show="currentTab === 'details'" class="left-align-content">
              <h5>&nbsp; 주 속성</h5>
              <hr class="modal-divider">
              <!--   일정 제목     -->
              <div class="modal-info">
                <div class="modal-info-item">
                  <p class="importance">* </p>
                  <span class="modal-info-label">일정 제목</span>
                  <MaterialInput v-model="schedule.title" label="일정 제목을 입력하세요."></MaterialInput>
                </div>
              </div>
              <!--   시작일, 종료일, 총 소요일  -->
              <div class="modal-info">
                <div class="modal-info-item">
                  <p class="importance">* </p>
                  <span class="modal-info-label">시작일</span>
                  <MaterialInput type="date" v-model="schedule.startDate"></MaterialInput>
                </div>
                <div class="modal-info-item">
                  <p class="importance">* </p>
                  <span class="modal-info-label">종료일</span>
                  <MaterialInput type="date" v-model="schedule.endDate"></MaterialInput>
                </div>
                <div class="modal-info-item">
                  <span class="modal-info-label">총 소요일</span>
                  <span class="modal-info-value">{{ calculateTotalDays(schedule.startDate, schedule.endDate) }}</span>
                </div>
              </div>
              <!--   가중치  -->
              <div class="modal-info">
                <div class="modal-info-item">
                  <span class="modal-info-label">가중치</span>
                  <MaterialInput id="weight" type="number" label="가중치를 입력하세요.(1 ~ 100)"
                                 v-model="schedule.priority"></MaterialInput>
                </div>
              </div>

              <!--   부모, 선행 일정  -->
              <div class="modal-info">
                <div class="modal-info-item">
                  <span class="modal-info-label">부모 일정</span>
                  <span class="modal-info-value">{{ schedule.parentTitle }}</span>
                  <material-button
                    @click="searchSchedule('parent')"
                    >검색</material-button>
                </div>
                <div class="modal-info-item">
                  <span class="modal-info-label">선행 일정</span>
                  <span class="modal-info-value">{{ schedule.precedingTitle }}</span>
                  <material-button
                      @click="searchSchedule('preceding')"
                  >검색</material-button>
                </div>
              </div>

              <h5>&nbsp; 이해관계자</h5>
              <hr class="modal-divider">
              <!--   PM, PL   -->
              <div class="modal-info">
                <div class="modal-info-item">
                  <span class="modal-info-label">PM</span>
                  <template v-for="(stakeholder, index) in stakeholders" :key="index">
                    <span v-if="stakeholder.roleName === 10601"
                          class="modal-info-value">{{ stakeholder.name }}({{ stakeholder.id }})</span>
                  </template>
                </div>
                <div class="modal-info-item">
                  <span class="modal-info-label">PL</span>
                  <template v-for="(stakeholder, index) in stakeholders" :key="index">
                    <span v-if="stakeholder.roleName === 10602"
                          class="modal-info-value">{{ stakeholder.name }}({{ stakeholder.id }})</span>
                  </template>
                </div>
              </div>
              <!--   담당자   -->
              <div class="modal-info">
                <div class="modal-info-item">
                  <p class="modal-info-label">담당자</p>
                  <div class="modal-info-value">
                    <p class="modal-responsible">
                      <template v-for="(stakeholder, index) in stakeholders" :key="index">
                      <span v-if="stakeholder.type === 10402"
                            class="modal-info-value">
                        {{ stakeholder.name }} ({{ stakeholder.id }})
                        <span v-if="index !== stakeholders.length - 1">,</span>
                      </span>
                      </template>
                    </p>
                  </div>
                </div>
              </div>
              <div class="modal-actions">
                <MaterialButton class="custom-button" @click="editStakeholders">수정</MaterialButton>
              </div>
              <div class="modal-info-item">
                <h5 class="importance">*</h5>
                <h5>일정 내용</h5>
              </div>
              <hr class="modal-divider">
              <div class="modal-description-container">
                <div class="modal-description">
                  <textarea class="textarea-description custom-textarea" v-model="schedule.content" rows="8"></textarea>
                </div>
              </div>
              <h5>&nbsp; 업무 목록</h5>
              <hr class="modal-divider">
              <div class="modal-tasks-container">
                <table class="modal-sheet">
                  <thead>
                  <tr>
                    <th style="width: 80%">업무 제목</th>
                    <th>
                      <div style="width: 100px">
                        수행 여부
                      </div>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(task, index) in tasks" :key="task.id">
                    <td v-if="tasks.length > 0" class="task-title">
                      <div style="width: 80%">
                        {{ task.title }}
                      </div>
                    </td>
                    <td v-if="tasks.length > 0" class="task-isCompleted">
                      <div style="width: 100px">
                        <input style="width: 13px" type="checkbox" v-model="task.isCompleted">
                        <label style="width: 42px">{{ task.isCompleted ? '완료' : '미완료' }}</label>
                      </div>
                    </td>
                    <td v-if="tasks.length > 0">
                      <MaterialButton style="width: 60px" class="delete-button" @click="deleteTask(index)">삭제
                      </MaterialButton>
                    </td>
                  </tr>
                  <tr>
                    <td class="task-title" style="width: 80%">
                      <MaterialInput type="text" label="새 업무명을 입력하세요." v-model="newTaskTitle"></MaterialInput>
                    </td>
                    <td class="task-isCompleted">
                      <div style="width: 100px">
                        <input style="width: 13px" type="checkbox" disabled="true">
                        <label style="width: 42px">미완료</label>
                      </div>
                    </td>
                    <td>
                      <MaterialButton class="custom-button" style="width: 60px" @click="addTask">추가</MaterialButton>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

            </div>
            <div v-show="currentTab === 'requirement'">
              <h5>요구사항</h5>
              <table class="modal-sheet">
                <thead>
                <tr>
                  <th style="width: 30%">요구사항명</th>
                  <th style="width: 50%">내용</th>
                  <th>
                    <div style="width: 60px">
                      자세히
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(requirement, index) in requirements" :key="index">
                  <td style="width: 30%">{{ requirement.requirementId }}</td>
                  <td style="width: 50%">{{ requirement.requirementName }}</td>
                  <td>
                    <MaterialButton class="custom-button" style="width: 60px"
                                    @click="viewRequirement(requirement.id)"></MaterialButton>
                  </td>
                  <td>
                    <MaterialButton class="delete-button" style="width: 60px" @click="deleteRequirement(index)">삭제
                    </MaterialButton>
                  </td>
                </tr>
                </tbody>
              </table>

              <div>
                <MaterialInput label="요구사항명을 입력하세요." type="text" v-model="requirementSearchValue"/>
                <MaterialButton class="custom-button" style="margin: 1em;" @click="searchRequirement">검색</MaterialButton>
              </div>
              <div v-if="isRequirementSearchModal">
                <table class="modal-sheet">
                  <thead>
                  <tr>
                    <th style="width: 30%">ID</th>
                    <th style="width: 50%">요구사항명</th>
                    <th>
                      <div style="width: 60px">
                        자세히
                      </div>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(requirement, index) in searchRequirements" :key="index">
                    <td style="width: 30%">{{ requirement.requirementId }}</td>
                    <td style="width: 50%">{{ requirement.requirementName }}</td>
                    <td>
                      <MaterialButton class="custom-button" style="width: 60px"
                                      @click="selectRequirement(requirement.id)"></MaterialButton>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <!-- 페이징 처리 -->
              <div>
                <button @click="previousPage">Previous</button>
                <span>Page {{ page }} of {{ totalPages }}</span>
                <button @click="nextPage">Next</button>
              </div>
            </div>

            <hr class="modal-divider">
            <div class="modal-actions">
              <p v-if="showInfoMessage" class="info-message">* 표시된 항목을 채워주세요. </p>
              <div>
                <MaterialButton class="custom-button" style="margin: 1em;" @click="checkValidation">일정 등록
                </MaterialButton>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isSearchModal">
          <!-- 검색 모달 창 -->
          <div class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">일정 검색</h5>
                </div>
                <div class="modal-body">
                  <p>일정 검색 모달 창</p>
                  <material-input
                    label="일정 제목을 입력하세요."
                    v-model="scheduleTitle"
                  >일정 제목</material-input>
                </div>
                <table>
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>제목</th>
                    <th>내용</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(schedule, id) in searchSchedules" :key="id">
                    <td>{{ schedule.id }}</td>
                    <td>{{ schedule.title }}</td>
                    <td>{{ schedule.content }}</td>
                    <td>
                      <material-button variant="fill" color="info" @click="selectSchedule(schedule)">선택</material-button>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div class="modal-footer">
                  <material-button variant="fill" color="info" @click="isSearchModal = false">닫기</material-button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
<!--    <AddProjectMemberToScheduleModal-->
<!--        v-if="isEditProjectMemberVisible" :newStakeholders="newStakeholders"-->
<!--        @close="isEditProjectMemberVisible = false" @add-members="addStakeholders">-->
<!--    </AddProjectMemberToScheduleModal>-->
  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import {defaultInstance} from "@/axios/axios-instance";
// import AddProjectMemberToScheduleModal from "@/views/components/AddProjectMemberToScheduleModal.vue";

export default {
  components: {
    // AddProjectMemberToScheduleModal,
    MaterialButton,
    MaterialInput,
  },
  data() {
    return {
      schedule: {
        id: null,
        title: '',
        content: '',
        startDate: '',
        endDate: '',
        priority: null,
        progress: null,
        status: null,
        manHours: null,
        parentId: '',
        parentTitle: '',
        precedingId: '',
        precedingTitle: '',
        createdDate: '',
        modifiedDate: '',
        projectName: '',
      },
      stakeholders: [
        {
          // name: store.getName(),
          name: '홍길동',
          // employeeId: store.getEmployeeId,
          employeeId: "EP001",
          id: null,
          type: 10401,    // 작성자
          roleName: 10601,  //PM
          projectMemberId: null,
        }
      ],
      searchSchedules: [
        {
          id: null,
          title: '',
          content: '',
          type: '',
        }
      ],
      requirements: [   // 일정에 등록할 요구사항
        {
          requirementId: null,
          requirementName: '',
          requirementContent: '',
        }
      ],
      requirementList: [    // 요구사항 목록
        {
          requirementId: null,
          requirementName: '',
          requirementContent: '',
        }
      ],
      searchRequirements: [ // 요구사항 검색 결과
        {
          requirementId: null,
          requirementName: '',
          requirementContent: '',
        }
      ],
      newStakeholders: [],
      tasks: [],
      newTaskTitle: '',
      currentTab: 'details',
      showInfoMessage: false,
      requirementSearchValue: '',
      isEditProjectMemberVisible: false,
      isSearchModal: false,
      scheduleTitle: '',
      size: 10,
      page: 1,
      totalPages: 0,
      isRequirementSearchModal: false,
    };
  },
  methods: {
    calculateTotalDays(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end - start;
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return dayDiff >= 0 ? dayDiff : '유효하지 않은 날짜';
    },
    changeTab(tabName) {
      this.currentTab = tabName;
      if (tabName === 'requirement') {
        this.getRequirements();
      }
    },
    addTask() {
      if (this.newTaskTitle.trim() !== '') {
        this.tasks.push({id: null, title: this.newTaskTitle, isCompleted: false});
        this.newTaskTitle = '';
      }
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
    addRequirement() {
      // 요구사항 추가 로직 구현
    },
    deleteRequirement(index) {
      this.requirements.splice(index, 1);
    },
    getRequirements() {
      // 요구사항 목록 조회 로직 구현
      try {
        const projectId = 1;
        const response = defaultInstance.get(`/requirements/list/${projectId}/${this.page}/${this.size}`);
        const data = response.data.result.viewRequirementsByProjectIdByPage;
        this.requirementList = data.map(requirement => ({
          requirementId: requirement.requirementsId,
          requirementName: requirement.requirementsName,
          requirementContent: requirement.requirementsContent,
        }))

      } catch (error) {
        console.log(error);
      }
    },
    searchRequirement() {
      // 요구사항 검색 로직 구현
      try {
        const projectId = 1;
        const response = defaultInstance.get(`/requirements/search/${projectId}/${this.requirementSearchValue}`);
        const data = response.data.result.searchRequirementsByName;
        this.searchRequirements = data.map(requirement => ({
          requirementId: requirement.requirementsId,
          requirementName: requirement.requirementsName,
          requirementContent: requirement.requirementsContent,
        }))
        this.isRequirementSearchModal = true;
      } catch (error) {
        console.log(error);
      }
    },
    selectRequirement(requirementId) {
      // 요구사항 선택 로직 구현
      console.log('requirementId :', requirementId);
      this.requirements.push({
        requirementId: requirementId,
        requirementName: '',
        requirementContent: '',
      });
    },
    viewRequirement(requirementId) {
      // 요구사항 자세히 보기 로직 구현
      console.log('requirementId :', requirementId);
    },
    checkValidation() {
      console.log('schedule: ', this.schedule);
      console.log('stakeholders: ', this.stakeholders);
      console.log('tasks: ', this.tasks);
      console.log('requirements: ', this.requirements);
      // 유효성 검사 로직 구현
      if (this.schedule.title.trim() === '' || this.schedule.startDate === '' || this.schedule.endDate === ''
          || this.schedule.content.trim() === '' || this.stakeholders.length === 0) {
        this.showInfoMessage = true;
      } else {
        this.showInfoMessage = false;
        this.saveScheduleChanges();
      }
    },
    saveScheduleChanges() {
      // 일정 등록 로직 구현
    },
    editStakeholders() {
      // 일정 이해관계자 수정 로직 구현
      this.isEditProjectMemberVisible = true;
    },
    // addStakeholders() {
    //   // 일정 이해관계자 추가 로직 구현
    // },

    // 부모 일정 검색
    searchSchedule(type) {
      this.isSearchModal = true;

      try {
        const response = defaultInstance.get(`/schedules/search/${this.scheduleTitle}`);
        const data = response.data.result.searchScheduleByTitle;
        this.searchSchedules = data.map(schedule => ({
          id: schedule.scheduleId,
          title: schedule.scheduleTitle,
          content: schedule.scheduleContent,
          type: type,
        }));
      } catch (error) {
        console.log(error);
      }
    },
    selectSchedule(schedule) {
      if (schedule.type === 'parent') {         // 부모 일정 선택
        this.schedule.parentId = schedule.id;
        this.schedule.parentTitle = schedule.title;
      }
      else if (schedule.type === 'preceding') { // 선행 일정 선택
        this.schedule.precedingId = schedule.id;
        this.schedule.precedingTitle = schedule.title;
      }

      // 일정 선택 후 검색 모달창 닫기
      this.isSearchModal = false;
    },
    // 요구사항 페이징 처리
    previousPage() {
      if (this.page > 1) {
        this.page--;
        this.getRequirements();
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.getRequirements();
      }
    },
  },
};
</script>

<style scoped>
.container-fluid {
  padding: 0 1.5rem;
}

.card {
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 0;
}

.card-body.px-0.pb-2 {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.modal-project-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.modal-divider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.left-align-content {
  text-align: left;
}

.modal-info {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.modal-info-item {
  flex: 1 1 30%;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-left: 10px;
  padding-right: 10px;
}

.modal-info-label {
  margin-right: 0.5rem;
  font-weight: bold;
  width: 100px;
}

.modal-info-value {
  flex: 1;
  font-weight: normal;
}

.modal-responsible {
  display: flex;
  flex-wrap: wrap;
}

.modal-description-container {
  margin-top: 1rem;
}

.modal-description {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.textarea-description {
  width: 100%;
  min-height: 100px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-tasks-container {
  margin-top: 1rem;
}

.importance {
  color: #e72222; /* 중요도 색상 설정 */
  font-size: 22px;
}

.modal-sheet {
  width: 100%;
  border-collapse: collapse;
}

.modal-sheet th,
.modal-sheet td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}

.modal-sheet th {
  background-color: #f9f9f9;
  font-weight: bold;
}

.custom-button {
  background: #4CAF50;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.custom-button:hover {
  background: #45a049;
}

.delete-button {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.delete-button:hover {
  background: #e70a0a;
}

.info-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
