<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-md-8 mx-auto">
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

        <!-- Alert Cards -->
        <div class="card mt-4">
          <div class="card-header p-3">
            <h5 class="mb-0">알림</h5>
          </div>
          <div class="card-body p-3 pb-0 alert-container">
            <div v-if="errorMessage" class="error-message" role="alert">
              {{ errorMessage }}
            </div>
            <div v-else>
              <div v-for="notification in notifications" :key="notification.id">
                <material-alert
                    class="font-weight-light clickable-alert"
                    color="success"
                    dismissible
                    @close="hideAlertButton(notification.id, $event)"
                    @click="handleContainerClick(notification)"
                >
                  <span class="text-sm">
                    {{ notification.notificationTitle }}
                    <span class="time">{{ formatTime(notification.notificationCreatedDate) }}</span>
                    <button v-if="notification.read" class="mark-read-button">
                      <i class="fas fa-check text-info"></i>
                    </button>
                  </span>
                </material-alert>
              </div>
              <p v-if="notifications.length === 0" class="text-muted">알림이 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useStore } from 'vuex';
import MaterialAlert from "@/components/MaterialAlert.vue";
import MaterialSnackbar from "@/components/MaterialSnackbar.vue";

const snackbar = ref(null);
const store = useStore();
const employeeId = ref(1); // 실제로는 로그인 정보를 기반으로 설정
const hiddenAlerts = ref([]);

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
  store.dispatch('markAsRead', { notificationId: id, employeeId: employeeId.value });
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

onMounted(() => {
  store.dispatch('fetchNotifications', employeeId.value);
  store.dispatch('connectWebSocket', employeeId.value);

  const interval = setInterval(() => {
    notifications.value = [...notifications.value];
  }, 60000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});

const notifications = computed(() => store.getters.unreadNotifications);
const errorMessage = computed(() => store.getters.errorMessage);

const hideAlertButton = (id, event) => {
  event.stopPropagation();
  const alertElement = event.target.closest('.alert');
  if (alertElement && !hiddenAlerts.value.includes(id)) {
    hiddenAlerts.value.push(id);
  }
};
</script>

<style scoped>
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

.alert-container {
  max-height: 450px; /* 알림 컨테이너의 원래 크기로 유지 */
  overflow-y: auto;
  padding-right: 10px;
  position: relative;
}

.mark-read-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  margin-left: 10px;
}

.time {
  margin-left: 10px;
  font-size: 0.875rem;
  color: gray;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5); /* 반투명한 배경색 */
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  z-index: 10;
  color: white; /* 글자색을 흰색으로 설정 */
  font-size: 1.5rem; /* 적절히 큰 글씨 크기 */
}

.card-body {
  max-height: 600px; /* Alert Cards의 크기를 더 크게 설정 */
  min-height: 600px; /* 최소 높이를 설정하여 컨텐츠가 없을 때도 높이를 유지 */
  overflow-y: auto;
}

.clickable-alert {
  cursor: pointer; /* 클릭할 수 있음을 나타내는 커서 스타일 */
}

@media (max-width: 576px) {
  .card-body {
    max-height: 90vh; /* 작은 화면에서 높이 조정 */
    min-height: 90vh;
  }
}
</style>
