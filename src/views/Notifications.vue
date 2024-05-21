<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <!-- Snackbar Display -->
        <div v-if="snackbar" class="snackbar-overlay" @click="closeSnackbar">
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
            <h5 class="mb-0">Alerts</h5>
          </div>
          <div class="card-body p-3 pb-0 alert-container">
            <material-alert class="font-weight-light" color="success" dismissible @close="hideSnackbarButton('success')">
              <span class="text-sm">
                A simple success alert with
                <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('success')">an example link</a>.
                Give it a click if you like.
              </span>
            </material-alert>
            <material-alert class="font-weight-light" color="info" dismissible @close="hideSnackbarButton('info')">
              <span class="text-sm">
                A simple info alert with
                <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('info')">an example link</a>.
                Give it a click if you like.
              </span>
            </material-alert>
            <div class="scroll-container">
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideSnackbarButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideSnackbarButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideSnackbarButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideSnackbarButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideSnackbarButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
              <material-alert class="font-weight-light" color="warning" dismissible @close="hideSnackbarButton('warning')">
                <span class="text-sm">
                  A simple warning alert with
                  <a href="javascript:;" class="alert-link text-white" @click="showSnackbar('warning')">an example link</a>.
                  Give it a click if you like.
                </span>
              </material-alert>
            </div>
            <material-alert class="font-weight-light" color="danger" dismissible @close="hideSnackbarButton('danger')">
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
import {ref} from 'vue';
import MaterialAlert from "@/components/MaterialAlert.vue";
import MaterialSnackbar from "@/components/MaterialSnackbar.vue";

const snackbar = ref(null);
const hiddenSnackbars = ref([]);

const showSnackbar = (type) => {
  snackbar.value = {type};
};

const closeSnackbar = () => {
  snackbar.value = null;
};

const hideSnackbarButton = (type, event) => {
  event.stopPropagation();
  hiddenSnackbars.value.push(type);
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
  z-index: 9998; /* 스낵바보다 살짝 낮게 설정 */
  background-color: rgba(0, 0, 0, 0.5); /* 배경을 어둡게 해서 포커스를 맞춤 */
}

.alert-container {
  max-height: 300px; /* 최대 높이를 설정하여 스크롤 가능하도록 설정 */
  overflow-y: auto; /* 세로 스크롤 설정 */
  padding-right: 10px; /* 스크롤바와 내용 간의 간격 조절 */
}

.scroll-container {
  overflow-y: auto; /* 세로 스크롤 설정 */
}
</style>
