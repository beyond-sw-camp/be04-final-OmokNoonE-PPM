import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import ProjectMember from "../views/ProjectMember.vue";
import Billing from "../views/Billing.vue";
import RTL from "../views/Rtl.vue";
import Notifications from "../views/Notifications.vue";
import Profile from "../views/Profile.vue";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";
import Requirements from "@/views/Requirements.vue";
import RegisterRequirement from "@/views/RegisterRequirement.vue";
import store from '../store/index.js';
import { refreshToken } from '../services/auth.js';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/project-member",
    name: "ProjectMember",
    component: ProjectMember,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/requirements",
    name: "Requirements",
    component: Requirements,
  },
  {
    path: "/requirements/register",
    name: "RegisterRequirement",
    component: RegisterRequirement,
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
  if (store.state.needLogin) {
    next();
    return;
  }

  const accessToken = store.state.accessToken;

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
