<template>
  <div>
    <div>
      <p class="importance">*</p>
      <input id="title" v-model="schedule.title"/>
    </div>

    <!-- 프로젝트 이름 -->
    <p class="modal-project-name">{{ schedule.projectName }}</p>

    <div class="modal-actions">
      <button class="modal-action-button" @click="changeTab('details')">세부사항</button>
      <button class="modal-action-button" @click="changeTab('requirement')">요구사항</button>
    </div>

    <!-- 가로선 -->
    <hr class="modal-divider">

    <!-- 탭 내용 -->
    <div v-show="currentTab === 'details'">

      <!-- 시작일, 종료일, 총 소요일(공수) -->
      <div class="modal-info">
        <div class="modal-info-item">
          <p class="importance">*</p>
          <span class="modal-info-label">시작일:</span>
          <input id="startDate" type="date" v-model="schedule.startDate">
        </div>
        <div class="modal-info-item">
          <p class="importance">*</p>
          <span class="modal-info-label">종료일:</span>
          <input id="endDate" type="date" v-model="schedule.endDate">
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">총 소요일:</span>
          <span class="modal-info-value">
                {{
              Math.ceil(
                  (new Date(schedule.endDate) - new Date(schedule.startDate)) /
                  (1000 * 60 * 60 * 24)
              )
            }}
          </span>
        </div>
      </div>

      <!-- 가중치 -->
      <div class="modal-info">
        <div class="modal-info-item">
          <span class="modal-info-label">가중치:</span>
          <input id="weight" type="number" v-model="schedule.priority">
        </div>
      </div>

      <!-- 부모 일정, 선행 일정 -->
      <div class="modal-info">
        <div class="modal-info-item">
          <span class="modal-info-label">부모 일정:</span>
          <!--   TODO. 일정 선택 모달 창 구현     -->
          <input id="parentSchedule" v-model="schedule.parentId">
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">선행 일정:</span>
          <!--   TODO. 일정 선택 모달 창 구현     -->
          <input id="precedingSchedule" v-model="schedule.precedingId">
        </div>
      </div>

      <!--  PM, PL 잘못된 view   -->
      <div class="modal-info">
        <div class="modal-info-item">
          <span class="modal-info-label">PM:</span>
          <template v-for="(stakeholder, index) in stakeholders" :key="index">
                <span v-if="stakeholder.roleName === 10601" class="modal-info-value">
                  {{ stakeholder.name }}({{ stakeholder.id }})
                </span>
          </template>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">PL:</span>
          <!--   TODO. PL 값으로 변환 후 선택창 구현       -->
          <input id="modal-info-value" v-model="stakeholders">
          <template v-for="(stakeholder, index) in stakeholders" :key="index">
                <span v-if="stakeholder.roleName === 10602" class="modal-info-value">
                  {{ stakeholder.name }}({{ stakeholder.id }})
                </span>
            <!--   대충 PL 수 -1 만큼 , 넣는 기능      -->
            <!--                <span v-if="index !== stakeholder.length - 1">,</span>-->
          </template>
        </div>
      </div>

      <!-- 담당자 -->
      <div class="modal-info">
        <div class="modal-info-item">
          <p class="modal-info-label">담당자:</p>
          <!--   TODO. 담당자 값으로 변환 후 선택창 구현       -->
          <input id="responsible" v-model="stakeholders">
          <div class="modal-info-value">
            <p class="modal-responsible">
              <template v-for="(stakeholder, index) in stakeholders" :key="index">
                  <span v-if="stakeholder.type === 10402" class="modal-info-value">
                      {{ stakeholder.name }} ({{ stakeholder.id }})
                      <span v-if="index !== stakeholder.length - 1">,</span>
                    </span>
              </template>
            </p>
          </div>
        </div>
      </div>

      <!-- 내용 및 업무 -->
      <div class="modal-description-container">
        <!-- 내용 -->
        <div class="modal-description">
          <p class="importance">*</p>
          <textarea class="textarea-description" v-model="schedule.content"></textarea>
        </div>

        <!-- 업무 -->
        <div class="modal-tasks-container">
          <h5 class="modal-sheet-title">업무 목록</h5>
          <table class="modal-sheet">
            <thead>
            <tr>
              <th>업무 제목</th>
              <th>수행 여부</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(task, index) in tasks" :key="task.id">
              <td v-if="tasks.length > 0" class="task-title">{{ task.title }}</td>
              <td v-if="tasks.length > 0" class="task-isCompleted">
                <input type="checkbox" v-model="task.isCompleted">
                <label>{{ task.isCompleted ? '완료' : '미완료' }}</label>
              </td>
              <td v-if="tasks.length > 0">
                <button class="delete-button" @click="deleteTask(index)">삭제</button>
              </td>
            </tr>
            <tr>
              <td class="task-title" colspan="2">
                <input type="text" v-model="newTaskTitle" placeholder="업무 추가">
              </td>
              <td>
                <button @click="addTask">추가</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 저장 -->
      <div class="modal-actions">
        <p v-if="showInfoMessage" class="info-message">* 표시된 항목을 채워주세요. </p>
        <div>
          <button class="modal-action-button" @click="saveScheduleChanges">저장</button>
        </div>
      </div>
    </div>

    <div v-show="currentTab === 'requirement'">
      <!-- 요구사항 탭 내용 -->
      <h3>요구사항</h3>
      <table class="modal-sheet">
        <thead>
        <tr>
          <th>요구사항명</th>
          <th>내용</th>
          <th>링크</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(requirement, index) in requirements" :key="index">
          <td>{{ requirement.name }}</td>
          <td>{{ requirement.content }}</td>
          <td>{{ requirement.id }}</td>
          <td>
            <button class="delete-button" @click="deleteRequirement(index)">삭제</button>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <input type="text" v-model="requirementSearchValue">
          </td>
          <td>
            <material-button @click="searchRequirement">검색</material-button>
          </td>
          <td>
            <button @click="addRequirement">추가</button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="modal-actions">
        <p v-if="showInfoMessage" class="info-message">모든 항목을 채워주세요.</p>
        <button class="modal-action-button" @click="toggleRequirementEdit">
          {{ isRequirementEditing ? '저장' : '수정' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";

export default {
  components: {MaterialButton},
  props: ['isOpen', 'modalUrl'],
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
        precedingId: '',
        createdDate: '',
        modifiedDate: '',
        projectName: '',
      },
      tasks: [
      ],
      stakeholders: [
        {
          name: '',
          id: '',
          type: null,
          roleName: null,
        }
      ],
      history: [
        {
          id: null,
          name: '',
          employeeId: '',
          reason: '',
          modifiedDate: '',
        }
      ],
      permission: [
        {id: 'EP000', name: '홍길동', role_name: 'PM'},
        {id: 'EP001', name: '조자룡', role_name: 'PL'},
        {id: 'EP002', name: '유비', role_name: 'PA'},
      ],
      requirements: [
        /* 현근님이 만든 component 활용 */
        {id: 1, name: '게시글 작성', content: '회원이 서비스에 게시글을 작성할 수 있도록 함.'},
        {id: 2, name: '게시글 수정', content: '회원이 작성한 게시글을 수정할 수 있도록 함.'},
        {id: 3, name: '게시글 삭제', content: '회원이 작성한 게시글을 삭제할 수 있도록 함.'},
        {id: 4, name: '게시글 목록 조회', content: '회원이 작성한 게시글 목록을 조회할 수 있도록 함.'},
        {id: 5, name: '게시글 상세 조회', content: '회원이 작성한 게시글을 상세 조회할 수 있도록 함.'},
        {id: 6, name: '게시글 추천', content: '회원이 게시글을 추천할 수 있도록 함.'},
        {id: 7, name: '게시글 비추천', content: '회원이 게시글을 비추천할 수 있도록 함.'},
      ],
      projectMember: [],
      statusItems: [10401, 10402, 10403],
      newTaskTitle: '',
      newPermission: {name: '', id: '', role_name: ''},
      editingPermissionIndex: null,
      editingPermission: {name: '', id: '', role_name: ''},
      showInfoMessage: false,
      currentTab: 'details',  // 기본 탭을 'details'로 설정
      scheduleId: null,
    };
  },
  watch: {
    isOpen() {
      this.scheduleId = this.modalUrl.split('/').pop();
      this.getScheduleData();
      this.getTaskData();
      this.getStakeholderData();
      this.getScheduleHistoryData();
    }
  },
  methods: {
    changeTab(tab) {
      this.currentTab = tab;
    },
    addTask() {
      if (this.newTaskTitle) {
        this.tasks.push({id: null, title: this.newTaskTitle, completed: false});
        this.newTaskTitle = '';
      }
    }
    ,
    deleteTask(index) {
      this.tasks.splice(index, 1);
    }
    ,
    addPermission() {
      if (!(this.newPermission.name && this.newPermission.id && this.newPermission.role_name)) {
        this.showInfoMessage = true;
        setTimeout(() => {
          this.showInfoMessage = false;
        }, 2000);
      } else {
        this.permission.push({
          name: this.newPermission.name,
          id: this.newPermission.id,
          role_name: this.newPermission.role_name
        });
        this.newPermission = {name: '', id: '', role_name: ''};
      }
    },
    deletePermission(index) {
      this.permission.splice(index, 1);
    },
    deleteRequirement(index) {
      this.requirements.splice(index, 1);
    },
    searchRequirement() {
      // 검색 로직 구현
      console.log('검색 로직 구현');
    },
    addRequirement() {
      this.requirements.push({
        name: '새로운 요구사항 등록됨',
        content: '새로운 요구사항 내용 등록됨',
        id: 8,
      });
    },
  }
};
</script>

<style scoped>
/* 모달 스타일 */
.modal {
  display: block; /* 기본적으로 숨겨진 상태에서 display를 block으로 변경 */
  position: fixed; /* 고정 위치 */
  z-index: 10000; /* 다른 요소 위에 배치 */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* 스크롤을 방지 */
  backdrop-filter: blur(5px); /* 배경 흐림 효과 */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* 반투명 배경 */
  z-index: 999;
}

.modal-content {
  width: 80%;
  height: 80%;
  background-color: #fefefe;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 10px; /* 둥근 모서리 직사각형 */
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: 11000;
}

.info-message {
  color: #e72222; /* 메시지 색상 설정 */
  animation-delay: 1s;
  animation: fadeOut 2s forwards; /* fadeOut 애니메이션 적용 */
}

.importance {
  color: #e72222; /* 중요도 색상 설정 */
  font-size: 22px;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}


.close {
  color: #aaa;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

#title {
  display: block;
  font-weight: 600;
  font-family: "Roboto Slab", sans-serif;
  font-size: 2.25rem;
  line-height: 1.3;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #344767;
}

.modal-divider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.modal-info {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5px;
  justify-content: flex-end; /* 컨테이너의 자식 요소들을 오른쪽으로 정렬 */
}

.modal-info-item {
  display: flex;
  align-items: center; /* 세로 방향으로 중앙 정렬 */
}

.modal-info-label {
  margin-left: 10px; /* 레이블과 값 사이의 간격 조정 */
  margin-right: 10px; /* 레이블과 입력 요소 사이의 간격 조정 */
  font-weight: bold;
  color: #666;
}

.modal-info-value {
  margin-right: 10px; /* 레이블과 입력 요소 사이의 간격 조정 */
}

.modal-description-container {
  display: flex;
  justify-content: space-between;
  align-items: stretch; /* 자식 요소들이 컨테이너의 높이를 채우도록 설정 */
  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
  background-color: #d3e6ef;
  flex-direction: row; /* 가로 방향으로 배치 */
}

.modal-description {
  padding: 10px;
  margin: 10px;
  flex: 1; /* 동일한 너비 적용 */
  display: flex; /* flex 적용 */
  flex-direction: column; /* 세로 방향으로 배치 */
  height: 100%; /* 높이를 부모 요소에 맞춤 */
}

.textarea-description {
  height: 100%; /* 높이를 부모 요소에 맞춤 */
  overflow-y: auto;
  white-space: pre-wrap;
}

.modal-description label {
  flex: 1; /* 동일한 너비 적용 */
}

.modal-description textarea {
  width: 100%; /* 너비를 부모 요소에 맞춤 */
  height: 100%; /* 높이를 부모 요소에 맞춤 */
}


.modal-tasks-container {
  border-radius: 10px;
  background-color: #f5f5f5;
  padding: 20px;
  margin: 10px;
  flex: 1; /* 동일한 너비 적용 */
}

.modal-sheet-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-sheet th,
.modal-sheet td {
  padding: 10px 20px; /* 가로 간격만 조정 */
}

.modal-sheet th:first-child,
.modal-sheet td:first-child {
  padding-left: 0; /* 첫 번째 열의 왼쪽 간격 제거 */
}

.modal-sheet th:last-child,
.modal-sheet td:last-child {
  padding-right: 0; /* 마지막 열의 오른쪽 간격 제거 */
}

.modal-sheet li {
  margin-bottom: 10px;
}

.modal-sheet button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 6px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.modal-sheet button:hover {
  background-color: #45a049;
}

.modal-sheet button.delete-button {
  background-color: #e72222;
  color: white;
  border: none;
  padding: 6px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.modal-sheet button.delete-button:hover {
  background-color: #e70a0a;
}


table {
  width: 100%; /* 테이블 전체 너비를 100%로 설정 */
}


.modal-actions {
  display: flex;
  margin-top: 10px;
  bottom: 10px;
  right: 10px;
  justify-content: flex-end; /* 컨테이너의 자식 요소들을 오른쪽으로 정렬 */
}

.modal-action-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.modal-action-button:hover {
  background-color: #45a049;
}

.info-tooltip {
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  top: calc(100% + 5px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}
</style>
