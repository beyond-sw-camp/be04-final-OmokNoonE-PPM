import {defaultInstance} from "@/axios/axios-instance";

const state = {
    notifications: [],
    fetchedNotifications: new Set(),
    errorMessage: null,
};

const mutations = {
    SET_NOTIFICATIONS(state, notifications) {
        state.notifications = notifications;
    },
    MARK_AS_READ(state, notificationId) {
        const notification = state.notifications.find(
            (n) => n.notificationId === notificationId
        );
        if (notification) {
            notification.read = true;
        }
    },
    ADD_NOTIFICATION(state, notification) {
        if (!state.fetchedNotifications.has(notification.notificationId)) {
            state.notifications.push(notification);
            state.fetchedNotifications.add(notification.notificationId);
        }
    },
    ADD_FETCHED_NOTIFICATION(state, notificationId) {
        state.fetchedNotifications.add(notificationId);
    },
    SET_ERROR_MESSAGE(state, message) {
        state.errorMessage = message;
    },
};

const actions = {
    async fetchNotifications({commit}, employeeId) {
        console.log("로그 확인용: fetchNotifications - employeeId:", employeeId);
        try {
            const response = await defaultInstance.get(
                `/notifications/recent/${employeeId}`
            );
            const notifications = response.data.result.getRecentNotifications || [];
            notifications.forEach((notification) => {
                // Assuming notificationCreatedDate is [year, month, day, hour, minute]
                notification.notificationCreatedDate = new Date(
                    notification.notificationCreatedDate[0],
                    notification.notificationCreatedDate[1] - 1, // Month is 0-based in JS
                    notification.notificationCreatedDate[2],
                    notification.notificationCreatedDate[3],
                    notification.notificationCreatedDate[4]
                );
            });
            commit("SET_NOTIFICATIONS", notifications);
            notifications.forEach((notification) => {
                commit("ADD_FETCHED_NOTIFICATION", notification.notificationId);
            });
        } catch (error) {
            commit(
                "SET_ERROR_MESSAGE",
                `알림을 가져오는 중 오류 발생: ${
                    error.response ? error.response.status : error.message
                }`
            );
        }
    },
    async markAsRead({commit}, notificationId) {
        console.log("로그 확인용: markAsRead - notificationId:", notificationId);

        try {
            await defaultInstance.put(`/notifications/read/${notificationId}`);
            commit("MARK_AS_READ", notificationId);
        } catch (error) {
            commit(
                "SET_ERROR_MESSAGE",
                `알림을 읽음으로 표시하는 중 오류 발생: ${
                    error.response ? error.response.status : error.message
                }`
            );
        }
    },
    startPolling({dispatch}, employeeId) {
        const pollInterval = 60000; // 60초 간격으로 설정
        const intervalId = setInterval(() => {
            dispatch("fetchNotifications", employeeId);
        }, pollInterval);

        // 폴링 중지 함수 반환
        return () => clearInterval(intervalId);
    },
    resetNotification({commit}) {
        commit("SET_NOTIFICATIONS", []);
        commit("SET_ERROR_MESSAGE", null);
    }
};

const getters = {
    unreadNotifications: (state) => state.notifications.filter((n) => !n.read),
    errorMessage: (state) => state.errorMessage,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
