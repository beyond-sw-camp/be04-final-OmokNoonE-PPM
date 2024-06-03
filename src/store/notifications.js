import {defaultInstance} from "@/axios/axios-instance";

const state = {
    notifications: [],
    fetchedNotifications: new Set(),
    errorMessage: null
};

const mutations = {
    SET_NOTIFICATIONS(state, notifications) {
        state.notifications = notifications;
    },
    MARK_AS_READ(state, notificationId) {
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    },
    ADD_NOTIFICATION(state, notification) {
        if (!state.fetchedNotifications.has(notification.id)) {
            state.notifications.push(notification);
            state.fetchedNotifications.add(notification.id);
        }
    },
    ADD_FETCHED_NOTIFICATION(state, notificationId) {
        state.fetchedNotifications.add(notificationId);
    },
    SET_ERROR_MESSAGE(state, message) {
        state.errorMessage = message;
    }
};

const actions = {
    async fetchNotifications({ commit }, employeeId) {
        try {
            if (process.env.NODE_ENV === 'development') {
                const dummyNotifications = [
                    {
                        id: 1,
                        notificationTitle: "Notification 1",
                        notificationCreatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        notificationContent: "This is the content of notification 1",
                        read: false,
                    },
                    {
                        id: 2,
                        notificationTitle: "Notification 2",
                        notificationCreatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        notificationContent: "This is the content of notification 2",
                        read: false,
                    },
                    {
                        id: 3,
                        notificationTitle: "Notification 3",
                        notificationCreatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                        notificationContent: "This is the content of notification 3",
                        read: false,
                    },
                ];
                commit('SET_NOTIFICATIONS', dummyNotifications);
                dummyNotifications.forEach(notification => {
                    commit('ADD_FETCHED_NOTIFICATION', notification.id);
                });
            } else {
                const response = await defaultInstance.get(`/notifications/recent/${employeeId}`);
                const notifications = response.data.getRecentNotifications;
                commit('SET_NOTIFICATIONS', notifications);
                notifications.forEach(notification => {
                    commit('ADD_FETCHED_NOTIFICATION', notification.id);
                });
            }
        } catch (error) {
            commit('SET_ERROR_MESSAGE', `알림을 가져오는 중 오류 발생: ${error.response ? error.response.status : error.message}`);
        }
    },
    async markAsRead({ commit }, { notificationId, employeeId }) {
        try {
            await defaultInstance.put(`/notifications/read/${notificationId}`, { employeeId });
            commit('MARK_AS_READ', notificationId);
        } catch (error) {
            commit('SET_ERROR_MESSAGE', `알림을 읽음으로 표시하는 중 오류 발생: ${error.response ? error.response.status : error.message}`);
        }
    },
    startPolling({ dispatch }, employeeId) {
        const pollInterval = 60000; // 60초 간격으로 설정
        const intervalId = setInterval(() => {
            dispatch('fetchNotifications', employeeId);
        }, pollInterval);

        // 폴링 중지 함수 반환
        return () => clearInterval(intervalId);
    }
};

const getters = {
    unreadNotifications: state => state.notifications.filter(n => !n.read),
    errorMessage: state => state.errorMessage
};

export default {
    state,
    mutations,
    actions,
    getters
};
