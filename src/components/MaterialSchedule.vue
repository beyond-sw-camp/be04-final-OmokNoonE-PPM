<template>
  <div>
    <!-- 버튼 추가 -->
    <button @click="openModal">모달 열기</button>

    <div class="modal" v-if="isOpen">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <iframe :src="modalUrl" class="modal-frame"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isOpen', 'modalUrl'],
  methods: {
    openModal() {
      // @open-modal 이벤트 대신 openModal 메서드 호출
      this.$emit('open-modal');
    },
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
/* 모달 스타일 */
.modal {
  display: none; /* 기본적으로 숨겨진 상태 */
  position: fixed; /* 고정 위치 */
  z-index: 1; /* 다른 요소 위에 배치 */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* 스크롤이 필요한 경우 스크롤 */
  background-color: rgba(0,0,0,0.4); /* 반투명 배경 */
}

/* 모달 내용 */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 모달이 화면 중앙에 위치하도록 함 */
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* 모달 닫기 버튼 스타일 */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/* 모달 내용 스타일 */
.modal-frame {
  width: 100%;
  height: 80vh; /* 모달 내부 내용의 높이를 조절할 수 있습니다. */
}
</style>
