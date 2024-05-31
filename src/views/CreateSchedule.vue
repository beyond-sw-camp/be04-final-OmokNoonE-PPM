<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card my-4">
          <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div
                class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3 d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center ps-3">
                <div class="d-flex flex-column justify-content-center">
                  <h6 style="color: white !important;">일정 등록</h6>
                </div>
              </div>
<!--              <div class="modal-actions">-->
<!--                <MaterialButton color="info" size="md" variant="fill" style="margin-right: 1em;"-->
<!--                                @click="changeTab('details')">세부사항-->
<!--                </MaterialButton>-->
<!--                <MaterialButton color="info" size="md" variant="fill" style="margin-right: 1em;"-->
<!--                                @click="changeTab('requirement')">요구사항-->
<!--                </MaterialButton>-->
<!--              </div>-->
            </div>
          </div>
          <div class="card-body px-0 pb-2">
            <div v-show="currentTab === 'details'" class="left-align-content">
              <h5>&nbsp; 주 속성</h5>
              <hr class="modal-divider">
              <!--   일정 제목     -->
              <div class="modal-info">
                <div class="modal-info-item">
                  <p class="importance">* </p>
                  <span class="modal-info-label">일정 제목</span>
                  <MaterialInput v-model="schedule.title" label="일정 제목을 입력하세요."></MaterialInput>
                </div>
              </div>
              <!--   시작일, 종료일, 총 소요일  -->
              <div class="modal-info">
                <div class="modal-info-item">
                  <p class="importance">* </p>
                  <span class="modal-info-label">시작일</span>
                  <MaterialInput type="date" v-model="schedule.startDate"></MaterialInput>
                </div>
                <div class="modal-info-item">
                  <p class="importance">* </p>
                  <span class="modal-info-label">종료일</span>
                  <MaterialInput type="date" v-model="schedule.endDate"></MaterialInput>
                </div>
                <div class="modal-info-item">
                  <span class="modal-info-label">총 소요일</span>
                  <span class="modal-info-value">{{ calculateTotalDays(schedule.startDate, schedule.endDate) }}</span>
                </div>
              </div>
              <!--   가중치  -->
              <div class="modal-info">
                <div class="modal-info-item">
                  <span class="modal-info-label">가중치</span>
                  <MaterialInput id="weight" type="number" label="가중치를 입력하세요.(1 ~ 100)"
                                 v-model="schedule.priority"></MaterialInput>
                </div>
              </div>

              <!--   부모, 선행 일정  -->
              <div class="modal-info">
                <div class="modal-info-item">
                  <span class="modal-info-label">부모 일정</span>
                  <span class="modal-info-value">{{ schedule.parentTitle }}</span>
                  <material-button
                      @click="openSearchScheduleModal('parent')"
                  >검색
                  </material-button>
                </div>
                <div class="modal-info-item">
                  <span class="modal-info-label">선행 일정</span>
                  <span class="modal-info-value">{{ schedule.precedingTitle }}</span>
                  <material-button
                      @click="openSearchScheduleModal('preceding')"
                  >검색
                  </material-button>
                </div>
              </div>

              <!--   이해관계자      -->
              <!--              <h5>&nbsp; 이해관계자</h5>-->
              <!--              <hr class="modal-divider">-->
              <!--              &lt;!&ndash;   PM, PL   &ndash;&gt;-->
              <!--              <div class="modal-info">-->
              <!--                <div class="modal-info-item">-->
              <!--                  <span class="modal-info-label">PM</span>-->
              <!--                  <template v-for="(stakeholder, index) in stakeholders" :key="index">-->
              <!--                    <span v-if="stakeholder.roleName === 10601"-->
              <!--                          class="modal-info-value">{{ stakeholder.name }}({{ stakeholder.employeeId }})</span>-->
              <!--                  </template>-->
              <!--                </div>-->
              <!--                <div class="modal-info-item">-->
              <!--                  <span class="modal-info-label">PL</span>-->
              <!--                  <template v-for="(stakeholder, index) in stakeholders" :key="index">-->
              <!--                    <span v-if="stakeholder.roleName === 10602"-->
              <!--                          class="modal-info-value">{{ stakeholder.name }}({{ stakeholder.id }})</span>-->
              <!--                  </template>-->
              <!--                </div>-->
              <!--              </div>-->
              <!--              &lt;!&ndash;   담당자   &ndash;&gt;-->
              <!--              <div class="modal-info">-->
              <!--                <div class="modal-info-item">-->
              <!--                  <p class="modal-info-label">담당자</p>-->
              <!--                  <div class="modal-info-value">-->
              <!--                    <p class="modal-responsible">-->
              <!--                      <template v-for="(stakeholder, index) in stakeholders" :key="index">-->
              <!--                      <span v-if="stakeholder.type === 10402"-->
              <!--                            class="modal-info-value">-->
              <!--                        {{ stakeholder.name }} ({{ stakeholder.employeeId }})-->
              <!--                        <span v-if="index !== stakeholders.length - 1">,</span>-->
              <!--                      </span>-->
              <!--                      </template>-->
              <!--                    </p>-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--              </div>-->
              <!--              <div class="modal-actions">-->
              <!--                <MaterialButton class="custom-button" @click="editStakeholders">수정</MaterialButton>-->
              <!--              </div>-->

              <!--   일정 내용   -->
              <div class="modal-info-item">
                <h5 class="importance">*</h5>
                <h5>일정 내용</h5>
              </div>
              <hr class="modal-divider">
              <div class="modal-description-container">
                <div class="modal-description">
                  <textarea class="textarea-description custom-textarea" v-model="schedule.content" rows="8"></textarea>
                </div>
              </div>

              <!--  업무 목록   -->
              <!--              <h5>&nbsp; 업무 목록</h5>-->
              <!--              <hr class="modal-divider">-->
              <!--              <div class="modal-tasks-container">-->
              <!--                <table class="modal-sheet">-->
              <!--                  <thead>-->
              <!--                  <tr>-->
              <!--                    <th style="width: 80%">업무 제목</th>-->
              <!--                    <th style="width: 100px">수행 여부</th>-->
              <!--                  </tr>-->
              <!--                  </thead>-->
              <!--                  <tbody>-->
              <!--                  <tr v-for="(task, index) in tasks" :key="task.id">-->
              <!--                    <td v-if="tasks.length > 0" class="task-title">-->
              <!--                      <div style="width: 80%">-->
              <!--                        {{ task.title }}-->
              <!--                      </div>-->
              <!--                    </td>-->
              <!--                    <td v-if="tasks.length > 0" class="task-isCompleted">-->
              <!--                      <div style="width: 100px">-->
              <!--                        <input style="width: 13px" type="checkbox" disabled="true" v-model="task.isCompleted">-->
              <!--                        <label style="width: 42px">{{ task.isCompleted ? '완료' : '미완료' }}</label>-->
              <!--                      </div>-->
              <!--                    </td>-->
              <!--                    <td v-if="tasks.length > 0">-->
              <!--                      <MaterialButton style="width: 60px" class="delete-button" @click="deleteTask(index)">삭제-->
              <!--                      </MaterialButton>-->
              <!--                    </td>-->
              <!--                  </tr>-->
              <!--                  <tr>-->
              <!--                    <td class="task-title" style="width: 80%">-->
              <!--                      <MaterialInput type="text" label="새 업무명을 입력하세요." v-model="newTaskTitle"></MaterialInput>-->
              <!--                    </td>-->
              <!--                    <td class="task-isCompleted">-->
              <!--                      <div style="width: 100px">-->
              <!--                        <input style="width: 13px" type="checkbox" disabled="true">-->
              <!--                        <label style="width: 42px">미완료</label>-->
              <!--                      </div>-->
              <!--                    </td>-->
              <!--                    <td>-->
              <!--                      <MaterialButton class="custom-button" style="width: 60px" @click="addTask">추가</MaterialButton>-->
              <!--                    </td>-->
              <!--                  </tr>-->
              <!--                  </tbody>-->
              <!--                </table>-->
              <!--              </div>-->


            </div>

            <!--  요구사항 검색 및 선택 탭      -->
            <!--            <div v-show="currentTab === 'requirement'">-->
            <!--              &lt;!&ndash; 선택된 요구사항   &ndash;&gt;-->
            <!--              <h5>&nbsp;선택된 요구사항 </h5>-->
            <!--              <hr class="modal-divider">-->
            <!--              <div class="modal-tasks-container">-->
            <!--                <table class="modal-sheet">-->
            <!--                  <thead>-->
            <!--                  <tr>-->
            <!--                    <th style="width: 30%">요구사항명</th>-->
            <!--                    <th style="width: 50%">내용</th>-->
            <!--                    <th>-->
            <!--                      <div style="width: 60px">-->
            <!--                        자세히-->
            <!--                      </div>-->
            <!--                    </th>-->
            <!--                  </tr>-->
            <!--                  </thead>-->
            <!--                  <tbody>-->
            <!--                  <tr v-for="(requirement, index) in requirements" :key="index">-->
            <!--                    <td style="width: 50%">{{ requirement.requirementName }}</td>-->
            <!--                    <td style="width: 50%">{{ requirement.requirementContent.slice(0, 30) }}...</td>-->
            <!--                    <td>-->
            <!--                      <MaterialButton class="custom-button" style="width: 60px"-->
            <!--                                      @click="viewRequirement(requirement.requirementId)">link-->
            <!--                      </MaterialButton>-->
            <!--                    </td>-->
            <!--                    <td>-->
            <!--                      <MaterialButton class="delete-button" style="width: 60px"-->
            <!--                                      @click="deleteRequirement(requirements, index)">삭제-->
            <!--                      </MaterialButton>-->
            <!--                    </td>-->
            <!--                  </tr>-->
            <!--                  </tbody>-->
            <!--                </table>-->
            <!--              </div>-->

            <!--              <h5>요구사항 검색</h5>-->
            <!--              <div style="display: flex; align-items: flex-start;">-->
            <!--                <MaterialInput label="요구사항명을 입력하세요." type="text" v-model="requirementSearchValue"-->
            <!--                               @keyup.enter="searchRequirement"/>-->
            <!--                <MaterialButton class="custom-button" style="margin: 1em;" @click="searchRequirement">검색-->
            <!--                </MaterialButton>-->
            <!--              </div>-->
            <!--              <hr class="modal-divider">-->
            <!--              <table class="modal-sheet">-->
            <!--                <thead>-->
            <!--                <tr>-->
            <!--                  <th style="width: 30%">요구사항명</th>-->
            <!--                  <th style="width: 50%">내용</th>-->
            <!--                  <th>-->
            <!--                    <div style="-->
            <!--                    width: 60px">-->
            <!--                      자세히-->
            <!--                    </div>-->
            <!--                  </th>-->
            <!--                  <th>-->
            <!--                    <div style="width: 60px">-->
            <!--                      추가-->
            <!--                    </div>-->
            <!--                  </th>-->
            <!--                </tr>-->
            <!--                </thead>-->
            <!--                <tbody v-if="isRequirementSearchModal">-->
            <!--                <tr v-for="(requirement, index) in searchRequirements" :key="index">-->
            <!--                  <td style="width: 30%">{{ requirement.requirementName }}</td>-->
            <!--                  <td style="width: 50%">{{ requirement.requirementContent.slice(0, 30) }}...</td>-->
            <!--                  <td>-->
            <!--                    <MaterialButton class="custom-button" style="width: 60px"-->
            <!--                                    @click="viewRequirement(requirement.requirementId)">link-->
            <!--                    </MaterialButton>-->
            <!--                  </td>-->
            <!--                  <td>-->
            <!--                    <MaterialButton class="custom-button" style="width: 60px"-->
            <!--                                    @click="selectRequirement(requirement)">추가-->
            <!--                    </MaterialButton>-->
            <!--                  </td>-->
            <!--                </tr>-->
            <!--                </tbody>-->
            <!--                <tbody v-else>-->
            <!--                <tr v-for="(requirement, index) in requirementList" :key="index">-->
            <!--                  <td style="width: 50%">{{ requirement.requirementName }}</td>-->
            <!--                  <td style="width: 50%">{{ requirement.requirementContent.slice(0, 30) }}...</td>-->
            <!--                  <td>-->
            <!--                    <MaterialButton class="custom-button" style="width: 60px"-->
            <!--                                    @click="viewRequirement(requirement.requirementId)">link-->
            <!--                    </MaterialButton>-->
            <!--                  </td>-->
            <!--                  <td>-->
            <!--                    <MaterialButton class="custom-button" style="width: 60px"-->
            <!--                                    @click="selectRequirement(requirement)">추가-->
            <!--                    </MaterialButton>-->
            <!--                  </td>-->
            <!--                </tr>-->
            <!--                </tbody>-->
            <!--              </table>-->
            <!--              &lt;!&ndash; 페이징 처리 &ndash;&gt;-->
            <!--              <div>-->
            <!--                <button @click="previousPage">Previous</button>-->
            <!--                <span>Page {{ page }} of {{ totalPages }}</span>-->
            <!--                <button @click="nextPage">Next</button>-->
            <!--              </div>-->
            <!--            </div>-->

            <hr class="modal-divider">
            <div class="modal-actions">
              <p v-if="showInfoMessage" class="info-message">* 표시된 항목을 채워주세요. </p>
              <div>
                <MaterialButton class="custom-button" style="margin: 1em;" @click="checkValidation">일정 등록
                </MaterialButton>
              </div>
            </div>
          </div>
        </div>

        <!--  부모, 선행 일정 검색 모달  -->
                <div v-if="isSearchModal">
                  <!-- 검색 모달 창 -->
                  <div id="searchScheduleModal" class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">일정 검색</h5>
                        </div>
                        <div class="modal-body">
                          <MaterialInput
                              label="일정 제목을 입력하세요."
                              v-model="searchScheduleTitleValue"
                          >
                          </MaterialInput>
                          <MaterialButton @click="searchSchedule">검색</MaterialButton>
                        </div>
                        <table>
                          <thead>
                          <tr>
                            <th>ID</th>
                            <th>제목</th>
                            <th>내용</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(schedule, id) in searchSchedules" :key="id">
                            <td>{{ schedule.id }}</td>
                            <td>{{ schedule.title }}</td>
                            <td>{{ schedule.content }}</td>
                            <td>
                              <material-button variant="fill" color="info" @click="selectSchedule(schedule)">선택
                              </material-button>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                        <div class="modal-footer">
                          <material-button variant="fill" color="info" @click="closeSearchModal">닫기</material-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      </div>
    </div>
    <!--    <AddProjectMemberToScheduleModal-->
    <!--        v-if="isEditProjectMemberVisible"-->
    <!--        @close="isEditProjectMemberVisible = false" @add-members="addStakeholders">-->
    <!--    </AddProjectMemberToScheduleModal>-->
  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialInput from "@/components/MaterialInput.vue";
// import AddProjectMemberToScheduleModal from "@/views/components/AddProjectMemberToScheduleModal.vue";
import {defaultInstance} from "@/axios/axios-instance";
import router from "@/router";

export default {
  components: {
    // AddProjectMemberToScheduleModal,
    MaterialButton,
    MaterialInput,
  },
  data() {
    return {
      schedule: {
        title: '',
        content: '',
        startDate: '',
        endDate: '',
        priority: null,
        manHours: null,
        parentId: '',
        parentTitle: '',
        precedingId: '',
        precedingTitle: '',
      },
      stakeholders: [
        {
          // TODO. 등록하는 자의 정보로 변경해야함
          // name: store.getName(),
          name: '홍길동',
          // employeeId: store.getEmployeeId,
          employeeId: "EP001",
          id: null,
          type: 10401,    // 작성자
          roleName: 10601,  //PM
          // 값을 어디서(back? front?) 받아올지는 고민
          // projectMemberId: store.getProjectMemberId(),
          projectMemberId: 1,
        }
      ],
      searchSchedules: [
        {
          id: null,
          title: '',
          content: '',
          type: '',
        }
      ],
      requirements: [   // 일정에 등록할 요구사항

      ],
      requirementList: [    // 요구사항 목록
        {
          requirementId: null,
          requirementName: '',
          requirementContent: '',
        }
      ],
      searchRequirements: [ // 요구사항 검색 결과
        {
          requirementId: null,
          requirementName: '',
          requirementContent: '',
        }
      ],
      newStakeholders: [],
      tasks: [],
      newTaskTitle: '',
      currentTab: 'details',
      showInfoMessage: false,
      requirementSearchValue: '',
      isEditProjectMemberVisible: false,
      isSearchModal: false,
      searchScheduleType: '',
      searchScheduleTitleValue: '',
      size: 10,
      page: 1,
      totalPages: 0,
      isRequirementSearchModal: false,
      //
      // projectId: store.getters['project/getProjectId'],
      projectId: 1,
      scheduleId: null,
      /* TODO. backend 코드 완성 시, 삭제 */
      alwaysTrue: true,
    };
  },
  methods: {
    changeTab(tabName) {
      this.currentTab = tabName;
      // if (tabName === 'requirement') {
      //   this.getRequirements();
      // }
    },
    calculateTotalDays(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end - start;
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return dayDiff >= 0 ? dayDiff : '유효하지 않은 날짜';
    },
    // addTask() {
    //   if (this.newTaskTitle.trim() !== '') {
    //     this.tasks.push({title: this.newTaskTitle, isCompleted: false});
    //     this.newTaskTitle = '';
    //   }
    // },
    // deleteTask(index) {
    //   this.tasks.splice(index, 1);
    // },
    // async saveTask() {
    //   // 업무 저장 로직 구현
    //   try {
    //     /* 복수의 업무 저장 메소드 제작해야함 */
    //     const requestBody = this.tasks.map(task => ({
    //       taskTitle: task.title,
    //       taskScheduleId: this.scheduleId,
    //     }));
    //     const response = await defaultInstance.post('/tasks/creates', {
    //       taskList: requestBody,
    //     });
    //
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //
    //     /* 새로 저장한 스케쥴 아이디 리스트를 출력하는 메소드(확인용) */
    //
    //     return response.ok;
    //   } catch (error) {
    //     console.error('error :', error);
    //   }
    // },

    // viewRequirement(requirementId) {
    //   // 요구사항 자세히 보기 로직 구현
    //   console.log('requirementId :', requirementId);
    // },
    // deleteRequirement(requirements, index) {
    //   requirements.splice(index, 1);
    // },
    // async getRequirements() {
    //   // 요구사항 목록 조회 로직 구현
    //   try {
    //     const projectId = 1;
    //     const response = await defaultInstance.get(`/requirements/list/${projectId}/${this.page}/${this.size}`);
    //     const data = response.data.result.viewRequirementsByProjectIdByPage;
    //     console.log(data);
    //     this.requirementList = data.content.map(requirement => ({
    //       requirementId: requirement.requirementsId,
    //       requirementName: requirement.requirementsName,
    //       requirementContent: requirement.requirementsContent,
    //     }))
    //     console.log('requirementList :', this.requirementList);
    //
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    // async searchRequirement() {
    //   // 요구사항 검색 로직 구현
    //   try {
    //     if (this.requirementSearchValue === '') {
    //       this.isRequirementSearchModal = false;
    //       return;
    //     }
    //     const projectId = 1;
    //     console.log(`requirementSearchValue` + this.requirementSearchValue);
    //     const response = await defaultInstance.get(`/requirements/search/${projectId}/${this.requirementSearchValue}`);
    //     const data = response.data.result.searchRequirementsByName;
    //     console.log(data);
    //     this.searchRequirements = data.map(requirement => ({
    //       requirementId: requirement.requirementsId,
    //       requirementName: requirement.requirementsName,
    //       requirementContent: requirement.requirementsContent,
    //     }))
    //     this.isRequirementSearchModal = true;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    // selectRequirement(requirement) {
    //   // 요구사항 선택 로직 구현
    //   console.log('requirementId :', requirement.requirementId);
    //   this.requirements.push({
    //     requirementId: requirement.requirementId,
    //     requirementName: requirement.requirementName,
    //     requirementContent: requirement.requirementContent,
    //   });
    // },
    // async saveRequirement() {
    //   // 요구사항 저장 로직 구현
    //   try {
    //     const requestBody = this.requirements.map(requirement => ({
    //       scheduleRequirementMapScheduleId: this.scheduleId,
    //       scheduleRequirementMapRequirementId: requirement.requirementId,
    //     }));
    //     /* backend에서 복수개의 요구사항맵을 저장하는 메소드 구현해야함. */
    //     const response = await defaultInstance.post('scheduleRequirementsMaps/creates', {
    //       requirementList: requestBody,
    //     });
    //
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //
    //     /* 새로 저장한 일정요구사항맵 아이디 리스트를 출력하는 메소드(확인용) */
    //
    //     return response.ok;
    //   } catch (error) {
    //     console.error('error :', error);
    //   }
    // },

    // editStakeholders() {
    //   // 일정 이해관계자 수정 로직 구현
    //   this.isEditProjectMemberVisible = true;
    // },
    // addStakeholders(selectedMembers) {
    //   // 일정 이해관계자 추가 로직 구현
    //   this.newStakeholders = selectedMembers;
    //   console.log('newStakeholders : ', this.newStakeholders);
    //   console.log('selectedMembers : ', selectedMembers);
    //   this.newStakeholders.forEach(member => this.stakeholders.push(
    //       {
    //         employeeId: member.employeeId,
    //         id: null,
    //         name: member.name,
    //         projectMemberId: member.projectMemberId,
    //         roleName: member.roleName,
    //         type: 10402 // TODO. PA와 PL 모두 담당자로 기록됨(?) 확인 필요
    //       }
    //   ));
    //   /* TODO. stakeholders가 갱신된 후, 화면의 이해관계자 부분이 갱신된 데이터로 출력하게끔 구현해야함. */
    //   console.log('stakeholders : ', this.stakeholders);
    // },
    // async saveStakeholders() {
    //   // 이해관계자 저장 로직 구현
    //   try {
    //     const requestBody = this.stakeholders.map(stakeholder => ({
    //       stakeholdersType: stakeholder.type,
    //       stakeholdersScheduleId: this.scheduleId,
    //       stakeholdersProjectMemberId: stakeholder.projectMemberId,
    //     }));
    //     /* backend에서 복수개의 이해관계자를 저장하는 메소드 구현해야함. */
    //     const response = await defaultInstance.post('stakeholders/creates', {
    //       stakeholdersList: requestBody,
    //     });
    //
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //
    //     /* 새로 저장한 이해관계자 아이디 리스트를 출력하는 메소드(확인용) */
    //
    //     return response.ok;
    //   } catch (error) {
    //     console.error('error :', error);
    //   }
    // },
    // async savePermissions() {
    //   // 권한 저장 로직 구현
    //   try {
    //     const requestBody = this.stakeholders.map(stakeholder => ({
    //       permissionRoleName: stakeholder.roleName,
    //       permissionProjectMemberId: stakeholder.projectMemberId,
    //       permissionScheduleId: this.scheduleId,
    //     }));
    //     /* backend에서 복수개의 권한을 저장하는 메소드 구현해야함. */
    //     const response = await defaultInstance.post('permissions/creates', {
    //       permissionList: requestBody,
    //     });
    //
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //
    //     /* 새로 저장한 권한 아이디 리스트를 출력하는 메소드(확인용) */
    //
    //     return response.ok;
    //   } catch (error) {
    //     console.error('error :', error);
    //   }
    // },

    async saveSchedule() {
      // 업무 저장 로직 구현
      try {
        const response = await defaultInstance.post('schedules/create', {
          scheduleTitle: this.schedule.title,
          scheduleContent: this.schedule.content,
          scheduleStartDate: this.schedule.startDate,
          scheduleEndDate: this.schedule.endDate,
          scheduleDepth: 1, // TODO. null로 보내고 backend에서 실제 depth를 계산하는 기능 구현 필요
          schedulePriority: this.schedule.priority,
          scheduleParentScheduleId: this.schedule.parentId,
          schedulePrecedingScheduleId: this.schedule.precedingId,
          scheduleProjectId: this.projectId // Assuming this.schedule.projectId exists
        });

        if (!(response.status >= 200 && response.status < 300)) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.scheduleId = response.data.result.viewSchedule.scheduleId;
        console.log('생성된 scheduleId :', this.scheduleId);

        return true;
      } catch (error) {
        console.error('error :', error);
      }
    },

    checkValidation() {
      console.log('schedule: ', this.schedule);
      console.log('stakeholders: ', this.stakeholders);
      console.log('tasks: ', this.tasks);
      console.log('requirements: ', this.requirements);
      // 유효성 검사 로직 구현
      if (this.schedule.title.trim() === '' || this.schedule.startDate === '' || this.schedule.endDate === ''
          || this.schedule.content.trim() === '') {
        this.showInfoMessage = true;
      } else {
        this.showInfoMessage = false;
        this.saveAll();
      }
    },
    async saveAll() {
      /* TODO. backend 코드 완성 시, if문 삭제 */
      // const scheduleSaveResult =
          await this.saveSchedule();
      // const taskSaveResult = await this.saveTask();
      // const requirementSaveResult = await this.saveRequirement();
      // const stakeholdersSaveResult = await this.saveStakeholders();
      // const permissionsSaveResult = await this.savePermissions();

      // const message =
      //     '일정 등록에 ' + (scheduleSaveResult ? '성공했습니다.\n' : '실패했습니다.\n')
      //     // + '업무 등록에' + (taskSaveResult ? '성공했습니다.\n' : '실패했습니다.\n')
      //     // + '요구사항 등록에' + (requirementSaveResult ? '성공했습니다.\n' : '실패했습니다.\n')
      //     // + '이해관계자 등록에' + (stakeholdersSaveResult ? '성공했습니다.\n' : '실패했습니다.\n')
      //     // + '권한 등록에' + (permissionsSaveResult ? '성공했습니다.\n' : '실패했습니다.\n')
      // ;
      //
      // alert(message);
      // if (scheduleSaveResult
      //     // && taskSaveResult
      //     // && requirementSaveResult
      //     // && stakeholdersSaveResult
      //     // && permissionsSaveResult
      // ) {
        await router.push({name: 'Billing'});
      // }
    },
    openSearchScheduleModal(type) {
      this.isSearchModal = true;
      this.searchScheduleType = type;
    },

    // 부모 일정 검색
    async searchSchedule() {
      try {
        const response = await defaultInstance.get(`/schedules/search/${this.searchScheduleTitleValue}`);
        const data = response.data.result.searchScheduleByTitle;
        this.searchSchedules = data.map(schedule => ({
          id: schedule.scheduleId,
          title: schedule.scheduleTitle,
          content: schedule.scheduleContent,
          // type: this.searchScheduleType,
        }));
      } catch (error) {
        console.log(error);
      }
    },
    selectSchedule(schedule) {
      if (this.searchScheduleType === 'parent') {         // 부모 일정 선택
        this.schedule.parentId = schedule.id;
        this.schedule.parentTitle = schedule.title;
      } else if (this.searchScheduleType === 'preceding') { // 선행 일정 선택
        this.schedule.precedingId = schedule.id;
        this.schedule.precedingTitle = schedule.title;
      }

      this.closeSearchModal();
    },
    closeSearchModal() {
      // 일정 선택 후 검색 모달창 닫기
      this.isSearchModal = false;
      // 연관값 초기화
      this.searchScheduleType = '';
      this.searchScheduleTitleValue = '';
      this.searchSchedules = [];
    },
    // // 요구사항 페이징 처리
    // previousPage() {
    //   if (this.page > 1) {
    //     this.page--;
    //     this.getRequirements();
    //   }
    // },
    // nextPage() {
    //   if (this.page < this.totalPages) {
    //     this.page++;
    //     this.getRequirements();
    //   }
    // },
  },
};
</script>

<style scoped>
.container-fluid {
  padding: 0 1.5rem;
}

.card {
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 0;
}

.card-body.px-0.pb-2 {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.modal-divider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.left-align-content {
  text-align: left;
}

.modal-info {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.modal-info-item {
  flex: 1 1 30%;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-left: 10px;
  padding-right: 10px;
}

.modal-info-label {
  margin-right: 0.5rem;
  font-weight: bold;
  width: 100px;
}

.modal-info-value {
  flex: 1;
  font-weight: normal;
}

.modal-responsible {
  display: flex;
  flex-wrap: wrap;
}

.modal-description-container {
  margin-top: 1rem;
}

.modal-description {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.textarea-description {
  width: 100%;
  min-height: 100px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-tasks-container {
  margin-top: 1rem;
}

.importance {
  color: #e72222; /* 중요도 색상 설정 */
  font-size: 22px;
}

.modal-sheet {
  width: 100%;
  border-collapse: collapse;
}

.modal-sheet th,
.modal-sheet td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}

.modal-sheet th {
  background-color: #f9f9f9;
  font-weight: bold;
}

.custom-button {
  background: #4CAF50;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.custom-button:hover {
  background: #45a049;
}

.delete-button {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.delete-button:hover {
  background: #e70a0a;
}

.info-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

#searchScheduleModal {
  z-index: 11000;
}


.modal {
  background: rgba(0, 0, 0, 0.5); /* 모달 배경 반투명 처리 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-dialog {
  background: white;
  border-radius: 5px;
  padding: 20px;
  max-width: 800px;
  width: 70%;
  height: 70%; /* 모달의 높이를 고정 */
}

.modal-content {
  height: 100%; /* 고정 높이를 설정 */
}

.modal-body {
  height: 70%; /* 모달 본문의 높이를 설정 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 90%;
    height: 90%; /* 작은 화면에서 모달의 높이 조정 */
  }

  .modal-content {
    height: 100%; /* 고정 높이를 설정 */
  }

  .modal-body {
    height: 80%; /* 모달 본문의 높이를 설정 */
    overflow-y: auto; /* 세로 스크롤 활성화 */
  }

  .modal-footer {
    display: flex;
    flex-direction: column;
  }
}
</style>
