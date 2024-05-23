<template>
  <div class="container">
    <div class="card">
      <h2 class="title">일정 수정</h2>
      <form @submit.prevent="saveSchedule">
        <div class="row">
          <div class="col">
            <label for="title">제목</label>
            <input id="title" v-model="schedule.title" required>
          </div>
          <div class="col">
            <label for="status">상태</label>
            <select id="status" v-model="schedule.status" required>
              <option v-for="status in statusItems" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>
        </div>

        <label for="content">내용</label>
        <textarea id="content" v-model="schedule.content"></textarea>

        <div class="row">
          <div class="col">
            <label for="startDate">시작일</label>
            <input id="startDate" type="date" v-model="schedule.startDate">
          </div>
          <div class="col">
            <label for="endDate">종료일</label>
            <input id="endDate" type="date" v-model="schedule.endDate">
          </div>
        </div>

        <label for="weight">가중치</label>
        <input id="weight" type="number" v-model="schedule.weight">

        <label for="progress">진행률</label>
        <input id="progress" type="number" v-model="schedule.progress">

        <!-- 부모 일정 선택 -->
        <label for="parentSchedule">부모 일정</label>
        <input id="parentSchedule" v-model="schedule.parentSchedule">

        <!-- 선행 일정 선택 -->
        <label for="precedingSchedule">선행 일정</label>
        <input id="precedingSchedule" v-model="schedule.precedingSchedule">

        <!-- 권한 등록 -->
        <label for="permissions">권한 등록</label>
        <input id="permissions" v-model="schedule.permissions">

        <!-- 이해관계자 등록 -->
        <label for="stakeholders">이해관계자 등록</label>
        <input id="stakeholders" v-model="schedule.stakeholders">
        <MaterialScheduleModal ref="modal" />


        <!-- 업무 등록 -->
        <label for="tasks">업무 등록</label>
        <input id="tasks" v-model="schedule.tasks">

        <!-- 요구사항 수정 -->
        <label for="requirements">요구사항 수정</label>
        <input id="requirements" v-model="schedule.requirements">

        <!-- 수정 사유 입력 -->
        <label for="reason">수정 사유</label>
        <textarea id="reason" v-model="editReason" required></textarea>

      </form>
      <button type="submit">저장</button>
      <button type="button" @click="deleteSchedule">삭제</button>
    </div>
  </div>
</template>

<script>
import MaterialScheduleModal from '@/components/MaterialScheduleModal.vue';

export default {
  data() {
    return {
      schedule: {
        title: '일정 제목',
        content: '일정 내용',
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        weight: null,
        progress: null,
        status: '준비',
        parentSchedule: null,
        precedingSchedule: null,
        permissions: [],
        stakeholders: [],
        tasks: [],
        requirements: [],
      },
      statusItems: ['준비', '진행', '완료'],
      editReason: '', // 수정 사유 저장

    };
  },
  components: {
    MaterialScheduleModal,
    // ... other components
  },
  methods: {
    openModal(name) {
      this.$refs.modal.openModal(name);
    },
    saveSchedule() {
      if (!this.editReason) {
        alert("수정 사유를 입력해주세요.");
        return;
      }
      console.log('Saving schedule:', this.schedule);
    },
    deleteSchedule() {
      if (!this.editReason) {
        alert("수정 사유를 입력해주세요.");
        return;
      }
      // 수정 사유를 입력받는 로직 추가
      console.log('Deleting schedule:', this.id);
    },
    // ... 추가적인 메서드
  },
};
</script>


<style scoped>
.container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.col {
  flex: 1;
  margin-right: 10px;
}

.col:last-child {
  margin-right: 0;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #007bff;
}

button[type="button"] {
  background-color: #dc3545;
}
</style>
