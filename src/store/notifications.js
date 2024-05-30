import axios from 'axios';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';

const state = {
    notifications: [],
    fetchedNotifications: new Set(), // 불러온 알림 ID를 저장하는 Set
    errorMessage: null // 예외 메시지를 저장하는 상태
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
    async fetchNotifications({commit}, employeeId) {
        try {
            const response = await axios.get(`/api/notifications/recent/${employeeId}`);
            const notifications = response.data.getRecentNotifications;
            commit('SET_NOTIFICATIONS', notifications);
            notifications.forEach(notification => {
                commit('ADD_FETCHED_NOTIFICATION', notification.id);
            });
        } catch (error) {
            commit('SET_ERROR_MESSAGE', `알림을 가져오는 중 오류 발생: ${error.response ? error.response.status : error.message}`);
        }
    },
    async markAsRead({commit}, {notificationId, employeeId}) {
        try {
            await axios.put(`/api/notifications/read/${notificationId}`, {employeeId});
            commit('MARK_AS_READ', notificationId);
        } catch (error) {
            commit('SET_ERROR_MESSAGE', `알림을 읽음으로 표시하는 중 오류 발생: ${error.response ? error.response.status : error.message}`);
        }
    },
    connectWebSocket({commit}, employeeId) {
        const socket = new SockJS('/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/notifications/${employeeId}`, (message) => {
                const notification = JSON.parse(message.body);
                commit('ADD_NOTIFICATION', notification);
            });
        });
    }
};

const getters = {
    unreadNotifications: state => state.notifications.filter(n => !n.read),
    errorMessage: state => state.errorMessage // 에러 메시지 getter
};

export default {
    state,
    mutations,
    actions,
    getters
};
