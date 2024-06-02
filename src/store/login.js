const state = {
    needLogin: true,
    employeeId: "",
    employeeName: "",
    accessToken: localStorage.getItem("accessToken") || null,
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
    accessToken(state, data) {
        state.accessToken = data;
        localStorage.setItem('accessToken', data);
    },
};

const actions = {

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
    accessToken(state) {
        return state.accessToken;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
