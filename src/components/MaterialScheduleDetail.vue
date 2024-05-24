<template>
  <div class="body">
    <div class="modal-info">
      <div class="modal-info-item">
        <span class="modal-info-label">시작일:</span>
        <div v-if="isEditing">
          <input id="startDate" type="date" v-model="localSchedule.startDate">
        </div>
        <span v-else class="modal-info-value">{{ localSchedule.startDate }}</span>
      </div>
      <div class="modal-info-item">
        <span class="modal-info-label">종료일:</span>
        <div v-if="isEditing">
          <input id="endDate" type="date" v-model="localSchedule.endDate">
        </div>
        <span v-else class="modal-info-value">{{ localSchedule.endDate }}</span>
      </div>
      <div class="modal-info-item">
        <div v-if="isEditing">
          <span class="modal-info-label">총 소요일:</span>
          <span class="modal-info-value">
                {{
              Math.ceil(
                  (new Date(localSchedule.endDate) - new Date(localSchedule.startDate)) /
                  (1000 * 60 * 60 * 24)
              )
            }}
              </span>
        </div>
        <div v-else>
          <span class="modal-info-label">공수:</span>
          <span class="modal-info-value">{{ localSchedule.workLoad }}</span>
        </div>
      </div>
    </div>

    <div class="modal-info">
      <div class="modal-info-item">
        <span class="modal-info-label">가중치:</span>
        <div v-if="isEditing">
          <input id="weight" type="number" v-model="localSchedule.weight">
        </div>
        <span v-else class="modal-info-value">{{ localSchedule.weight }}</span>
      </div>
      <div class="modal-info-item">
        <span class="modal-info-label">진행률:</span>
        <!--            향후 조건문에 하위 업무가 없을 때를 추가해야함 -->
        <div v-if="isEditing">
          <input id="progress" type="number" v-model="localSchedule.progress">
        </div>
        <span v-else class="modal-info-value">{{ localSchedule.progress }}%</span>
      </div>
      <div class="modal-info-item">
        <span class="modal-info-label">상태:</span>
        <div v-if="isEditing">
          <select id="status" v-model="localSchedule.status">
            <option v-for="status in statusItems" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>
        <span v-else class="modal-info-value">{{ localSchedule.status }}</span>
      </div>
    </div>

    <div class="modal-info">
      <div class="modal-info-item">
        <span class="modal-info-label">부모 일정:</span>
        <div v-if="isEditing">
          <input id="parentSchedule" v-model="localSchedule.parentId">
        </div>
        <span v-else class="modal-info-value" @mouseover="showParentTitle"
              @mouseleave="hideParentTitle">{{ localSchedule.parentId }}</span>
        <span v-if="hoveredParentTitle" class="info-tooltip">{{ localSchedule.parentId }}의 일정 제목</span>
      </div>
      <div class="modal-info-item">
        <span class="modal-info-label">선행 일정:</span>
        <div v-if="isEditing">
          <input id="precedingSchedule" v-model="localSchedule.precedingId">
        </div>
        <span v-else class="modal-info-value" @mouseover="showPrecedingTitle"
              @mouseleave="hidePrecedingTitle">{{ localSchedule.precedingId }}</span>
        <span v-if="hoveredPrecedingTitle" class="info-tooltip">{{ localSchedule.precedingId }}의 일정 제목</span>
      </div>
      <div class="modal-info-item">
        <span class="modal-info-label">작성자:</span>
        <span class="modal-info-value">{{ localSchedule.creator.name }}</span>
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
        <span class="modal-info-value">{{ localSchedule.createdAt }}</span>
      </div>
      <div class="modal-info-item">
        <span class="modal-info-label">수정 일시:</span>
        <span class="modal-info-value">{{ localSchedule.updatedAt }}</span>
      </div>
    </div>

    <!-- 담당자 -->
    <div class="modal-info">
      <div class="modal-info-item">
        <p class="modal-info-label">담당자:</p>
        <div v-if="isEditing">
          <input id="responsible" v-model="localSchedule.responsibles">
        </div>
        <div v-else class="modal-info-value">
          <p class="modal-responsible">
            <template v-for="(responsible, index) in localSchedule.responsibles" :key="index">
              {{ responsible.name }} ({{ responsible.id }})
              <span v-if="index !== localSchedule.responsibles.length - 1">,</span>
            </template>
          </p>
        </div>
      </div>
    </div>

    <div class="modal-info">
      <div class="modal-info-item">
        <span class="modal-info-label">수정 사유:</span>
        <div v-if="isEditing">
          <input id="weight" type="text" v-model="localSchedule.historyReason">
        </div>
        <span v-else class="modal-info-value">{{ localSchedule.historyReason }}</span>
      </div>
    </div>

    <div class="modal-actions">
      <button class="modal-action-button" @click="updateSchedule">저장</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['schedule', 'isEditing'],
  data() {
    return {
      statusItems: ['준비', '진행', '완료'],
      hoveredParentTitle: false,
      hoveredPrecedingTitle: false,
      newTaskTitle: '',
      localSchedule: {},  // schedule의 복사본을 저장할 데이터 속성
    };
  },
  watch: {
    // 부모 컴포넌트에서 schedule 데이터가 변경될 때마다 localSchedule 데이터를 갱신합니다.
    schedule: {
      handler(newVal) {
        this.localSchedule = JSON.parse(JSON.stringify(newVal));
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
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
        this.localSchedule.tasks.push({title: this.newTaskTitle, completed: false});
        this.newTaskTitle = '';
      }
    },
    deleteTask(index) {
      this.localSchedule.tasks.splice(index, 1);
    },
    updateSchedule() {
      this.$emit('update:schedule', this.localSchedule);  // 수정된 localSchedule 데이터를 부모 컴포넌트에게 전달합니다.
    },
  }
};
</script>

<style scoped>
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