<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card my-4">
          <!-- 카드 헤더 -->
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div :class="dynamicClass">
              <div class="d-flex align-items-center ps-3">
                <i class="material-icons text-white me-2">notifications</i>
                <h6 class="text-white text-capitalize mb-0">알림</h6>
              </div>
              <div class="d-flex align-items-center">
                <button
                    class="btn btn-link text-white text-decoration-none"
                    @click="sendNotifications"
                >
                  <i class="material-icons text-white">refresh</i> 새로고침
                </button>
              </div>
            </div>
          </div>
          <!-- 카드 본문 -->
          <div class="card-body p-3 pb-2 alert-container">
            <div
                v-for="notification in notifications"
                :key="notification.notificationId"
                class="clickable-alert"
            >
              <material-alert class="font-weight-bold" color="light">
                <span
                    class="text-sm d-flex align-items-center justify-content-between w-100"
                >
                  <a
                      href="#"
                      class="d-flex align-items-center text-decoration-none text-black w-100"
                      @click.prevent="handleContainerClick(notification)"
                  >
                    <button v-if="notification.markAsRead" class="mark-read-button">
                      <i class="material-icons text-info">done</i>
                    </button>
                    <span>{{ notification.notificationTitle }}</span>
                    <span class="time">
                      {{ formatTime(notification.notificationCreatedDate) }}
                    </span>
                  </a>
                  <button
                      @click.stop="removeNotification(notification.notificationId)"
                      class="btn btn-link p-0 m-0 text-secondary"
                  >
                    <i class="material-icons text-danger">close</i>
                  </button>
                </span>
              </material-alert>
            </div>
            <p
                v-if="notifications.length === 0 && !errorMessage"
                class="no-notifications-text"
            >
              알림이 없습니다.
            </p>
            <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Snackbar Display -->
    <div v-if="snackbar" class="snackbar-overlay" @click.self="closeNotification">
      <material-snackbar
          v-if="snackbar"
          :title="snackbar.notificationTitle"
          :date="snackbar.notificationCreatedDate"
          :description="snackbar.notificationContent"
          :icon="snackbarIcon"
          color="info"
          :close-handler="closeSnackbar"
          @click.stop
      />
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
// import {ref, onMounted, computed, onUnmounted, reactive, watch} from 'vue';
import {useToast} from 'vue-toastification';
import MaterialAlert from "@/components/MaterialAlert.vue";
import MaterialSnackbar from "@/components/MaterialSnackbar.vue";
import store from "@/store";
import {defaultInstance} from "@/axios/axios-instance";

const snackbar = ref(null);
const toast = useToast();
const employeeId = store.getters.employeeId;

const handleContainerClick = async (notification) => {
  snackbar.value = notification;
  if (!notification.markAsRead) {
    await markAsRead(notification.notificationId);
  }
};

const closeSnackbar = () => {
  snackbar.value = null;
};

const markAsRead = async (id) => {
  const notification = notifications.value.find((n) => n.notificationId === id);
  if (notification) {
    notification.markAsRead = true;
  }
  try {
    await store.dispatch("markAsRead", {notificationId: id, employeeId: employeeId.value});
  } catch (error) {
    toast.error(`알림을 읽음으로 표시하는 중 오류 발생: ${error.message}`);
  }
};

const removeNotification = async (notificationId) => {
  try {
    const response = await defaultInstance.delete(`/notifications/remove/${notificationId}`);

    if (response.status === 204) {
      await fetchNotifications();
      notifications.value = notifications.value.filter(notification => notification.notificationId !== notificationId);
    } else {
      toast.error('알림 삭제 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('알림 삭제 중 오류 발생:', error);
    alert('알림 삭제 중 오류가 발생했습니다.');
  }
};

const formatTime = (createdDate) => {
  const now = new Date();
  const diff = now - createdDate;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) {
    return `${minutes}분 전`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}시간 전`;
  }
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
};

const fetchNotifications = async () => {
  try {
    await store.dispatch("notifications/fetchNotifications", employeeId);
  } catch (error) {
    toast.error(`데이터를 가져오는 중 오류 발생: ${error.message}`);
  }
};
// const state = reactive({
//   employeeId: null,
//   stopPolling: null,
// });

// 알림 생성 메소드 (임시)
const sendNotifications = async () => {
  try {
    await defaultInstance.get(`/notifications/send/${store.getters.projectId}`);
  } catch (error) {
    toast.error(`알림을 보내는 중 오류 발생: ${error.message}`);
  }
};

onMounted(async () => {
  store.dispatch("notifications/resetNotification");
  await fetchNotifications();

  // employeeId를 감시하고 변경을 감지
  // watch(
  //     () => state.employeeId,
  //     (newEmployeeId) => { // oldEmployeeId를 완전히 제거
  //       // employeeId가 변경되면 이전의 폴링을 중지하고 새로운 폴링을 시작
  //       if (state.stopPolling) {
  //         state.stopPolling();
  //         console.log('Polling stopped due to employeeId change');
  //       }
  //       if (newEmployeeId) {
  //         state.stopPolling = store.dispatch('notifications/startPolling', newEmployeeId);
  //         console.log('Polling started due to employeeId change');
  //       }
  //     },
  //     { immediate: true } // 초기 employeeId 값에 대해서도 watch 적용
  // );

  // 컴포넌트 언마운트 시 폴링 중지
  // onUnmounted(async () => {
  //   console.log("Polling stopped");
  //   if (typeof state.stopPolling === 'function') {
  //     (await state.stopPolling)();
  //   } else {
  //     console.error("stopPolling is not a function");
  //   }
  // });
});

// 여기서 notifications를 기본값으로 빈 배열로 초기화합니다.
const notifications = computed(() => store.state.notifications.notifications || []);
const errorMessage = computed(() => store.getters["notifications/errorMessage"] || "");
const snackbarIcon = computed(() => snackbar.value ? {component: "notifications", color: "white"} : null);

const color = computed(() => store.getters.getColor);
const dynamicClass = computed(() => {
  return {
    [`bg-gradient-${color.value} shadow-${color.value} border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center`]: true
  }
});

function closeNotification() {
  snackbar.value = null;
};
</script>

<style scoped>
.card-header {
  padding: 0;
  position: relative;
  margin-top: -1.5rem;
  margin-left: 1rem;
  margin-right: 1rem;
  z-index: 2;
}

.shadow-success {
  box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
}

.border-radius-lg {
  border-radius: 1rem !important;
}

.pt-4 {
  padding-top: 1.5rem !important;
}

.pb-3 {
  padding-bottom: 1rem !important;
}

.d-flex {
  display: flex !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

.align-items-center {
  align-items: center !important;
}

.ps-3 {
  padding-left: 1rem !important;
}

.me-2 {
  margin-right: 0.5rem !important;
}

.text-white {
  color: #fff !important;
}

.text-capitalize {
  text-transform: capitalize !important;
}

.card-body {
  max-height: 480px; /* Alert Cards의 크기를 더 크게 설정 */
  min-height: 480px; /* 최소 높이를 설정하여 컨텐츠가 없을 때도 높이를 유지 */
  overflow-y: auto;
}

.no-notifications-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 부모 컨테이너의 전체 높이 */
  color: rgba(0, 0, 0, 0.5); /* 반투명 텍스트 */
  font-size: 1.2rem; /* 글씨 크기 조절 */
  text-align: center;
}

.snackbar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.5);
}

.clickable-alert {
  cursor: pointer; /* 클릭할 수 있음을 나타내는 커서 스타일 */
}

.mark-read-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  margin-right: 10px;
}

.time {
  margin-left: 10px;
  font-size: 0.875rem;
  font-weight: normal;
}

/* Add the same container style as in ProjectMember.vue */
.container-fluid {
  max-width: 800px;
  margin: 0 auto;
}
</style>
