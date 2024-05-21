<template>
  <div class="snackbar-container" :class="getColor(color)" @click.self="closeHandler">
    <div class="icon-wrapper">
      <i class="material-icons" :class="getIcon(icon.color)">{{ icon.component }}</i>
    </div>
    <div class="title-wrapper">
      <span class="font-weight-bold title-text" :class="getTextColor(color)">{{ title }}</span>
      <small :class="getTextColor(color)">{{ date }}</small>
    </div>
    <div class="card-body p-3 pb-0 content-text" :class="getTextColor(color)">
      {{ description }}
    </div>
    <i
        class="fas fa-times text-md ms-3 cursor-pointer close-icon"
        :class="getTextColor(color)"
        @click.stop="closeHandler"
    />
  </div>
</template>

<script setup>
import { defineProps, toRefs } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  icon: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    default: "success",
  },
  closeHandler: {
    type: Function,
    default: () => {},
  },
});

const { title, date, description, icon, color, closeHandler } = toRefs(props);

const getColor = (color) => {
  return color === "white" ? "bg-white" : `bg-gradient-${color}`;
};

const getIcon = (iconColor) => {
  return iconColor ? `text-${iconColor}` : null;
};

const getTextColor = (color) => {
  return color === "white" ? "text-dark" : "text-white";
};
</script>

<style scoped>
.snackbar-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  min-width: 500px;
  max-width: 90%;
  width: auto;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff; /* 필요한 경우 기본 배경색 설정 */
  overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
  word-wrap: break-word; /* 줄바꿈 설정 */
  hyphens: auto; /* 자동 하이픈 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-wrapper {
  margin-bottom: 8px;
}

.title-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title-text {
  word-wrap: break-word;
  white-space: normal;
}

.card-body {
  padding-top: 10px;
}

.content-text {
  white-space: pre-wrap; /* 줄바꿈 유지 */
  overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
}

.close-icon {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
