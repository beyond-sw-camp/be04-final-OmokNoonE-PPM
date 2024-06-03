import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import ProjectMember from "../views/ProjectMember.vue";
import Schedules from "../views/Schedules.vue";
import Notifications from "../views/Notifications.vue";
import SignIn from "../views/SignIn.vue";
import MaterialSchedule from "@/components/MaterialSchedule.vue";
import Requirements from "@/views/Requirements.vue";
import RegisterRequirement from "@/views/RegisterRequirement.vue";
import Todo from "@/views/Todo.vue";
import {useStore} from "vuex";
import { refreshToken } from '../services/auth.js';
import { useCookies } from 'vue3-cookies';
import CreateSchedule from "@/views/CreateSchedule.vue";
const { cookies } = useCookies();

const store = useStore();

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/todo",
  },
  {
    path: "/dashboard",
    name: "대시보드",
    component: Dashboard,
  },
  {
    path: "/project-member",
    name: "프로젝트 구성원",
    component: ProjectMember,
  },
  {
    path: "/notifications",
    name: "알림",
    component: Notifications,
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/requirements",
    name: "요구사항",
    component: Requirements,
  },
  {
    path: "/requirements/register",
    name: "RegisterRequirement",
    component: RegisterRequirement,
  },
  {
    path: "/todo",
    name: "Todo",
    component: Todo,
  },
  {
    path: "/shcedules",
    name: "일정",
    component: Schedules,
  },
  {
    path: "/schedules/details/:scheduleId",
    name: "SchedulesDetails",
    component: MaterialSchedule,
  },
  {
    path: "/schedules/:projectId/create",
    name: "CreateSchedule",
    component: CreateSchedule,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

function isTokenExpired(token) {
  if (!token) {
    return true;
  }

  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  const expiryDate = new Date(tokenPayload.exp * 1000);

  return expiryDate < new Date();
}

router.beforeEach(async (to, from, next) => {
  // 로그인이 필요한 경우 토큰 갱신을 건너뜀
  if (store.getters.needLogin) {
    next();
    return;
  }

  const accessToken = store.getters.accessToken;

  // accessToken이 만료되었는지 확인하고 만료되었다면 refreshToken을 사용해 accessToken을 갱신
  if (accessToken && isTokenExpired(accessToken)) {
    await refreshToken();
  }

  // 로컬 스토리지와 쿠키의 값이 유지되도록 하는 코드
  const localStorageData = localStorage.getItem('accessToken');
  const refreshTokenId = cookies.get('refreshTokenId')

  if (!localStorageData || !refreshTokenId) {
    // 로컬 스토리지나 쿠키의 값이 없는 경우, 페이지 이동을 취소하고 로그인 페이지로 리다이렉트
    next('/sign-in');
  } else {
    // 로컬 스토리지와 쿠키의 값이 있는 경우, 페이지 이동을 허용
    next();
  }
});

export default router;
