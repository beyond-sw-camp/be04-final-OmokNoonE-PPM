<template>
  <div>
    <div class="modal" v-if="isOpen">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>

        <div v-if="isEditing">
          <p class="importance">{{ isEditing ? '*' : '' }}</p>
          <input id="title" v-model="schedule.title"/>
        </div>
        <h2 v-else>
          {{ schedule.title }}
        </h2>

        <!-- 프로젝트 이름 -->
        <p class="modal-project-name">{{ schedule.projectName }}</p>

        <div class="modal-actions">
          <button class="modal-action-button" @click="changeTab('details')">세부사항</button>
          <button class="modal-action-button" @click="changeTab('history')">수정내역</button>
          <button class="modal-action-button" @click="changeTab('requirement')">요구사항</button>
        </div>

        <!-- 가로선 -->
        <hr class="modal-divider">

        <!-- 탭 내용 -->
        <div v-show="currentTab === 'details'">
          <!-- 생성 일시, 수정 일시 -->
          <div v-show="!isEditing" class="modal-info">
            <div class="modal-info-item">
              <span class="modal-info-label">생성 일시:</span>
              <span class="modal-info-value">{{ schedule.createdDate }}</span>
            </div>
            <div class="modal-info-item">
              <span class="modal-info-label">수정 일시:</span>
              <span class="modal-info-value">{{ schedule.modifiedDate }}</span>
            </div>
          </div>

          <!-- 시작일, 종료일, 공수 -->
          <div class="modal-info">
            <div class="modal-info-item">
              <p class="importance">{{ isEditing ? '*' : '' }}</p>
              <span class="modal-info-label">시작일:</span>
              <div v-if="isEditing">
                <input id="startDate" type="date" v-model="schedule.startDate">
              </div>
              <span v-else class="modal-info-value">{{ schedule.startDate }}</span>
            </div>
            <div class="modal-info-item">
              <p class="importance">{{ isEditing ? '*' : '' }}</p>
              <span class="modal-info-label">종료일:</span>
              <div v-if="isEditing">
                <input id="endDate" type="date" v-model="schedule.endDate">
              </div>
              <span v-else class="modal-info-value">{{ schedule.endDate }}</span>
            </div>
            <div class="modal-info-item">
              <div v-if="isEditing">
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
              <div v-else>
                <span class="modal-info-label">공수:</span>
                <span class="modal-info-value">{{ schedule.manHours }}</span>
              </div>
            </div>
          </div>

          <!-- 가중치, 진행률, 상태 -->
          <div class="modal-info">
            <div class="modal-info-item">
              <span class="modal-info-label">가중치:</span>
              <div v-if="isEditing">
                <input id="weight" type="number" v-model="schedule.priority">
              </div>
              <span v-else class="modal-info-value">{{ schedule.priority }}</span>
            </div>
            <div class="modal-info-item">
              <p class="importance">{{ isEditing ? '*' : '' }}</p>
              <span class="modal-info-label">진행률:</span>
              <!--            향후 조건문에 하위 업무가 없을 때를 추가해야함 -->
              <div v-if="isEditing">
                <input id="progress" type="number" v-model="schedule.progress">
              </div>
              <span v-else class="modal-info-value">{{ schedule.progress }}%</span>
            </div>
            <div class="modal-info-item">
              <p class="importance">{{ isEditing ? '*' : '' }}</p>
              <span class="modal-info-label">상태:</span>
              <div v-if="isEditing">
                <select id="status" v-model="schedule.status">
                  <option v-for="status in statusItems" :key="status" :value="status">
                    {{
                      status == 10401 ? '준비' :
                          status == 10402 ? '진행' : '완료'
                    }}
                  </option>
                </select>
              </div>
              <span v-else class="modal-info-value">
                {{
                  schedule.status == 10401 ? '준비' :
                      schedule.status == 10402 ? '진행' : '완료'
                }}
              </span>
            </div>
          </div>

          <!-- 부모 일정, 선행 일정 -->
          <div class="modal-info">
            <div class="modal-info-item">
              <span class="modal-info-label">부모 일정:</span>
              <div v-if="isEditing">
                <input id="parentSchedule" v-model="schedule.parentId">
              </div>
              <span v-else class="modal-info-value" @mouseover="showParentTitle"
                    @mouseleave="hideParentTitle">{{ schedule.parentId }}</span>
              <span v-if="hoveredParentTitle" class="info-tooltip">{{ schedule.parentId }}의 일정 제목</span>
            </div>
            <div class="modal-info-item">
              <span class="modal-info-label">선행 일정:</span>
              <div v-if="isEditing">
                <input id="precedingSchedule" v-model="schedule.precedingId">
              </div>
              <span v-else class="modal-info-value" @mouseover="showPrecedingTitle"
                    @mouseleave="hidePrecedingTitle">{{ schedule.precedingId }}</span>
              <span v-if="hoveredPrecedingTitle" class="info-tooltip">{{ schedule.precedingId }}의 일정 제목</span>
            </div>
          </div>

          <!--   PM, PL 잘못된 view   -->
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
              <template v-for="(stakeholder, index) in stakeholders" :key="index">
                <span v-if="stakeholder.roleName === 10602" class="modal-info-value">
                  {{ stakeholder.name }}({{ stakeholder.id }})
                </span>
              </template>
            </div>
          </div>

          <!-- 담당자 -->
          <div class="modal-info">
            <div class="modal-info-item">
              <p class="importance">{{ isEditing ? '*' : '' }}</p>
              <p class="modal-info-label">담당자:</p>
              <div v-if="isEditing">
                <input id="responsible" v-model="stakeholders">
              </div>
              <div v-else class="modal-info-value">
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
              <p class="importance">{{ isEditing ? '*' : '' }}</p>
              <div v-if="isEditing">
                <textarea class="textarea-description" v-model="schedule.content"></textarea>
              </div>
              <div v-else>
                <p class="textarea-description">{{ schedule.content }}</p>
              </div>
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
                <tbody v-if="isEditing">
                <tr v-for="(task, index) in tasks" :key="task.id">
                  <td class="task-title">
                    <input type="text" v-model="task.title">
                  </td>
                  <td class="task-isCompleted">
                    <input type="checkbox" v-model="task.isCompleted">
                    <label>{{ task.isCompleted ? '완료' : '미완료' }}</label>
                  </td>
                  <td>
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
                <tbody v-else-if="!isEditing&tasks.length > 0">
                <tr v-for="task in tasks" :key="task.id">
                  <td class="task-title">{{ task.title }}</td>
                  <td class="task-isCompleted">
                    <input type="checkbox" :checked="task.isCompleted" disabled>
                    <label>{{ task.isCompleted ? '완료' : '미완료' }}</label>
                  </td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="2">등록된 업무가 없습니다.</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 수정 사유 -->
          <div class="modal-info">
            <div class="modal-info-item" v-if="isEditing">
              <p class="importance">{{ isEditing ? '*' : '' }}</p>
              <p class="modal-info-label">수정 사유:</p>
              <input type="text" placeholder="수정 사유를 입력하세요." v-model="reason">
            </div>
          </div>

          <!-- 수정 -->
          <div class="modal-actions">
            <p v-if="showInfoMessage" class="info-message">* 표시된 항목을 채워주세요. </p>
            <button v-if="!isEditing" class="modal-action-button" @click="toggleEdit">수정</button>
            <div v-else>
              <button class="modal-action-button" @click="saveScheduleChanges">저장</button>
              <material-button class="delete-button" @click="toggleEdit">취소</material-button>
            </div>
          </div>
        </div>

        <div v-show="currentTab === 'history'">
          <!-- 수정 내역 탭 내용 -->
          <h3>수정 내역</h3>
          <table class="modal-sheet">
            <thead>
            <tr>
              <th class="history-reason">수정 사유</th>
              <th class="history-name">수정자</th>
              <th class="history-employeeId">ID</th>
              <th class="history-modifiedDate">수정 일시</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(history, index) in history" :key="index">
              <td class="history-reason">{{ history.reason }}</td>
              <td class="history-name">{{ history.name }}</td>
              <td class="history-employeeId">{{ history.employeeId }}</td>
              <td class="history-modifiedDate">{{ history.modifiedDate }}</td>
            </tr>
            </tbody>
          </table>
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
            <tbody v-if="isRequirementEditing">
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
                <button @click="searchRequirement">검색</button>
              </td>
              <td>
                <button @click="addRequirement">추가</button>
              </td>
            </tr>
            </tbody>
            <tbody v-else-if="!isRequirementEditing&requirements.length > 0">
            <tr v-for="(requirement, index) in requirements" :key="index">
              <td>{{ requirement.name }}</td>
              <td>{{ requirement.content }}</td>
              <td>{{ requirement.id }}</td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
              <td colspan="3">등록된 요구사항이 존재하지 않습니다.</td>
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
    </div>
  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import {defaultInstance} from "@/axios/axios-instance";

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
        {
          id: null,
          title: '',
          isCompleted: false,
        }
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
      hoveredParentTitle: false,
      hoveredPrecedingTitle: false,
      isEditing: false,
      reason: '',     // 수정 사유
      newTaskTitle: '',
      newPermission: {name: '', id: '', role_name: ''},
      editingPermissionIndex: null,
      editingPermission: {name: '', id: '', role_name: ''},
      isPermissionEditing: false,
      isRequirementEditing: false,
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
    closeModal() {
      this.$emit('close');
    }
    ,
    changeTab(tab) {
      this.currentTab = tab;
    }
    ,
    showParentTitle() {
      this.hoveredParentTitle = true;
    }
    ,
    hideParentTitle() {
      this.hoveredParentTitle = false;
    }
    ,
    showPrecedingTitle() {
      this.hoveredPrecedingTitle = true;
    }
    ,
    hidePrecedingTitle() {
      this.hoveredPrecedingTitle = false;
    }
    ,
    addTask() {
      if (this.newTaskTitle) {
        this.tasks.push({title: this.newTaskTitle, completed: false});
        this.newTaskTitle = '';
      }
    }
    ,
    deleteTask(index) {
      this.tasks.splice(index, 1);
    }
    ,
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    saveScheduleChanges() {
      if (!(this.schedule.title && this.schedule.startDate && this.schedule.endDate && this.schedule.progress && this.schedule.status && this.stakeholders.length && this.schedule.content && this.reason)) {
        this.showInfoMessage = true;
        setTimeout(() => {
          this.showInfoMessage = false;
        }, 2000);
      } else {
        /* 수정 사유 갱신 */
        this.history.push({
          reason: this.reason,
          name: '당신의 이름', // 수정자 이름을 실제 값으로 대체해야 합니다.
          employeeId: '당신의 ID', // 수정자 ID를 실제 값으로 대체해야 합니다.
          modifiedDate: new Date().toISOString().slice(0, -5) // 현재 시간을 ISO 형식의 문자열로 변환 (초의 소수점 아래 밀리초와 시간대 제외)
        });
        this.reason = '';
        console.log('저장 로직 구현 필요');
        this.toggleEdit();
      }
    },
    togglePermissionEdit() {
      this.isPermissionEditing = !this.isPermissionEditing;
    },
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
    toggleRequirementEdit() {
      this.isRequirementEditing = !this.isRequirementEditing;
    },
    getScheduleData() {
      defaultInstance.get(`schedules/view/${this.scheduleId}`)
          .then(response => {
            const data = response.data.result.viewSchedule;
            this.schedule = {
              id: data.scheduleId,
              title: data.scheduleTitle,
              content: data.scheduleContent,
              startDate: data.scheduleStartDate.join('-'),
              endDate: data.scheduleEndDate.join('-'),
              priority: data.schedulePriority,
              progress: data.scheduleProgress,
              status: data.scheduleStatus,
              manHours: data.scheduleManHours,
              parentId: data.scheduleParentScheduleId,
              precedingId: data.schedulePrecedingScheduleId,
              createdDate: `${data.scheduleCreatedDate.slice(0, 3).join('-')} ${data.scheduleCreatedDate.slice(3, 6).join(':')}`,
              modifiedDate: `${data.scheduleModifiedDate.slice(0, 3).join('-')} ${data.scheduleModifiedDate.slice(3, 6).join(':')}`,
              projectName: data.scheduleProjectId, // projectName is not provided in the response data
            };
          })
          .catch(error => {
            console.error(error);
          });
    },
    getTaskData() {
      defaultInstance.get(`tasks/list/${this.scheduleId}`)
          .then(response => {
            const data = response.data.result.viewScheduleTask;
            console.log("getTaskData")
            console.log(data);
            this.tasks = data.map(task => ({
              id: task.taskId,
              title: task.taskTitle,
              isCompleted: task.taskIsCompleted,
            }));
          })
          .catch(error => {
            console.error(error);
          });
    },
    getStakeholderData() {
      /* 전부 수정 해야될 수도 */
      defaultInstance.get(`stakeholders/view/${this.scheduleId}`)
          .then(response => {
            console.log("getStakeholderData")
            const data = response.data.result.viewStakeholders;
            console.log(data)
            this.stakeholders = data.map(stakeholder => ({
              id: stakeholder.stakeholdersId,
              name: stakeholder.stakeholdersName,
              type: stakeholder.stakeholdersType,
              roleName: stakeholder.stakeholdersRoleName,
            }));

          })
          .catch(error => {
            console.error(error);
          });
    },
    getScheduleHistoryData() {
      defaultInstance.get(`scheduleHistories/view/${this.scheduleId}`)
          .then(response => {
            console.log("getScheduleHistoryData")
            const data = response.data.result.viewSchedule;
            console.log(data)
            this.history = data.map(item => ({
              id: item.scheduleHistoryId,
              name: item.scheduleHistoryName,
              employeeId: item.scheduleHistoryEmployeeId,
              reason: item.scheduleHistoryReason,
              modifiedDate: item.scheduleHistoryModifiedDate,
            }));

          })
          .catch(error => {
            console.error(error);
          });
    }
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
