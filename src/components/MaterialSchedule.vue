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

        <!-- 탭 버튼 -->
        <div>
          <button @click="changeTab('details')">세부사항</button>
          <button @click="changeTab('history')">수정 내역</button>
          <button @click="changeTab('permissions')">권한 확인</button>
        </div>

        <!-- 가로선 -->
        <hr class="modal-divider">

        <div v-show="currentTab === 'details'">
          <MaterialScheduleDetail :schedule="schedule" :isEditing="isEditing"/>
        </div>

        <div v-show="currentTab === 'history'">
          <!-- 수정 내역 탭 내용 -->
        </div>

        <div v-show="currentTab === 'permissions'">
          <!-- 권한 확인 탭 내용 -->
        </div>

        <div class="modal-actions">
          <button class="modal-action-button" @click="toggleEdit">수정</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MaterialScheduleDetail from '@/components/MaterialScheduleDetail.vue';

export default {
  components: {
    MaterialScheduleDetail
  },
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
        ],
        historyReason: '',
      },
      statusItems: ['준비', '진행', '완료'],
      hoveredParentTitle: false,
      hoveredPrecedingTitle: false,
      isEditing: false,
      newTaskTitle: '',
      currentTab: 'details',  // 기본 탭을 'details'로 설정
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    changeTab(tab) {
      this.currentTab = tab;
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
