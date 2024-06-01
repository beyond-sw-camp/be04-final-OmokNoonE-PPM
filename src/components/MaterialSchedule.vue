<template>
  <div>
    <div class="modal" v-if="isOpen">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content" v-if="!loadingState">
        <span class="close" @click="closeModal">&times;</span>

        <!--  일정 제목    -->
        <div v-if="isScheduleEditing">
          <p class="importance">{{ isScheduleEditing ? '*' : '' }}</p>
          <input id="title" v-model="schedule.title"/>
        </div>
        <h2 v-else>
          {{ schedule.title }}
        </h2>

        <!-- 프로젝트 이름 -->
        <p class="modal-project-name">{{ schedule.projectName }}</p>

        <!--   탭     -->
        <div class="modal-actions">
          <button class="modal-action-button" @click="changeTab('details')">세부사항</button>
          <button class="modal-action-button" @click="changeTab('task')">업무</button>
          <button class="modal-action-button" @click="changeTab('stakeholders')">이해관계자</button>
          <button class="modal-action-button" @click="changeTab('requirement')">요구사항</button>
          <button class="modal-action-button" @click="changeTab('history')">수정내역</button>
        </div>

        <!-- 가로선 -->
        <hr class="modal-divider">

        <!-- 탭 내용 -->
        <div v-show="currentTab === 'details'">
          <!-- 생성 일시, 수정 일시 -->
          <div v-show="!isScheduleEditing" class="modal-info">
            <div class="modal-info-item">
              <span class="modal-info-label">생성 일시:</span>
              <span class="modal-info-value">{{ schedule.createdDate }}</span>
            </div>
            <div class="modal-info-item">
              <span class="modal-info-label">수정 일시:</span>
              <span class="modal-info-value">{{ schedule.modifiedDate }}</span>
            </div>
          </div>

          <!-- 시작일, 종료일, 공수 -->
          <div class="modal-info">
            <div class="modal-info-item">
              <p class="importance">{{ isScheduleEditing ? '*' : '' }}</p>
              <span class="modal-info-label">시작일:</span>
              <div v-if="isScheduleEditing">
                <MaterialInput id="startDate" type="date" v-model="schedule.startDate"></MaterialInput>
              </div>
              <span v-else class="modal-info-value">{{ schedule.startDate }}</span>
            </div>
            <div class="modal-info-item">
              <p class="importance">{{ isScheduleEditing ? '*' : '' }}</p>
              <span class="modal-info-label">종료일:</span>
              <div v-if="isScheduleEditing">
                <MaterialInput id="endDate" type="date" v-model="schedule.endDate"></MaterialInput>
              </div>
              <span v-else class="modal-info-value">{{ schedule.endDate }}</span>
            </div>
            <div class="modal-info-item">
              <div v-if="isScheduleEditing">
                <span class="modal-info-label">총 소요일:</span>
                <span class="modal-info-value">{{ calculateTotalDays(schedule.startDate, schedule.endDate) }}</span>
              </div>
              <div v-else>
                <span class="modal-info-label">공수:</span>
                <span class="modal-info-value">{{ schedule.manHours }}</span>
              </div>
            </div>
          </div>

          <!-- 가중치, 진행률, 상태 -->
          <div class="modal-info">
            <div class="modal-info-item">
              <span class="modal-info-label">가중치:</span>
              <div v-if="isScheduleEditing">
                <MaterialInput id="weight" type="number" label="가중치를 입력하세요."
                               v-model="schedule.priority"></MaterialInput>
              </div>
              <span v-else class="modal-info-value">{{ schedule.priority }}</span>
            </div>
            <div class="modal-info-item">
              <span class="modal-info-label">진행률:</span>
              <span v-if="isScheduleEditing">진행률은 완료된 업무 수에 따라 표기됩니다.</span>
              <span v-else class="modal-info-value">{{ schedule.progress }}%</span>
            </div>
            <div class="modal-info-item">
              <p class="importance">{{ isScheduleEditing ? '*' : '' }}</p>
              <span class="modal-info-label">상태:</span>
              <div v-if="isScheduleEditing">
                <select id="status" v-model="schedule.status">
                  <option v-for="status in statusItems" :key="status" :value="status">
                    {{
                      status == 10401 ? '준비' :
                          status == 10402 ? '진행' : '완료'
                    }}
                  </option>
                </select>
              </div>
              <span v-else class="modal-info-value">
                {{
                  schedule.status == 10401 ? '준비' :
                      schedule.status == 10402 ? '진행' : '완료'
                }}
              </span>
            </div>
          </div>

          <!-- 부모 일정, 선행 일정 -->
          <div class="modal-info">
            <div class="modal-info-item">
              <span class="modal-info-label">부모 일정:</span>
              <span class="modal-info-value">{{ schedule.parentTitle }}</span>
              <div v-if="isScheduleEditing">
                <MaterialButton @click="openSearchScheduleModal('parent')">검색</MaterialButton>
              </div>
            </div>
            <div class="modal-info-item">
              <span class="modal-info-label">선행 일정:</span>
              <span class="modal-info-value">{{ schedule.precedingTitle }}</span>
              <div v-if="isScheduleEditing">
                <MaterialButton @click="openSearchScheduleModal('preceding')">검색</MaterialButton>
              </div>
            </div>
          </div>

          <!-- 내용 -->
          <div class="modal-info-item">
            <h5 v-if="isScheduleEditing" class="importance">*</h5>
            <h5>일정 내용</h5>
          </div>
          <hr class="modal-divider">
          <div class="modal-description-container">
            <div class="modal-description">
              <textarea v-if="!isScheduleEditing" class="textarea-description" v-model="schedule.content"
                        disabled="{{ !isScheduleEditing }}"
                        rows="8"></textarea>
              <textarea v-if="isScheduleEditing" class="textarea-description" v-model="schedule.content"
                        rows="8"></textarea>
            </div>
          </div>

          <!-- 수정 사유 -->
          <div class="modal-info" v-if="isScheduleEditing">
            <div class="modal-info-item">
              <p class="importance">{{ isScheduleEditing ? '*' : '' }}</p>
              <p class="modal-info-label">수정 사유:</p>
              <MaterialInput type="text" label="수정 사유를 입력하세요." v-model="reason"></MaterialInput>
            </div>
          </div>

          <!-- 수정 -->
          <div class="modal-actions">
            <p v-if="showInfoMessage" class="info-message">* 표시된 항목을 채워주세요. </p>
            <MaterialButton v-if="!isScheduleEditing" class="modal-action-button" @click="isScheduleEditing = true">수정
            </MaterialButton>
            <div v-else>
              <MaterialButton class="modal-action-button" @click="saveScheduleChanges">저장</MaterialButton>
            </div>
          </div>
        </div>

        <div v-show="currentTab === 'task'">
          <!-- 업무 -->
          <div class="modal-tasks-container">
            <h5 class="modal-sheet-title">업무 목록</h5>
            <table class="modal-sheet">
              <thead>
              <tr>
                <th style="width: 80%">업무 제목</th>
                <th style="width: 100px">수행 여부</th>
              </tr>
              </thead>
              <tbody v-if="isTaskEditing">
              <tr v-for="(task, index) in tasks" :key="task.id">
                <td v-if="tasks.length > 0" class="task-title">
                  <div style="width: 80%">
                    {{ task.title }}
                  </div>
                </td>
                <td v-if="tasks.length > 0" class="task-isCompleted">
                  <div style="width: 100px">
                    <input style="width: 13px" type="checkbox" v-model="task.isCompleted">
                    <label style="width: 42px">{{ task.isCompleted ? '완료' : '미완료' }}</label>
                  </div>
                </td>
                <td v-if="tasks.length > 0">
                  <MaterialButton style="width: 60px" class="delete-button" @click="deleteTask(index)">삭제
                  </MaterialButton>
                </td>
              </tr>
              <tr>
                <td class="task-title" style="width: 80%">
                  <MaterialInput type="text" label="새 업무명을 입력하세요." v-model="newTaskTitle"></MaterialInput>
                </td>
                <td class="task-isCompleted">
                  <div style="width: 100px">
                    <input style="width: 13px" disabled="true" type="checkbox">
                    <label style="width: 42px">미완료</label>
                  </div>
                </td>
                <td>
                  <MaterialButton class="custom-button" style="width: 60px" @click="addTask">추가</MaterialButton>
                </td>
              </tr>
              </tbody>
              <tbody v-else-if="!isTaskEditing&tasks.length > 0">
              <tr v-for="task in tasks" :key="task.id">
                <td class="task-title">{{ task.title }}</td>
                <td class="task-isCompleted">
                  <input type="checkbox" :checked="task.isCompleted" disabled>
                  <label>{{ task.isCompleted ? '완료' : '미완료' }}</label>
                </td>
              </tr>
              </tbody>
              <tbody v-else>
              <tr>
                <td colspan="2">등록된 업무가 없습니다.</td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- 수정 -->
          <div class="modal-actions">
            <MaterialButton v-if="!isTaskEditing" class="modal-action-button" @click="isTaskEditing = true">수정
            </MaterialButton>
            <div v-else>
              <MaterialButton class="modal-action-button delete-button" @click="isTaskEditing = false">완료
              </MaterialButton>
            </div>
          </div>
        </div>

        <div v-show="currentTab === 'stakeholders'">
          <!--   작성자, 담당자    -->
          <div class="modal-info">
            <!-- 작성자 -->
            <div class="modal-info-item">
              <p class="modal-info-label">작성자:</p>
              <div class="modal-info-value">
                <p class="modal-responsible">
                  <template v-for="(stakeholder, index) in stakeholders" :key="index">
                  <span v-if="stakeholder.type === 10401" class="modal-info-value">
                      {{ stakeholder.name }} ({{ stakeholder.employeeId }})
                      <span v-if="index !== stakeholder.length - 1">,</span>
                    </span>
                  </template>
                </p>
              </div>
            </div>

            <!-- 담당자 -->
            <div class="modal-info-item">
              <p class="modal-info-label">담당자:</p>
              <div class="modal-info-value">
                <p class="modal-responsible">
                  <template v-for="(stakeholder, index) in stakeholders" :key="index">
                  <span v-if="stakeholder.type === 10402" class="modal-info-value">
                      {{ stakeholder.name }} ({{ stakeholder.employeeId }})
                      <span v-if="index !== stakeholder.length - 1">,</span>
                    </span>
                  </template>
                </p>
              </div>
            </div>
          </div>

          <!-- 수정 -->
          <div class="modal-actions">
            <MaterialButton v-if="!isStakeholdersEditing" class="modal-action-button"
                            @click="isStakeholdersEditing = true">수정
            </MaterialButton>
            <div v-else>
              <MaterialButton class="modal-action-button" @click="editStakeholders">검색</MaterialButton>
              <MaterialButton class="modal-action-button delete-button" @click="isStakeholdersEditing = false">완료
              </MaterialButton>
            </div>
          </div>
        </div>

        <div v-show="currentTab === 'requirement'">

          <!-- 요구사항 탭 내용 -->
          <h3>요구사항</h3>
          <table class="modal-sheet">
            <thead>
            <tr>
              <th style="width: 30%">요구사항명</th>
              <th style="width: 50%">내용</th>
              <th>
                <div style="width: 100px"> 자세히</div>
              </th>
            </tr>
            </thead>
            <tbody v-if="requirements.length > 0">
            <tr v-for="(requirement, index) in requirements" :key="index">
              <td style="width: 50%">{{ requirement.requirementName }}</td>
              <td style="width: 50%">
                {{ requirement.requirementContent ? requirement.requirementContent.slice(0, 30) : 'N/A' }}...
              </td>
              <td>
                <MaterialButton class="custom-button" style="width: 100px"
                                @click="viewRequirement(requirement.requirementId)">link
                </MaterialButton>
              </td>
              <td v-if="isScheduleRequirementsEditing">
                <MaterialButton class="delete-button" style="width: 100px"
                                @click="deleteRequirement(requirement.scheduleRequirementMapId, index)">삭제
                </MaterialButton>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
              <td colspan="3">등록된 요구사항이 존재하지 않습니다.</td>
            </tr>
            </tbody>
          </table>

          <!-- 수정 -->
          <div class="modal-actions">
            <MaterialButton v-if="!isScheduleRequirementsEditing" class="modal-action-button"
                            @click="isScheduleRequirementsEditing = true">수정
            </MaterialButton>
            <div v-else>
              <MaterialButton class="modal-action-button delete-button" @click="isScheduleRequirementsEditing = false">
                완료
              </MaterialButton>
            </div>
          </div>

          <div v-if="isScheduleRequirementsEditing">
            <br>
            <h5>요구사항 검색</h5>
            <div style="display: flex; align-items: flex-start;">
              <MaterialInput label="요구사항명을 입력하세요." type="text" v-model="requirementSearchValue"
                             @keyup.enter="searchRequirement"/>
              <MaterialButton class="modal-action-button" style="margin: 1em;" @click="searchRequirement">검색
              </MaterialButton>
            </div>
            <hr class="modal-divider">
            <table class="modal-sheet">
              <thead>
              <tr>
                <th style="width: 30%">요구사항명</th>
                <th style="width: 50%">내용</th>
                <th>
                  <div style="width: 100px"> 자세히</div>
                </th>
                <th>
                  <div style="width: 100px"> 추가</div>
                </th>
              </tr>
              </thead>

              <tbody v-if="isRequirementSearchModal">
              <tr v-for="(requirement, index) in searchRequirements" :key="index">
                <td style="width: 30%">{{ requirement.requirementName }}</td>
                <td style="width: 50%">{{ requirement.requirementContent.slice(0, 30) }}...</td>
                <td>
                  <MaterialButton class="custom-button" style="width: 100px"
                                  @click="viewRequirement(requirement.requirementId)">link
                  </MaterialButton>
                </td>
                <td>
                  <MaterialButton class="custom-button" style="width: 100px"
                                  @click="addRequirement(requirement)">추가
                  </MaterialButton>
                </td>
              </tr>
              </tbody>
              <tbody v-else>
              <tr v-for="(requirement, index) in requirementList" :key="index">
                <td style="width: 50%">{{ requirement.requirementName }}</td>
                <td style="width: 50%">{{ requirement.requirementContent.slice(0, 30) }}...</td>
                <td>
                  <MaterialButton class="custom-button" style="width: 100px"
                                  @click="viewRequirement(requirement.requirementId)">link
                  </MaterialButton>
                </td>
                <td>
                  <MaterialButton class="custom-button" style="width: 100px"
                                  @click="addRequirement(requirement)">추가
                  </MaterialButton>
                </td>
              </tr>
              </tbody>
            </table>
          </div>


        </div>

        <div v-show="currentTab === 'history'">
          <!-- 수정 내역 탭 내용 -->
          <h3>수정 내역</h3>
          <table class="modal-sheet">
            <thead>
            <tr>
              <th class="history-reason">수정 사유</th>
              <th class="history-name">수정자</th>
              <th class="history-employeeId">ID</th>
              <th class="history-modifiedDate">수정 일시</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(history, index) in history" :key="index">
              <td class="history-reason">{{ history.reason }}</td>
              <td class="history-name">{{ history.name }}</td>
              <td class="history-employeeId">{{ history.employeeId }}</td>
              <td class="history-modifiedDate">{{ history.modifiedDate }}</td>
            </tr>
            </tbody>
          </table>
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
                  <MaterialButton variant="fill" color="info" @click="selectSchedule(schedule)">선택
                  </MaterialButton>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="modal-footer">
              <MaterialButton variant="fill" color="info" @click="closeSearchModal">닫기</MaterialButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--  이해관계자 추가 모달  -->
    <AddProjectMemberToScheduleModal
        v-if="isEditProjectMemberVisible"
        @close="isEditProjectMemberVisible = false" @add-members="addStakeholders">
    </AddProjectMemberToScheduleModal>
  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import {defaultInstance} from "@/axios/axios-instance";
import MaterialInput from "@/components/MaterialInput.vue";
import AddProjectMemberToScheduleModal from "@/views/components/AddProjectMemberToScheduleModal.vue";

export default {
  components: {AddProjectMemberToScheduleModal, MaterialInput, MaterialButton},
  props: ['isOpen', 'modalUrl', 'requirementList'],
  data() {
    return {
      schedule: {
        id: null,
        title: '',
        content: '',
        startDate: '',
        endDate: '',
        priority: null,
        progress: null,
        status: null,
        manHours: null,
        parentId: '',
        parentTitle: '',
        precedingId: '',
        precedingTitle: '',
        createdDate: '',
        modifiedDate: '',
        projectName: '',
      },
      searchSchedules: [
        {
          id: null,
          title: '',
          content: '',
          type: '',
        }
      ],
      tasks: [
        // {
        //   id: null,
        //   title: '',
        //   isCompleted: false,
        // }
      ],
      stakeholders: [],
      newStakeholders: [],
      history: [
        // {
        //   id: null,
        //   name: '',
        //   employeeId: '',
        //   reason: '',
        //   modifiedDate: '',
        // }
      ],
      requirements: [],
      searchRequirements: [],
      projectMember: [],
      statusItems: [10401, 10402, 10403],
      isSearchModal: false,
      searchScheduleType: '',
      searchScheduleTitleValue: '',

      // 수정 상태값
      isScheduleEditing: false,
      isTaskEditing: false,
      isStakeholdersEditing: false,
      isScheduleRequirementsEditing: false,
      reason: '',     // 수정 사유
      newTaskTitle: '',
      newPermission: {name: '', id: '', role_name: ''},
      editingPermissionIndex: null,
      editingPermission: {name: '', id: '', role_name: ''},
      isPermissionEditing: false,
      isEditProjectMemberVisible: false,
      showInfoMessage: false,
      currentTab: 'details',  // 기본 탭을 'details'로 설정
      requirementSearchValue: '',
      scheduleId: null,
      isRequirementSearchModal: false,
      loadingState: true,
    };
  },
  watch: {
    async isOpen() {
      this.scheduleId = this.modalUrl.split('/').pop();
      await this.getScheduleData();
      await this.getTaskData();
      await this.getStakeholderData();
      await this.getScheduleHistoryData();
      await this.getScheduleRequirement()
      await this.initSettingValues();
    },
    tasks: {
      handler(tasks) {
        tasks.forEach((task, index) => {
          this.$watch(
              () => task.isCompleted,
              (newVal) => {
                this.updateTaskCompletion(index, newVal);
              }
          );
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initSettingValues() {
      this.loadingState = false;
      this.isScheduleEditing = false;
      this.isTaskEditing = false;
      this.isStakeholdersEditing = false;
      this.isScheduleRequirementsEditing = false;
    },
    closeModal() {
      this.currentTab = 'details';
      this.loadingState = true;
      this.$emit('close');
    },
    changeTab(tab) {
      this.currentTab = tab;
    },
    calculateTotalDays(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end - start;
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return dayDiff >= 0 ? dayDiff : '유효하지 않은 날짜';
    },
    openSearchScheduleModal(type) {
      this.isSearchModal = true;
      this.searchScheduleType = type;
    },
    async searchSchedule() {
      try {
        const response = await defaultInstance.get(`/schedules/search/${this.searchScheduleTitleValue}`);
        const data = response.data.result.searchScheduleByTitle;
        this.searchSchedules = data.map(schedule => ({
          id: schedule.scheduleId,
          title: schedule.scheduleTitle,
          content: schedule.scheduleContent,
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
    editStakeholders() {
      // 일정 이해관계자 수정 로직 구현
      this.isEditProjectMemberVisible = true;
    },
    addStakeholders(selectedMembers) {
      // 일정 이해관계자 추가 로직 구현
      this.newStakeholders = selectedMembers;
      console.log('newStakeholders : ', this.newStakeholders);
      console.log('selectedMembers : ', selectedMembers);
      this.newStakeholders.forEach(member => this.stakeholders.push(
          {
            employeeId: member.employeeId,
            id: null,
            name: member.name,
            projectMemberId: member.projectMemberId,
            roleName: member.roleName,
            type: 10402,    // 모두 담당자로 추가
          }
      ));
      /* TODO. stakeholders가 갱신된 후, 화면의 이해관계자 부분이 갱신된 데이터로 출력하게끔 구현해야함. */
      console.log('stakeholders : ', this.stakeholders);
    },
    async addTask() {
      // 업무 저장 로직 구현
      if (this.newTaskTitle) {
        try {
          const response = await defaultInstance.post('/tasks/create', {
            taskTitle: this.newTaskTitle,
            taskScheduleId: this.scheduleId,
          });
          if (!(response.status >= 200 && response.status < 300)) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          alert('업무가 정상적으로 추가되었습니다.');
          this.tasks.push({id: response.data.result.createTask.taskId, title: this.newTaskTitle, completed: false});
          this.newTaskTitle = '';
          return response.ok;
        } catch (error) {
          console.error('error :', error);
        }
      }
    },
    async updateTaskCompletion(index, isCompleted) {
      // Handle task completion update here...
      // You can make an HTTP request to your server with the updated task completion status.
      try {
        const response = await defaultInstance.put(`/tasks/modify`, {
          taskId: this.tasks[index].id,
          taskTitle: this.tasks[index].title,
          taskIsCompleted: isCompleted,
        });
        if (!(response.status >= 200 && response.status < 300)) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('업무 수행 여부가 ' + isCompleted + '로 정상적으로 수정되었습니다.');
        return response.ok;
      } catch (error) {
        console.error('error :', error);
      }
    },
    async deleteTask(index) {
      if (this.tasks[index].id !== null) {
        if (confirm('등록된 업무를 삭제하시겠습니까?')) {
          try {
            const response = await defaultInstance.delete(`/tasks/remove/${this.tasks[index].id}`);
            if (!(response.status >= 200 && response.status < 300)) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('업무가 정상적으로 삭제되었습니다.');
            this.tasks.splice(index, 1);
            return response.ok;
          } catch (error) {
            console.error('error :', error);
          }
        }
      }
    },
    async saveScheduleChanges() {
      if (!(
          this.schedule.title &&
          this.schedule.startDate &&
          this.schedule.endDate &&
          this.schedule.status &&
          this.schedule.content &&
          this.reason)) {
        this.showInfoMessage = true;
        setTimeout(() => {
          this.showInfoMessage = false;
        }, 2000);
      } else {
        try {
          const response = await defaultInstance.put(`/schedules/modify/${this.scheduleId}`, {
            scheduleId: this.scheduleId,
            scheduleTitle: this.schedule.title,
            scheduleContent: this.schedule.content,
            scheduleStartDate: this.schedule.startDate,
            scheduleEndDate: this.schedule.endDate,
            schedulePriority: this.schedule.priority,
            scheduleStatus: this.schedule.status,
            scheduleHistoryReason: this.reason,           // 일정 수정내역
            scheduleHistoryProjectMemberId: 1,  // TODO. 수정자 ID를 실제 사용자의 값으로 대체해야 함.
            scheduleParentScheduleId: this.schedule.parentId,       // TODO. backend 코드에 실제로 값을 받아줘야함.
            schedulePrecedingScheduleId: this.schedule.precedingId, // TODO. backend 코드에 실제로 값을 받아줘야함.
          });
          if (!(response.status >= 200 && response.status < 300)) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          alert('일정이 정상적으로 수정되었습니다.');
          /* 수정 사유 갱신 */
          this.history.push({
            reason: this.reason,
            name: '당신의 이름', // 수정자 이름을 실제 값으로 대체해야 합니다.
            employeeId: '당신의 ID', // 수정자 ID를 실제 값으로 대체해야 합니다.
            modifiedDate: new Date().toISOString().slice(0, -5) // 현재 시간을 ISO 형식의 문자열로 변환 (초의 소수점 아래 밀리초와 시간대 제외)
          });
          this.reason = '';
          this.isScheduleEditing = false;
          return response.ok;
        } catch (error) {
          console.error('error :', error);
        }
      }
    },
    viewRequirement(requirementId) {
      // 요구사항 자세히 보기 로직 구현
      console.log('requirementId :', requirementId);
    },
    async getScheduleRequirement() {
      try {
        const response = await defaultInstance.get(`/scheduleRequirementsMaps/view/${this.scheduleId}`);
        const data = response.data.result.viewScheduleRequirementsMap;

        data.forEach(item => {
          const matchingRequirement = this.requirementList.find(r => r.requirementId === item.scheduleRequirementMapRequirementId);

          this.requirements.push({
            scheduleRequirementMapId: item.scheduleRequirementMapId,
            requirementId: item.scheduleRequirementMapRequirementId,
            requirementName: matchingRequirement ? matchingRequirement.requirementName : '불러오기 오류 발생',
            requirementContent: matchingRequirement ? matchingRequirement.requirementContent : '불러오기 오류 발생',
          });
        });
        console.log('요구사항 리스트', this.requirements);
      } catch (error) {
        console.log(error);
      }
    },
    async deleteRequirement(scheduleRequirementMapId, index) {
      try {
        const response = await defaultInstance.delete(`/scheduleRequirementsMaps/remove/${scheduleRequirementMapId}`);
        if (!(response.status >= 200 && response.status < 300)) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert('요구사항이 정상적으로 삭제되었습니다.');
        this.requirements.splice(index, 1);
        return response.ok;
      } catch (error) {
        console.error('error :', error);
      }
    },
    async searchRequirement() {
      // 요구사항 검색 로직 구현
      try {
        if (this.requirementSearchValue === '') {
          this.isRequirementSearchModal = false;
          return;
        }
        const projectId = 1;
        console.log(`requirementSearchValue` + this.requirementSearchValue);
        const response = await defaultInstance.get(`/requirements/search/${projectId}/${this.requirementSearchValue}`);
        const data = response.data.result.searchRequirementsByName;
        console.log(data);
        this.searchRequirements = data.map(requirement => ({
          requirementId: requirement.requirementsId,
          requirementName: requirement.requirementsName,
          requirementContent: requirement.requirementsContent,
        }))
        this.isRequirementSearchModal = true;
      } catch (error) {
        console.log(error);
      }
    },
    async addRequirement(requirement) {
      console.log('requirementId :', requirement.requirementId);
      if (requirement) {
        try {
          const response = await defaultInstance.post('/scheduleRequirementsMaps/create', {
            scheduleRequirementMapScheduleId: this.scheduleId,
            scheduleRequirementMapRequirementId: requirement.requirementId,
          });
          const data = response.data.result.createScheduleRequirementsMap;
          if (!(response.status >= 200 && response.status < 300)) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          alert('요구사항이 정상적으로 추가되었습니다.');
          this.requirements.push({
            scheduleRequirementMapId: data.scheduleRequirementMapId,
            requirementId: requirement.requirementId,
            requirementName: requirement.requirementName,
            requirementContent: requirement.requirementContent
          });
          console.log('추가 후', this.requirements);
          return response.ok;
        } catch (error) {
          console.error('error :', error);
        }
      }
    },
    async getScheduleData() {
      await defaultInstance.get(`schedules/view/${this.scheduleId}`)
          .then(response => {
            const data = response.data.result.viewSchedule;
            this.schedule = {
              id: data.scheduleId,
              title: data.scheduleTitle,
              content: data.scheduleContent,
              startDate: data.scheduleStartDate.map(part => String(part).padStart(2, '0')).join('-'),
              endDate: data.scheduleEndDate.map(part => String(part).padStart(2, '0')).join('-'),
              priority: data.schedulePriority,
              progress: data.scheduleProgress,
              status: data.scheduleStatus,
              manHours: data.scheduleManHours,
              parentId: data.scheduleParentScheduleId,
              precedingId: data.schedulePrecedingScheduleId,
              createdDate: `${data.scheduleCreatedDate.slice(0, 3).map(part => String(part).padStart(2, '0')).join('-')}
                            ${data.scheduleCreatedDate.slice(3, 6).map(part => String(part).padStart(2, '0')).join(':')}`,
              modifiedDate: `${data.scheduleModifiedDate.slice(0, 3).map(part => String(part).padStart(2, '0')).join('-')}
                              ${data.scheduleModifiedDate.slice(3, 6).map(part => String(part).padStart(2, '0')).join(':')}`,
              projectName: data.scheduleProjectId, // projectName is not provided in the response data
            };
          })
          .catch(error => {
            console.error(error);
          });
    },
    async getTaskData() {
      await defaultInstance.get(`tasks/list/${this.scheduleId}`)
          .then(response => {
            const data = response.data.result.viewScheduleTask;
            console.log("getTaskData")
            console.log(data);
            this.tasks = data.map(task => ({
              id: task.taskId,
              title: task.taskTitle,
              isCompleted: task.taskIsCompleted,
            }));
          })
          .catch(error => {
            console.error(error);
          });
    },
    async getStakeholderData() {
      /* 전부 수정 해야될 수도 */
      await defaultInstance.get(`stakeholders/view/${this.scheduleId}`)
          .then(response => {
            console.log("getStakeholderData")
            const data = response.data.result.viewStakeholders;
            console.log(data)

            data.forEach(item => {
              this.stakeholders = item.map(stakeholder => ({
                id: stakeholder.stakeholdersId,
                type: stakeholder.stakeholdersType,
                roleName: 10603,     // TODO. Replace with actual value. Currently set to PA
                name: '아무개', // TODO. Replace with actual value.
                employeeId: 'EP???', // TODO. Replace with actual value.
              }));
            });

          })
          .catch(error => {
            console.error(error);
          });
    },
    async getScheduleHistoryData() {
      await defaultInstance.get(`scheduleHistories/view/${this.scheduleId}`)
          .then(response => {
            console.log("getScheduleHistoryData")
            const data = response.data.result.viewSchedule;
            console.log(data)
            this.history = data.map(item => ({
              id: item.scheduleHistoryId,
              name: item.scheduleHistoryName,
              employeeId: item.scheduleHistoryEmployeeId,
              reason: item.scheduleHistoryReason,
              modifiedDate: `${item.scheduleHistoryModifiedDate.slice(0, 3).map(part => String(part).padStart(2, '0')).join('-')} ${item.scheduleHistoryModifiedDate.slice(3, 6).map(part => String(part).padStart(2, '0')).join(':')}`,
            }));

          })
          .catch(error => {
            console.error(error);
          });
    },
  },
};
</script>

<style scoped>
.close {
  color: #aaa;
  cursor: pointer;
  font-size: 28px;
  font-weight: bold;
  position: absolute;
  right: 10px;
  top: 10px;
}

.custom-button {
  background: #4CAF50;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: background 0.3s;
}

.custom-button:hover {
  background: #45a049;
}

.delete-button {
  background: #e74c3c;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem 1rem;
}

.delete-button:hover {
  background: #e70a0a;
}

.importance {
  color: #e72222;
  font-size: 22px;
}

.info-message {
  animation: fadeOut 2s forwards;
  animation-delay: 1s;
  color: #e72222;
}

@media (max-width: 576px) {
  .modal-body {
    height: 80%;
    overflow-y: auto;
  }

  .modal-content {
    height: 100%;
  }

  .modal-dialog {
    height: 90%;
    width: 90%;
  }

  .modal-footer {
    display: flex;
    flex-direction: column;
  }
}

.modal {
  background: rgba(0, 0, 0, 0.5);
  display: block;
  height: 100%;
  justify-content: center;
  left: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10000;
}

.modal-action-button {
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.modal-action-button:hover {
  background-color: #45a049;
}

.modal-actions {
  bottom: 10px;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  right: 10px;
}

.modal-body {
  height: 70%;
  overflow-y: auto;
}

.modal-content {
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  height: 80%;
  left: 50%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  z-index: 11000;
}

.textarea-description {
  height: 100%; /* 높이를 부모 요소에 맞춤 */
  overflow-y: auto;
  white-space: pre-wrap;
}

.modal-description {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  padding: 10px;
  flex: 1;
  height: 100%;
}

.modal-description textarea {
  width: 100%;
  height: 100%;
}

.modal-description-container {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
  background-color: #d3e6ef;
  flex-direction: row;
}

.modal-dialog {
  background: white;
  border-radius: 5px;
  height: 70%;
  max-width: 800px;
  padding: 20px;
  width: 70%;
}

.modal-divider {
  margin-bottom: 20px;
  margin-top: 20px;
}

.modal-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.modal-info-item {
  align-items: center;
  display: flex;
  flex: 1 1 30%;
  margin-bottom: 1rem;
  padding-left: 10px;
  padding-right: 10px;
}

.modal-info-label {
  font-weight: bold;
  margin-right: 0.5rem;
  width: 100px;
}

.modal-info-value {
  flex: 1;
  font-weight: normal;
}

.modal-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
}

.modal-responsible {
  display: flex;
  flex-wrap: wrap;
}

.modal-sheet {
  border-collapse: collapse;
  width: 100%;
}

.modal-sheet button {
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  margin-bottom: 8px;
  margin-right: 8px;
  padding: 6px 16px;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.modal-sheet button.delete-button {
  background-color: #e72222;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  margin-bottom: 8px;
  margin-right: 8px;
  padding: 6px 16px;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.modal-sheet button.delete-button:hover {
  background-color: #e70a0a;
}

.modal-sheet button:hover {
  background-color: #45a049;
}

.modal-sheet li {
  margin-bottom: 10px;
}

.modal-sheet td,
.modal-sheet th {
  padding: 0.5rem;
}

.modal-sheet th {
  background-color: #f9f9f9;
  font-weight: bold;
}

.modal-sheet th:first-child,
.modal-sheet td:first-child {
  padding-left: 0;
}

.modal-sheet th:last-child,
.modal-sheet td:last-child {
  padding-right: 0;
}

.modal-sheet-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-tasks-container {
  background-color: #f5f5f5;
  border-radius: 10px;
  flex: 1;
  margin: 10px;
  padding: 20px;
}

.modal {
  backdrop-filter: blur(5px);
}

#searchScheduleModal {
  z-index: 11000;
}

#title {
  color: #344767;
  display: block;
  font-family: "Roboto Slab", sans-serif;
  font-size: 2.25rem;
  font-weight: 600;
  line-height: 1.3;
  margin-block-end: 0.83em;
  margin-block-start: 0.83em;
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.table {
  width: 100%;
}

.textarea-description {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 100px;
  padding: 0.5rem;
  width: 100%;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
