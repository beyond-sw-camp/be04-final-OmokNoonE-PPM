import {createStore} from "vuex";
import notifications from "./notifications";
import projectMember from "./projectMember";
import login from "@/store/login";
import createPersistedState from "vuex-persistedstate";

export default createStore({
    modules: {
        login,
        notifications,
        projectMember,
    },
    state: {
        hideConfigButton: false,
        isPinned: true,
        showConfig: false,
        sidebarType: "bg-white",
        isRTL: false,
        color: "success",
        isNavFixed: false,
        isAbsolute: false,
        showNavs: true,
        showSidenav: true,
        showNavbar: true,
        showFooter: true,
        showMain: true,
        isDarkMode: false,
        navbarFixed:
            "position-sticky blur shadow-blur left-auto top-1 z-index-sticky px-0 mx-4",
        absolute: "position-absolute px-4 mx-0 w-100 z-index-2",
        isProjectModalOpen: false,
    },
    mutations: {
        toggleConfigurator(state) {
            state.showConfig = !state.showConfig;
        },
        navbarMinimize(state) {
            const sidenav_show = document.querySelector(".g-sidenav-show");

            if (sidenav_show.classList.contains("g-sidenav-pinned")) {
                sidenav_show.classList.remove("g-sidenav-pinned");
                state.isPinned = true;
            } else {
                sidenav_show.classList.add("g-sidenav-pinned");
                state.isPinned = false;
            }
        },
        navbarFixed(state) {
            if (state.isNavFixed === false) {
                state.isNavFixed = true;
            } else {
                state.isNavFixed = false;
            }
        },
        toggleEveryDisplay(state, data) {
            state.showNavbar = data;
            state.showSidenav = data;
            state.showFooter = data;
        },
        toggleHideConfig(state) {
            state.hideConfigButton = !state.hideConfigButton;
        },
        color(state, payload) {
            state.color = payload;
        },
        setIsProjectModalOpen(state, data) {
            state.isProjectModalOpen = data;
        }
    },
    actions: {
        setColor({commit}, payload) {
            commit("color", payload);
        },
        openProjectModal({commit}){
            commit("setIsProjectModalOpen", true)
        }
    },
    getters: {
        getIsProjectModalOpen(state) {
            return state.isProjectModalOpen;
        },
    },
    plugins: [createPersistedState({
        paths: ["login"],
    })],
});
