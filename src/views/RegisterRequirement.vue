<!-- RegisterRequirement.vue -->
<template>
  <div v-if="props.isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">요구사항 등록</h5>
        <button type="button" class="close" @click="close">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="registerRequirement" class="text-start mt-3">
          <div class="mb-3">
            <label for="requirementsName">요구사항명</label>
            <input
                id="requirementsName"
                type="text"
                v-model="requirementsName"
                class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="requirementsContent">요구사항 내용</label>
            <input
                id="requirementsContent"
                type="text"
                v-model="requirementsContent"
                class="form-control"
            />
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-success my-4 mb-2">등록</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps} from 'vue';
import axios from 'axios';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  projectId: {
    type: String,
    required: true
  }
});
const requirementsName = ref('');
const requirementsContent = ref('');

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const registerRequirement = async () => {
  if (!requirementsName.value || !requirementsContent.value) {
    alert('모든 필드를 입력해주세요.');
    return;
  }

  try {
    await axios.post('http://localhost:8888/requirements/create', {
      requirementsProjectId: props.projectId,
      requirementsName: requirementsName.value,
      requirementsContent: requirementsContent.value,
    });
    alert('요구사항이 성공적으로 등록되었습니다.');
    close();
    emit('update');
  } catch (error) {
    console.error('Error registering requirement:', error);
    alert('요구사항 등록 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
