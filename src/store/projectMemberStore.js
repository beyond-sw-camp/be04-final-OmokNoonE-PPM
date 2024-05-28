import {createStore} from 'vuex';
import axios from 'axios';

export const store = createStore({
    state: {
        projectMembers: [], // 프로젝트 구성원 목록
        availableMembers: [], // 프로젝트에 추가되지 않은 회원 목록
        projectId: null, // 현재 프로젝트 ID
        projectMembersLoading: false,
        availableMembersLoading: false,
        searchQuery: '', // 검색어
        searchResults: [], // 검색 결과
    },
    mutations: {
        SET_PROJECT_MEMBERS(state, members) {
            state.projectMembers = members;
        },
        SET_AVAILABLE_MEMBERS(state, members) {
            state.availableMembers = members;
        },
        ADD_PROJECT_MEMBER(state, member) {
            state.projectMembers.push(member);
        },
        REMOVE_PROJECT_MEMBER(state, memberId) {
            const member = state.projectMembers.find((m) => m.id === memberId);
            if (member) {
                member.isDeleted = true;
            }
        },
        SET_PROJECT_ID(state, projectId) {
            state.projectId = projectId;
        },
        SET_PROJECT_MEMBERS_LOADING(state, loading) {
            state.projectMembersLoading = loading;
        },
        SET_AVAILABLE_MEMBERS_LOADING(state, loading) {
            state.availableMembersLoading = loading;
        },
        SET_SEARCH_QUERY(state, query) {
            state.searchQuery = query;
        },
        SET_SEARCH_RESULTS(state, results) {
            state.searchResults = results;
        },
    },
    actions: {
        async fetchProjectMembers({commit, state}) {
            commit('SET_PROJECT_MEMBERS_LOADING', true);
            try {
                const response = await axios.get(`/projectMembers/project-members?projectId=${state.projectId}`);
                commit('SET_PROJECT_MEMBERS', response.data);
            } catch (err) {
                console.error('프로젝트 구성원을 가져오는 중 오류 발생:', err);
                throw new Error('프로젝트 구성원을 가져오는 중 오류가 발생했습니다.');
            } finally {
                commit('SET_PROJECT_MEMBERS_LOADING', false);
            }
        },
        async fetchAvailableMembers({commit, state}, {query = ''} = {}) {
            commit('SET_AVAILABLE_MEMBERS_LOADING', true);
            commit('SET_SEARCH_QUERY', query);
            try {
                const response = await axios.get(`/projectMembers/available-members?projectId=${state.projectId}&query=${query}`);
                commit('SET_SEARCH_RESULTS', response.data);
            } catch (err) {
                console.error('구성원 목록을 가져오는 중 오류 발생:', err);
                throw new Error('구성원 목록을 가져오는 중 오류가 발생했습니다.');
            } finally {
                commit('SET_AVAILABLE_MEMBERS_LOADING', false);
            }
        },
        async addProjectMember({commit, state}, {memberId}) {
            try {
                const response = await axios.post('/projectMembers/project-members', {
                    employeeId: memberId,
                    projectId: state.projectId,
                });
                commit('ADD_PROJECT_MEMBER', response.data);
            } catch (err) {
                console.error('프로젝트 구성원을 추가하는 중 오류 발생:', err);
                throw new Error('프로젝트 구성원을 추가하는 중 오류가 발생했습니다.');
            }
        },
        async removeProjectMember({commit, state}, memberId) {
            try {
                await axios.put(`/projectMembers/project-members/${memberId}`, {
                    projectId: state.projectId,
                });
                commit('REMOVE_PROJECT_MEMBER', memberId);
            } catch (err) {
                console.error('프로젝트 구성원을 제외하는 중 오류 발생:', err);
                throw new Error('프로젝트 구성원을 제외하는 중 오류가 발생했습니다.');
            }
        },
    },
    getters: {
        filteredProjectMembers(state) {
            return state.projectMembers.filter((member) => !member.isDeleted);
        },
        searchResults(state) {
            return state.searchResults;
        },
    },
});
