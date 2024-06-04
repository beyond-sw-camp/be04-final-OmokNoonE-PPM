<template>
  <div
    class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="todo"
            navText="TODO"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">list_alt</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="dashboard"
          navText="대시보드"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">dashboard</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="project-member"
          navText="프로젝트 구성원"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">groups</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="shcedules"
          navText="일정"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">table_view</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
            url="#"
            :aria-controls="''"
            v-bind:collapse="false"
            collapseRef="requirements"
            navText="요구사항"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">receipt_long</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="notifications"
          navText="알림"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">notifications</i>
          </template>
        </sidenav-collapse>
      </li>
      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder text-white"
          :class="$store.state.isRTL ? 'me-4' : 'ms-2'"
        >
          ACCOUNT PAGES
        </h6>
      </li>

      <!-- 로그인 상태에 따라 Sign-In과 Logout이 보인다. -->
      <li class="nav-item">
        <sidenav-collapse
          v-if="needLogin"
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="sign-in"
          navText="SignIn"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">login</i>
          </template>
        </sidenav-collapse>
        <sidenav-collapse
          v-else
          url="#"
          :aria-controls="''"
          v-bind:collapse="false"
          collapseRef="logout"
          navText="Logout"
          @click="logout"
        >
          <template v-slot:icon>
            <i class="material-icons-round opacity-10 fs-5">logout</i>
          </template>
        </sidenav-collapse>
      </li>
    </ul>
    <div class="sidenav-footer position-absolute w-100 bottom-0">
      <div class="mx-3">
        <a
          class="btn w-100 "
          :class="`bg-gradient-${this.$store.state.color}`"
          @click="openProjectModal"
          >프로젝트 목록</a
        >
      </div>
    </div>
<!--    <sidenav-create-project-modal ref="createProjectModal" />-->
  </div>
</template>
<script>
import SidenavCollapse from "./SidenavCollapse.vue";
// import SidenavCreateProjectModal from "./SidenavCreateProjectModal.vue";
import {logout} from "@/services/auth";
import {mapState} from "vuex";
import store from "@/store";

export default {
  name: "SidenavList",
  computed: {
    store() {
      return store
    },
    ...mapState(["needLogin"]),
  },
  props: {
    cardBg: String,
  },
  data() {
    return {
      title: "Soft UI Dashboard PRO",
      controls: "dashboardsExamples",
      isActive: "active",
    };
  },
  components: {
    SidenavCollapse,
    // SidenavCreateProjectModal,
  },
  methods: {
    logout,
    openProjectModal(){
      store.dispatch('openProjectModal');
      console.log('openProjectModal: ', store.getters.getIsProjectModalOpen);
    },
  },
};
</script>
