<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <!-- Snackbar Display -->
        <div v-if="snackbar" class="snackbar-overlay" @click.stop>
          <material-snackbar
              v-if="snackbar.type === 'success'"
              title="Success Notification"
              date="Just now"
              description="This is a success snackbar. The content here is quite long to demonstrate how the text wraps within the snackbar. You can see that as the content grows, it wraps to the next line appropriately, maintaining readability and ensuring the content is fully visible."
              :icon="{ component: 'done', color: 'white' }"
              color="success"
              :close-handler="closeSnackbar"
              @click.stop
          />
          <material-snackbar
              v-if="snackbar.type === 'info'"
              title="Info Notification with an Exceptionally Long Title to Demonstrate How the Snackbar Handles Text Overflow and Wrapping, Making Sure It Looks Good Even When the Text is Really, Really Long"
              date="Just now"
              description="This is an info snackbar. The content here is also quite long to demonstrate how the text wraps within the snackbar. You can see that as the content grows, it wraps to the next line appropriately, maintaining readability and ensuring the content is fully visible."
              :icon="{ component: 'notifications', color: 'white' }"
              color="info"
              :close-handler="closeSnackbar"
              @click.stop
          />
          <material-snackbar
              v-if="snackbar.type === 'warning'"
              title="Warning Notification"
              date="Just now"
              description="This is a warning snackbar."
              :icon="{ component: 'travel_explore', color: 'white' }"
              color="warning"
              :close-handler="closeSnackbar"
              @click.stop
          />
          <material-snackbar
              v-if="snackbar.type === 'danger'"
              title="Danger Notification"
              date="Just now"
              description="This is a danger snackbar."
              :icon="{ component: 'campaign', color: 'white' }"
              color="danger"
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
            <material-alert class="font-weight-light" color="success" dismissible @close="hideAlertButton('success')">
              <span class="text-sm">
                A simple success alert with
                <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('success')">an example link</a>.
                Give it a click if you like.
              </span>
            </material-alert>
            <material-alert class="font-weight-light" color="info" dismissible @close="hideAlertButton('info')">
              <span class="text-sm">
                A simple info alert with
                <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('info')">an example link</a>.
                Give it a click if you like.
              </span>
            </material-alert>
            <div class="scroll-container">
              <!-- Warning Alerts with Scroll -->
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideAlertButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideAlertButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideAlertButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideAlertButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideAlertButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideAlertButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideAlertButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
            </div>
            <material-alert class="font-weight-light" color="danger" dismissible @close="hideAlertButton('danger')">
              <span class="text-sm">
                A simple danger alert with
                <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('danger')">an example link</a>.
                Give it a click if you like.
              </span>
            </material-alert>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MaterialAlert from "@/components/MaterialAlert.vue";
import MaterialSnackbar from "@/components/MaterialSnackbar.vue";

// 스낵바의 현재 상태를 저장
const snackbar = ref(null);
const hiddenAlerts = ref([]);

// 스낵바를 표시하는 함수
const showSnackbar = (type) => {
  snackbar.value = { type };
};

// 스낵바를 닫는 함수
const closeSnackbar = () => {
  snackbar.value = null;
};

// 알림 버튼을 숨기는 함수
const hideAlertButton = (type, event) => {
  event.stopPropagation();
  const alertElement = event.target.closest('.alert');
  if (alertElement && !hiddenAlerts.value.includes(type)) {
    hiddenAlerts.value.push(type);
  }
};
</script>

<style scoped>
/* 스낵바 활성화 시 화면을 어둡게 만드는 오버레이 스타일 */
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

/* 알림 컨테이너 스타일 */
.alert-container {
  max-height: 450px;
  overflow-y: auto;
  padding-right: 10px;
}

/* 스크롤 가능한 경고 알림 스타일 */
.scroll-container {
  overflow-y: auto;
}
</style>
