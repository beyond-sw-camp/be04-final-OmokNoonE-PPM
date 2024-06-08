<script>
import {defineComponent, onMounted, watch} from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
// import {createEventId, /*INITIAL_EVENTS*/} from "@/event-utils";
import store from "@/store";
import {ref} from 'vue';
import {defaultInstance} from "@/axios/axios-instance";
import router from "@/router";
import MaterialSchedule from "@/components/MaterialSchedule.vue";


export default defineComponent({
  components: {
    MaterialSchedule,
    FullCalendar,
  },
  setup() {
    const projectId = store.getters.projectId;
    const schedules = ref([]);
    const requirementList = ref([]);
    const projectMembers = ref([]);

    const modalOpen = ref(false);
    const modalUrl = ref('');

    const copyRequirementList = ref([]);
    const copyProjectMembers = ref([]);
    const openModal = (url) => {
      console.log("openModal called with url: ", url); // 추가
      modalUrl.value = url;
      modalOpen.value = true;
    };

    onMounted(async () => {
      await getSchedules();
      await getProjectRequirements();
      await getProjectMembers();
    });

    const getSchedules = async () => {
      await defaultInstance.get(`schedules/list/${projectId}`)
          .then(response => {
            const schedulesData = response.data.result.viewScheduleByProject;
            schedules.value = schedulesData.map(schedule => {
              let color;
              switch (schedule.scheduleStatus) {
                case '10301':
                  color = '#ffba26';
                  break;
                case '10302':
                  color = '#24a8ef';
                  break;
                case '10303':
                  color = '#61cc39';
                  break;
                default:
                  color = 'gray';
              }
              return {
                id: schedule.scheduleId,
                title: schedule.scheduleTitle,
                start: new Date(...schedule.scheduleStartDate).toISOString().split('T')[0],
                end: new Date(...schedule.scheduleEndDate).toISOString().split('T')[0],
                backgroundColor: color,
                textColor: 'black',
                // 추가적인 사용자 정의 속성
                scheduleId: schedule.scheduleId,
              };
            });
            console.log(schedules.value);
          })
          .catch(error => {
            console.error(error);
          });
    }

    const getProjectRequirements = async () => {
      // 요구사항 목록 조회 로직 구현
      try {
        const response = await defaultInstance.get(`/requirements/list/${projectId}`);
        requirementList.value = response.data.result.viewRequirementsList.projectRequirementsList;
        for (let i = 0; i < requirementList.value.length; i++) {
          const requirementId = requirementList.value[i].requirementsId;
          const requirementName = requirementList.value[i].requirementsName;
          const requirementContent = requirementList.value[i].requirementsContent;

          copyRequirementList.value[i] = {
            requirementId: requirementId,
            requirementName: requirementName,
            requirementContent: requirementContent,
          };
        }

        console.log('requirementList :', requirementList);
        console.log('copyRequirementList :', copyRequirementList);
      } catch (error) {
        console.log(error);
      }
    };

    const getProjectMembers = async () => {
      try {
        /* 실질적인 API 주소 확인해야함. Controller 메소드 확인 */
        const response = await defaultInstance.get(`projectMembers/list/${projectId}`);
        projectMembers.value = response.data.result.viewProjectMembersByProject;
        for (let i = 0; i < projectMembers.value.length; i++) {
          const employeeName = projectMembers.value[i].employeeName;
          const projectMemberEmployeeId = projectMembers.value[i].projectMemberEmployeeId;      // TODO. projectId로 구성원 조회할때 같이 받아오도록 수정 요청
          const projectMemberId = projectMembers.value[i].projectMemberId;                      // TODO. projectId로 구성원 조회할때 같이 받아오도록 수정 요청
          const projectMemberRoleName = projectMembers.value[i].projectMemberRoleName;

          copyProjectMembers.value[i] = {
            name: employeeName,
            employeeId: projectMemberEmployeeId,
            projectMemberId: projectMemberId,
            roleName: projectMemberRoleName,
            isChecked: false, // 체크박스에 활용될 Value 추가
          };
        }
        console.log('copySchedule.value : ', copyProjectMembers.value);

      } catch (error) {
        console.error(error);
      }
    };

    return {schedules, openModal, modalOpen, modalUrl, copyRequirementList, copyProjectMembers};

  },
  data() {
    return {
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true, // weekends are always enabled
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      },
      currentEvents: [],
    }
  },
  // schedules가 변경될 때마다 calendarOptions의 events를 업데이트합니다.
  created() {
    watch(() => this.schedules, (newSchedules) => {
      this.calendarOptions.events = newSchedules;
    }, {immediate: true}); // immediate 옵션을 true로 설정하여 초기에 한 번 실행합니다.
  },

  methods: {
    handleDateSelect(selectInfo) {
      // let title = prompt('Please enter a new title for your event')
      // let calendarApi = selectInfo.view.calendar
      //
      // calendarApi.unselect() // clear date selection
      //
      // if (title) {
      //   calendarApi.addEvent({
      //     id: createEventId(),
      //     title,
      //     start: selectInfo.startStr,
      //     end: selectInfo.endStr,
      //     allDay: selectInfo.allDay
      //   })
      // }

      // 날짜 칸 클릭시 스케줄 생성 페이지로 이동
      const projectId = store.getters.projectId;
      const startDate = selectInfo.startStr;

      // 클릭한 날짜를 자동으로 startDate로 등록하는 기능을 위해 parameter로 startDate 추가
      router.push({name: 'CreateSchedule', params: {projectId: projectId}, query: {startDate: startDate}});

    },
    handleEventClick(clickInfo) {


      let scheduleId = clickInfo.event.extendedProps.scheduleId;
      this.openModal(`http://localhost/schedule/details/${scheduleId}`)

    },
    handleEvents(events) {
      this.currentEvents = events
    },
  }
})

</script>

<template>
  <div class='demo-app'>
    <div class='demo-app-main'>
      <FullCalendar
          class='demo-app-calendar'
          :options='calendarOptions'
      >
        <template v-slot:eventContent='arg'>
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
  </div>

  <MaterialSchedule :isOpen="modalOpen" :modalUrl="modalUrl"
                    :requirementList="copyRequirementList" :projectMembers="copyProjectMembers"
                    @close="modalOpen = false"></MaterialSchedule>


</template>

<style lang='css'>

h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b { /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc { /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}

</style>