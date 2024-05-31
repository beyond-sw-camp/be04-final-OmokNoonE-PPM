<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card my-4">
          <!-- 카드 헤더 -->
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center ps-3">
                <i class="material-icons text-white me-2">notifications</i>
                <h6 class="text-white text-capitalize mb-0">알림</h6>
              </div>
            </div>
          </div>
          <!-- 카드 본문 -->
          <div class="card-body p-3 pb-2 alert-container">
            <div v-for="notification in notifications" :key="notification.id" class="clickable-alert">
              <material-alert class="font-weight-light" color="success">
                <span class="text-sm d-flex align-items-center justify-content-between w-100">
                  <a href="#" class="d-flex align-items-center text-decoration-none text-white w-100" @click.prevent="handleContainerClick(notification)">
                    <button v-if="notification.read" class="mark-read-button">
                      <i class="material-icons text-info">done</i>
                    </button>
                    <span>{{ notification.notificationTitle }}</span>
                    <span class="time">{{ formatTime(notification.notificationCreatedDate) }}</span>
                  </a>
                  <button @click.stop="removeNotification(notification.id)" class="btn btn-link p-0 m-0 text-secondary">
                    <i class="material-icons text-danger">close</i>
                  </button>
                </span>
              </material-alert>
            </div>
            <p v-if="notifications.length === 0 && !errorMessage" class="text-muted">알림이 없습니다.</p>
            <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Snackbar Display -->
    <div v-if="snackbar" class="snackbar-overlay" @click.stop>
      <material-snackbar
          v-if="snackbar"
          :title="snackbar.notificationTitle"
          :date="snackbar.notificationCreatedDate"
          :description="snackbar.notificationContent"
          :icon="{ component: 'notifications', color: 'white' }"
          color="info"
          :close-handler="closeSnackbar"
          @click.stop
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import MaterialAlert from "@/components/MaterialAlert.vue";
import MaterialSnackbar from "@/components/MaterialSnackbar.vue";

// 더미 알림 데이터
const dummyNotifications = [
  {
    id: 1,
    notificationTitle: "Notification 1",
    notificationCreatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notificationContent: "This is the content of notification 1",
    read: false,
  },
  {
    id: 2,
    notificationTitle: "Notification 2",
    notificationCreatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notificationContent: "This is the content of notification 2",
    read: false,
  },
  {
    id: 3,
    notificationTitle: "Notification 3",
    notificationCreatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    notificationContent: "This is the content of notification 3",
    read: false,
  },
];

const snackbar = ref(null);
const store = useStore();
const toast = useToast();
const employeeId = ref(1); // 실제로는 로그인 정보를 기반으로 설정

const handleContainerClick = (notification) => {
  snackbar.value = notification;
  if (!notification.read) {
    markAsRead(notification.id);
  }
};

const closeSnackbar = () => {
  snackbar.value = null;
};

const markAsRead = (id) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
  store
      .dispatch("notifications/markAsRead", { notificationId: id, employeeId: employeeId.value })
      .catch((error) => {
        toast.error(`알림을 읽음으로 표시하는 중 오류 발생: ${error.message}`);
      });
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

const formatTime = (createdDate) => {
  const now = new Date();
  const created = new Date(createdDate);
  const diff = now - created;

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

onMounted(async () => {
  // 더미 알림 데이터를 사용하도록 설정
  notifications.value = dummyNotifications;

  // 실제 데이터 페칭을 비활성화
  /*
  try {
    await store.dispatch('notifications/fetchNotifications', employeeId.value);
    await store.dispatch('notifications/connectWebSocket', employeeId.value);
  } catch (error) {
    toast.error(`데이터를 가져오거나 웹소켓을 연결하는 중 오류 발생: ${error.message}`);
  }
  */

  const interval = setInterval(() => {
    notifications.value = [...notifications.value];
  }, 60000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});

const notifications = ref(dummyNotifications);
const errorMessage = computed(() => store.getters["notifications/errorMessage"] || "");
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

.no-members-text {
  opacity: 0.5;
  font-size: 1.2rem;
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
  color: gray;
}

/* Add the same container style as in Tables.vue */
.container-fluid {
  max-width: 1200px;
  margin: 0 auto;
}
</style>