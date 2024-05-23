<template>
  <div class="modal">
    <component :is="currentModal" v-bind="modalProps"></component>
  </div>
</template>

<script>
import PermissionModal from '@/components/PermissionModal.vue';
import StakeholderModal from '@/components/StakeholderModal.vue';
import TaskModal from '@/components/TaskModal.vue';
import RequirementModal from '@/components/RequirementModal.vue';

export default {
  components: {
    PermissionModal,
    StakeholderModal,
    TaskModal,
    RequirementModal
  },
  data() {
    return {
      currentModal: null,
      modalProps: {}
    };
  },
  methods: {
    openModal(name, props) {
      this.currentModal = name;
      this.modalProps = props;
    },
    closeModal() {
      this.currentModal = null;
      this.modalProps = {};
    }
  }
};
</script>
