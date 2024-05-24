<template>
  <div>
    <div class="modal" v-if="isOpen">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>

        <div v-if="isEditing">
          <input id="title" v-model="schedule.title"/>
        </div>
        <h2 v-else>
          {{ schedule.title }}
        </h2>

        <!-- 프로젝트 이름 -->
        <p class="modal-project-name">{{ schedule.projectName }}</p>

        <!-- 가로선 -->
        <hr class="modal-divider">

        <!-- 시작일 ~ 종료일, 가중치, 진행률, 상태, 생성일시, 작성자 -->
        <div class="modal-info">
          <div class="modal-info-item">
            <span class="modal-info-label">시작일:</span>
            <div v-if="isEditing">
              <input id="startDate" type="date" v-model="schedule.startDate">
            </div>
            <span v-else class="modal-info-value">{{ schedule.startDate }}</span>
          </div>
          <div class="modal-info-item">
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
              <span class="modal-info-value">{{ schedule.workLoad }}</span>
            </div>
          </div>
        </div>

        <div class="modal-info">
          <div class="modal-info-item">
            <span class="modal-info-label">가중치:</span>
            <div v-if="isEditing">
              <input id="weight" type="number" v-model="schedule.weight">
            </div>
            <span v-else class="modal-info-value">{{ schedule.weight }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">진행률:</span>
            <!--            향후 조건문에 하위 업무가 없을 때를 추가해야함 -->
            <div v-if="isEditing">
              <input id="progress" type="number" v-model="schedule.progress">
            </div>
            <span v-else class="modal-info-value">{{ schedule.progress }}%</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">상태:</span>
            <div v-if="isEditing">
              <select id="status" v-model="schedule.status">
                <option v-for="status in statusItems" :key="status" :value="status">{{ status }}</option>
              </select>
            </div>
            <span v-else class="modal-info-value">{{ schedule.status }}</span>
          </div>
        </div>

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
          <div class="modal-info-item">
            <span class="modal-info-label">작성자:</span>
            <span class="modal-info-value">{{ schedule.creator.name }}</span>
          </div>
        </div>

        <div class="modal-description-container">
          <!-- 내용 -->
          <p class="modal-description">{{ schedule.description }}</p>

          <!-- 둥근 모서리 직사각형 -->
          <div class="modal-tasks-container">
            <h5 class="modal-tasks-title">업무 목록</h5>
            <table class="modal-tasks">
              <thead>
              <tr>
                <th>업무 제목</th>
                <th>수행 여부</th>
              </tr>
              </thead>
              <tbody v-if="isEditing">
              <tr v-for="(task, index) in schedule.tasks" :key="task.id">
                <td>
                  <input type="text" v-model="task.title">
                </td>
                <td>
                  <input type="checkbox" v-model="task.completed">
                  <label>{{ task.completed ? '완료' : '미완료' }}</label>
                </td>
                <td>
                  <button @click="deleteTask(index)">삭제</button>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="text" v-model="newTaskTitle" placeholder="업무 추가">
                </td>
                <td>
                  <button @click="addTask">추가</button>
                </td>
              </tr>
              </tbody>
              <tbody v-else-if="!isEditing&schedule.tasks.length > 0">
              <tr v-for="task in schedule.tasks" :key="task.id">
                <td>{{ task.title }}</td>
                <td>
                  <input type="checkbox" :checked="task.completed" disabled>
                  <label>{{ task.completed ? '완료' : '미완료' }}</label>
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

        <div class="modal-info">
          <div class="modal-info-item">
            <span class="modal-info-label">생성 일시:</span>
            <span class="modal-info-value">{{ schedule.createdAt }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">수정 일시:</span>
            <span class="modal-info-value">{{ schedule.updatedAt }}</span>
          </div>
        </div>

        <!-- 담당자 -->
        <div class="modal-info">
          <div class="modal-info-item">
            <p class="modal-info-label">담당자:</p>
            <div v-if="isEditing">
              <input id="responsible" v-model="schedule.responsibles">
            </div>
            <div v-else class="modal-info-value">
              <p class="modal-responsible">
                <template v-for="(responsible, index) in schedule.responsibles" :key="index">
                  {{ responsible.name }} ({{ responsible.id }})
                  <span v-if="index !== schedule.responsibles.length - 1">,</span>
                </template>
              </p>
            </div>
          </div>
        </div>

        <!-- 수정 내역, 수정, 권한 -->
        <div class="modal-actions">
          <!--          <button class="modal-action-button" @click="openEditModal">수정</button>-->
          <button class="modal-action-button" @click="toggleEdit">수정</button>
          <button class="modal-action-button" @click="openHistoryModal">수정 내역</button>
          <button class="modal-action-button" @click="openPermissionModal">권한 확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isOpen', 'modalUrl'],
  data() {
    return {
      schedule: {
        id: 1,
        title: 'Project A Schedule',
        description: 'This is a detailed description of the schedule.',
        startDate: '2024-05-01',
        endDate: '2024-06-30',
        weight: 10,
        progress: 80,
        status: '진행',
        workLoad: 20,
        parentId: '1',
        precedingId: '2',
        createdAt: '2024-04-01 10:00',
        updatedAt: '2024-05-15 15:00',
        creator: {name: '홍길동'},
        projectName: 'Project A',
        responsibles: [
          {name: '조자룡', id: 'EP001'},
          {name: '유비', id: 'EP002'}
        ],
        tasks: [
          {id: 'task1', title: 'Task 1', completed: true},
          {id: 'task2', title: 'Task 2', completed: false}
        ]
      },
      statusItems: ['준비', '진행', '완료'],
      hoveredParentTitle: false,
      hoveredPrecedingTitle: false,
      isEditing: false,
      newTaskTitle: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    showParentTitle() {
      this.hoveredParentTitle = true;
    },
    hideParentTitle() {
      this.hoveredParentTitle = false;
    },
    showPrecedingTitle() {
      this.hoveredPrecedingTitle = true;
    },
    hidePrecedingTitle() {
      this.hoveredPrecedingTitle = false;
    },
    addTask() {
      if (this.newTaskTitle) {
        this.schedule.tasks.push({title: this.newTaskTitle, completed: false});
        this.newTaskTitle = '';
      }
    },
    deleteTask(index) {
      this.schedule.tasks.splice(index, 1);
    },
    openHistoryModal() {
      console.log('Open history modal');
    },
    openEditModal() {
      this.$router.push({name: 'EditSchedule', params: {id: this.schedule.id}});
    },
    openPermissionModal() {
      console.log('Open permission modal');
    },
    toggleEdit() {
      this.isEditing = !this.isEditing;
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
  background-color: #fefefe;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 10px; /* 둥근 모서리 직사각형 */
  width: 80%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: 1000;
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
  width: 100%;
  height: 100%;
  margin-top: 10px;
  border-radius: 10px;
  background-color: #d3e6ef;
}

.modal-description {
  margin: 10px;
  margin-bottom: 20px;
}

.modal-responsible {
  margin-bottom: 20px;
}

.modal-tasks-container {
  border-radius: 10px;
  background-color: #f5f5f5;
  padding: 20px;
  margin: 10px;
}

.modal-tasks-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-tasks th,
.modal-tasks td {
  padding: 10px 20px; /* 가로 간격만 조정 */
}

.modal-tasks th:first-child,
.modal-tasks td:first-child {
  padding-left: 0; /* 첫 번째 열의 왼쪽 간격 제거 */
}

.modal-tasks th:last-child,
.modal-tasks td:last-child {
  padding-right: 0; /* 마지막 열의 오른쪽 간격 제거 */
}

.modal-tasks li {
  margin-bottom: 10px;
}

.modal-actions {
  margin-top: 10px;
  bottom: 10px;
  right: 10px;
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
