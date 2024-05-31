import {defaultInstance} from "@/axios/axios-instance";

const state = {
    projectMembers: [],
    availableMembers: [],
    projectId: null,
    projectMembersLoading: false,
    availableMembersLoading: false,
    searchQuery: '',
    searchResults: [],
};

const mutations = {
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
};

const actions = {
    async fetchProjectMembers({commit, state}) {
        commit('SET_PROJECT_MEMBERS_LOADING', true);
        try {
            const response = await defaultInstance.get(`/projectMembers/list/${state.projectId}`);
            commit('SET_PROJECT_MEMBERS', response.data.viewProjectMembersByProject);
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
            const response = await defaultInstance.get(
                                                    `/projectMembers/available/${state.projectId}?query=${query}`);
            commit('SET_SEARCH_RESULTS', response.data.viewAvailableMembers);
        } catch (err) {
            console.error('구성원 목록을 가져오는 중 오류 발생:', err);
            throw new Error('구성원 목록을 가져오는 중 오류가 발생했습니다.');
        } finally {
            commit('SET_AVAILABLE_MEMBERS_LOADING', false);
        }
    },
    async addProjectMember({commit, state}, {memberId}) {
        try {
            const response = await defaultInstance.post('/projectMembers/create', {
                projectMemberProjectId: state.projectId,
                projectMemberEmployeeId: memberId,
            });
            commit('ADD_PROJECT_MEMBER', response.data.createProjectMember);
        } catch (err) {
            console.error('프로젝트 구성원을 추가하는 중 오류 발생:', err);
            throw new Error('프로젝트 구성원을 추가하는 중 오류가 발생했습니다.');
        }
    },
    async removeProjectMember({commit}, {memberId, reason}) {
        try {
            await defaultInstance.delete(`/projectMembers/remove/${memberId}`, {
                data: {
                    projectMemberHistoryReason: reason
                }
            });
            commit('REMOVE_PROJECT_MEMBER', memberId);
        } catch (err) {
            console.error('프로젝트 구성원을 제외하는 중 오류 발생:', err);
            throw new Error('프로젝트 구성원을 제외하는 중 오류가 발생했습니다.');
        }
    },
};

const getters = {
    filteredProjectMembers(state) {
        return state.projectMembers.filter((member) => !member.isDeleted);
    },
    searchResults(state) {
        return state.searchResults;
    },
};

export default {
    state,
    mutations,
    actions,
    getters
};