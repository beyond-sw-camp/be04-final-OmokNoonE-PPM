<template>
  <div class="modal" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">구성원 추가</h5>
        </div>
        <div class="modal-body">
          <div class="table-responsive p-0">
            <table class="table align-items-center mb-0">
              <thead>
              <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">선택</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-3">이름</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-1">직책</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-center ps-2">연락처</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-left ps-4">가입일</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="member in availableMembers" :key="member.id">
                <td class="text-left">
                  <input type="checkbox" v-model="selectedMembers" :value="member.id" />
                </td>
                <td class="text-left">
                  <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{ member.name }}</h6>
                    </div>
                  </div>
                </td>
                <td class="text-left">
                  <select v-model="member.role" class="form-select text-xs font-weight-bold mb-0">
                    <option value="PM">PM</option>
                    <option value="PL">PL</option>
                    <option value="PA">PA</option>
                  </select>
                </td>
                <td class="align-middle text-center text-sm">
                  <span class="text-secondary text-xs font-weight-bold text-left d-inline-block">E-mail. {{ member.email }}<br><span class="ps-1">Phone. {{ member.phone }}</span></span>
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
          <button type="button" class="btn btn-secondary" @click="$emit('close')">취소</button>
          <button type="button" class="btn btn-primary" @click="addMembers">추가하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  availableMembers: Array
});

const emit = defineEmits(['close', 'add-members']);

const selectedMembers = ref([]);

// availableMembers를 사용하는 방식으로 수정
const availableMembers = ref(props.availableMembers);

// 선택된 멤버의 role 값을 기본값 'PA'로 설정
watch(availableMembers, (newMembers) => {
  newMembers.forEach(member => {
    member.role = 'PA';
  });
}, { immediate: true });

const addMembers = () => {
  if (selectedMembers.value.length === 0) {
    alert('추가할 구성원을 선택해 주세요.');
    return;
  }

  // 선택된 구성원들을 부모 컴포넌트로 전달
  emit('add-members', selectedMembers.value);
  selectedMembers.value = [];
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
  width: 100%;
}

.modal-header,
.modal-body,
.modal-footer {
  margin-bottom: 10px;
}

.form-select {
  font-size: 0.875rem;
  padding: 0.25rem;
}
</style>
