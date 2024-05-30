<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">직책 변경</h5>
        </div>
        <div class="modal-body">
          <div v-if="isLoading" class="loading-spinner">로딩 중...</div>
          <div v-else class="table-responsive p-0">
            <table class="table align-items-center mb-0">
              <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">
                  선택
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">이름</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-1">직책</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center ps-2">연락처
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-4">시작일</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="member in projectMembers" :key="member.id"
                  :class="{ 'is-selected': selectedMemberIds.includes(member.id) }">
                <td class="text-left">
                  <MaterialCheckbox v-model="selectedMemberIds" :value="member.id"/>
                </td>
                <td class="text-left">
                  <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{ member.name }}</h6>
                    </div>
                  </div>
                </td>
                <td class="text-left">
                  <select v-model="member.role" class="form-select form-select-sm"
                          :disabled="!selectedMemberIds.includes(member.id)">
                    <option value="PA">PA</option>
                    <option value="PL">PL</option>
                    <option value="PM">PM</option>
                  </select>
                </td>
                <td class="align-middle text-center text-sm">
                    <span class="text-secondary text-xs font-weight-bold text-left d-inline-block">
                      E-mail. {{ member.email }}<br/><span class="ps-1">Phone. {{ member.phone }}</span>
                    </span>
                </td>
                <td class="align-middle text-left text-sm">
                  <span class="text-secondary text-xs font-weight-bold">{{ member.startDate }}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <MaterialButton color="secondary" size="md" variant="fill" @click="confirmClose">취소</MaterialButton>
          <MaterialButton color="info" size="md" variant="fill" @click="saveChanges">저장</MaterialButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import MaterialButton from '@/components/MaterialButton.vue';
import MaterialCheckbox from '@/components/MaterialCheckbox.vue';
import {useToast} from 'vue-toastification';

const props = defineProps({
  projectMembers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'save-changes']);

const selectedMemberIds = ref([]);
const isLoading = ref(false);
const toast = useToast();

const saveChanges = async () => {
  if (selectedMemberIds.value.length === 0) {
    toast.error('직책을 변경할 구성원을 선택해 주세요.');
    return;
  }
  const selectedMembers = props.projectMembers.filter(member => selectedMemberIds.value.includes(member.id));
  if (selectedMembers.length === 0) {
    toast.error('유효하지 않은 구성원입니다.');
    return;
  }
  try {
    emit('save-changes', selectedMembers);
    toast.success('구성원의 직책이 성공적으로 변경되었습니다.');
  } catch (error) {
    toast.error('구성원 직책 변경 중 오류가 발생했습니다.');
  }
};

const confirmClose = () => {
  if (selectedMemberIds.value.length > 0) {
    if (confirm('직책 변경을 취소하시겠습니까?')) {
      emit('close');
    }
  } else {
    emit('close');
  }
};
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-dialog {
  background: white;
  border-radius: 5px;
  padding: 20px;
  max-width: 800px;
  width: 70%;
  height: 70%;
}

.modal-content {
  height: 100%;
}

.modal-body {
  height: 70%;
  overflow-y: auto;
}

.loading-spinner {
  text-align: center;
  font-size: 1.5rem;
}

.is-selected {
  background-color: rgba(0, 123, 255, 0.1);
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 90%;
    height: 90%;
  }

  .modal-content {
    height: 100%;
  }

  .modal-body {
    height: 80%;
    overflow-y: auto;
  }

  .table-responsive {
    overflow-x: auto;
  }

  .modal-footer {
    display: flex;
    flex-direction: column;
  }
}
</style>
