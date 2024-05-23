<template>
  <div>
    <div class="modal" v-if="isOpen">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>

        <!-- 제목 -->
        <h2 class="modal-title">{{ schedule.title }}</h2>

        <!-- 프로젝트 이름 -->
        <p class="modal-project-name">{{ schedule.projectName }}</p>

        <!-- 가로선 -->
        <hr class="modal-divider">

        <!-- 시작일 ~ 종료일, 가중치, 진행률, 상태, 생성일시, 작성자 -->
        <div class="modal-info">
          <div class="modal-info-item">
            <span class="modal-info-label">시작일:</span>
            <span class="modal-info-value">{{ schedule.startDate }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">종료일:</span>
            <span class="modal-info-value">{{ schedule.endDate }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">가중치:</span>
            <span class="modal-info-value">{{ schedule.weight }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">진행률:</span>
            <span class="modal-info-value">{{ schedule.progress }}%</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">상태:</span>
            <span class="modal-info-value">{{ schedule.status }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">공수:</span>
            <span class="modal-info-value">{{ schedule.workLoad }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">생성 일시:</span>
            <span class="modal-info-value">{{ schedule.createdAt }}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">수정 일시:</span>
            <span class="modal-info-value">{{ schedule.updatedAt }}</span>
          </div>
          <div class="modal-info-item" @mouseover="showParentTitle" @mouseleave="hideParentTitle">
            <span class="modal-info-label">부모 일정:</span>
            <span class="modal-info-value">{{ schedule.parentId }}</span>
            <span v-if="hoveredParentTitle" class="info-tooltip">{{ schedule.parentId }}의 일정 제목</span>
          </div>
          <div class="modal-info-item" @mouseover="showPrecedingTitle" @mouseleave="hidePrecedingTitle">
            <span class="modal-info-label">선행 일정:</span>
            <span class="modal-info-value">{{ schedule.precedingId }}</span>
            <span v-if="hoveredPrecedingTitle" class="info-tooltip">{{ schedule.precedingId }}의 일정 제목</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">작성자:</span>
            <span class="modal-info-value">{{ schedule.creator.name }}</span>
          </div>
        </div>

        <!-- 내용 -->
        <p class="modal-description">{{ schedule.description }}</p>

        <!-- 담당자 -->
        <p class="modal-responsible">담당자:
          <template v-for="(responsible, index) in schedule.responsibles" :key="index">
            {{ responsible.name }} ({{ responsible.id }})
            <span v-if="index !== schedule.responsibles.length - 1">,</span>
          </template>
        </p>

        <!-- 둥근 모서리 직사각형 -->
        <div class="modal-tasks-container">
          <h4 class="modal-tasks-title">업무 목록</h4>
          <table class="modal-tasks">
            <thead>
            <tr>
              <th>업무 제목</th>
              <th>수행 여부</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="task in schedule.tasks" :key="task.id">
              <td>{{ task.title }}</td>
              <td>
                <input type="checkbox" :checked="task.completed" disabled>
                <label>{{ task.completed ? '완료' : '미완료' }}</label>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- 수정 내역, 수정, 권한 -->
        <div class="modal-actions">
          <button class="modal-action-button" @click="openEditModal">수정</button>
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
      hoveredParentTitle: false,
      hoveredPrecedingTitle: false
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
    openHistoryModal() {
      console.log('Open history modal');
    },
    openEditModal() {
      console.log('Open edit modal');
    },
    openPermissionModal() {
      console.log('Open permission modal');
    }
  }
};
</script>

<style scoped>
/* 모달 스타일 */
.modal {
  display: block; /* 기본적으로 숨겨진 상태에서 display를 block으로 변경 */
  position: fixed; /* 고정 위치 */
  z-index: 1000; /* 다른 요소 위에 배치 */
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

.modal-divider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.modal-info {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.modal-info-item {
  flex: 1 1 20%; /* 각 항목이 동일한 너비를 가지도록 설정 */
  margin-right: 10px;
  position: relative; /* Tooltip을 포함한 요소의 위치 */
}

.modal-info-label {
  font-weight: bold;
  color: #666;
}

.modal-description {
  margin-bottom: 20px;
}

.modal-responsible {
  margin-bottom: 20px;
}

.modal-tasks-container {
  border-radius: 10px;
  background-color: #f5f5f5;
  padding: 20px;
  margin-bottom: 20px;
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
  position: absolute;
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
