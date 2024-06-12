<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">요구사항 수정</h5>
        <button type="button" class="close" @click="close">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="updateRequirement" class="text-start mt-3">
          <div class="mb-3">
            <label for="requirementsName">요구사항명</label>
            <MaterialInput
                type="text"
                v-model="requirementsName">
            </MaterialInput>
<!--            <input id="requirementsName" type="text" v-model="requirementsName" class="form-control"/>-->
          </div>
          <div class="mb-3">
            <label for="requirementsContent">요구사항 내용</label>
            <MaterialInput type="text" v-model="requirementsContent"></MaterialInput>
<!--            <input id="requirementsContent" type="text" v-model="requirementsContent" class="form-control"/>-->
          </div>
          <div class="mb-3">
            <label for="reason">수정 사유</label>
            <MaterialInput label="수정 사유를 입력하세요"
                type="text" v-model="requirementHistoryReason"></MaterialInput>
<!--            <input id="reason" type="text" v-model="requirementHistoryReason" class="form-control"/>-->
          </div>
          <!--          <div class="mb-3">-->
          <!--            <label for="projectMemberId">프로젝트 멤버 아이디</label>-->
          <!--            <input id="projectMemberId" type="text" v-model="requirementHistoryProjectMemberId" class="form-control"/>-->
          <!--          </div>-->
          <div class="text-center">
            <button type="submit" class="btn btn-success my-4 mb-2">수정</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch} from 'vue';
import {defaultInstance} from "@/axios/axios-instance";
import store from "@/store";
import {useToast} from "vue-toastification";
import MaterialInput from "@/components/MaterialInput.vue";

const props = defineProps({
  isVisible: Boolean,
  requirement: Object
});

const emit = defineEmits(['close', 'update']);

const toast = useToast();

const requirementsName = ref('');
const requirementsContent = ref('');
const requirementHistoryReason = ref('');
const requirementHistoryProjectMemberId = store.getters.projectMemberId;

watch(() => props.requirement, (newReq) => {
  if (newReq) {
    requirementsName.value = newReq.requirementsName;
    requirementsContent.value = newReq.requirementsContent;
  }
}, {immediate: true});

const close = () => {
  emit('close');
};

const updateRequirement = async () => {
  if (requirementHistoryReason.value.length > 0) {
    try {
      await defaultInstance.put(`/requirements/modify/${props.requirement.requirementsId}`, {
        requirementsName: requirementsName.value,
        requirementsContent: requirementsContent.value,
        requirementHistoryReason: requirementHistoryReason.value,
        requirementHistoryProjectMemberId: requirementHistoryProjectMemberId
      });
      toast.success('요구사항이 성공적으로 수정되었습니다.');
      emit('update');
      close();
    } catch (error) {
      console.error('Error updating requirement:', error);
      toast.error('요구사항 수정 중 오류가 발생했습니다.');
    }
  } else {
    toast.warning('요구사항 수정 사유를 입력하세요.')
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
