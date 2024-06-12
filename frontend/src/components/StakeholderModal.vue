<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>담당자 선택</h2>
      <input type="text" v-model="searchQuery" placeholder="검색...">
      <div class="stakeholder-list">
        <label v-for="stakeholder in filteredStakeholders" :key="stakeholder">
          <input type="checkbox" :value="stakeholder" v-model="checkedStakeholders">
          {{ stakeholder }}
        </label>
      </div>
      <button @click="selectStakeholders">선택</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'StakeholderModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    selectedStakeholders: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
      stakeholders: ['홍길동(EP000)', '조자룡(EP001)', '유비(EP002)'],  //TODO. 이해관계자 목록을 받아오도록 수정
      checkedStakeholders: [],
    };
  },
  watch: {
    selectedStakeholders: {
      immediate: true,
      handler(newVal) {
        this.checkedStakeholders = [...newVal];
      },
    },
  },
  computed: {
    filteredStakeholders() {
      return this.stakeholders.filter(stakeholder =>
          stakeholder.includes(this.searchQuery)
      );
    },
  },
  methods: {
    selectStakeholders() {
      console.log(this.checkedStakeholders); // 콘솔에 선택한 이해관계자들 출력
      this.$emit('select', this.checkedStakeholders);
      this.$emit('close');
    },
  },
};
</script>


<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 25px;
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.stakeholder-list {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 20px;
}

.stakeholder-list label {
  display: block;
  margin-bottom: 10px;
}
</style>
