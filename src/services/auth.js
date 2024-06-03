import { defaultInstance, authInstance } from '../axios/axios-instance.js';
import store from "@/store";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

export async function login(employeeId, password) {
    const response = await defaultInstance.post('/login', {
        employeeId,
        employeePassword: password
    });

    if (response.status === 200) {  // 로그인 성공 시 처리
        let headersData = response.headers;

        store.commit("needLogin", false);                                            // 로그인 필요 여부 변경
        store.commit('accessToken', headersData["accesstoken"]);                            // accessToken 저장
        store.commit("employeeId", headersData["employeeid"]);                              // 회원ID 저장
        store.commit("projectId", headersData["projectid"]);                                // 프로젝트ID 저장
        store.commit("projectMemberId", headersData["projectmemberid"]);                    // 프로젝트 멤버ID 저장
        store.commit("roleId", headersData["roleid"]);                                      // 권한ID 저장

        let encodedEmployeeName = headersData["employeename"];
        let decodedEmployeeName = decodeURIComponent(escape(atob(encodedEmployeeName)));  // 이름 디코딩
        store.commit("employeeName", decodedEmployeeName);                                  // 이름 저장
    }
}

// 로그아웃 구현
export async function logout() {
    // 로그인이 필요한 경우 로그아웃을 건너뜀
    if (store.state.needLogin) {
        return;
    }

    // 로그아웃 처리
    localStorage.removeItem('accessToken');
    cookies.remove('refreshTokenId');
    store.commit('needLogin', true);
    store.commit('employeeId', '');
    store.commit('employeeName', '');
    store.commit('accessToken', '');
    store.commit('projectId', '');
    store.commit('projectMemberId', '');
}

export async function refreshToken() {
    // 로그인이 필요한 경우 토큰 갱신을 건너뜀
    if (store.state.needLogin) {
        return;
    }

    const refreshTokenRow = cookies.get('refreshTokenId')
    if (!refreshTokenRow) {
        throw new Error('Refresh token not found');
    }

    const refreshToken = cookies.get('refreshTokenId')
    const response = await authInstance.post('/refresh-token', { refreshToken });
    store.commit('accessToken', response.data.accessToken);
}