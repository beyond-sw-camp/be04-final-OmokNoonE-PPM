const state = {
    needLogin: true,
    employeeId: "",
    employeeName: "",
    employeeRole: "",       // 회원 권한
    accessToken: localStorage.getItem("accessToken") || null,
    projectId: "",
    projectTitle: "",
    projectMemberId: "",
    roleId: ""              // 프로젝트 권한
};

const mutations = {
    needLogin(state, data) {
        state.needLogin = data;
    },
    employeeId(state, data) {
        state.employeeId = data;
    },
    employeeName(state, data) {
        state.employeeName = data;
    },
    employeeRole(state, data) {
        state.employeeRole = data;
    },
    accessToken(state, data) {
        state.accessToken = data;
        localStorage.setItem('accessToken', data);
    },
    projectId: (state, data) => {
        state.projectId = data;
    },
    projectTitle: (state, data) => {
        state.projectTitle = data;
    },
    projectMemberId: (state, data) => {
        state.projectMemberId = data;
    },
    roleId: (state, data) => {
        state.roleId = data;
    }
};

const actions = {
    resetLogin({commit}) {
        commit("needLogin", true);
        commit("employeeId", "");
        commit("employeeName", "");
        commit("employeeRole", "");
        commit("accessToken", "");
        commit("projectId", "");
        commit("projectTitle", "");
        commit("projectMemberId", "");
        commit("roleId", "");
    }
};

const getters = {
    needLogin(state) {
        return state.needLogin;
    },
    employeeId(state) {
        return state.employeeId;
    },
    employeeName(state) {
        return state.employeeName;
    },
    employeeRole(state) {
        return state.employeeRole;
    },
    accessToken(state) {
        return state.accessToken;
    },
    projectId: (state) => {
        return state.projectId;
    },
    projectTitle: (state) => {
        return state.projectTitle;
    },
    projectMemberId: (state) => {
        return state.projectMemberId;
    },
    roleId: (state) => {
        return state.roleId;
    },
};

export default {
    state,
    mutations,
    actions,
    getters
};
