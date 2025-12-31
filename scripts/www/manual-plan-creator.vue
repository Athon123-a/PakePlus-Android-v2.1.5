<template>
  <view class="plan-creator-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <button class="back-btn" @click="goBack">←</button>
      <h1 class="page-title">创建训练计划</h1>
      <button class="save-btn" @click="savePlan">保存</button>
    </view>

    <view class="content">
      <!-- 计划信息表单 -->
      <view class="form-section">
        <h2 class="section-title">计划信息</h2>
        <view class="form-group">
          <label class="form-label">计划名称 <span class="required">*</span></label>
          <input
            id="planName"
            type="text"
            class="form-input"
            v-model="plan.name"
            placeholder="例如：全身力量训练计划"
            maxlength="50"
            autocomplete="off"
            @input="handlePlanNameInput"
            @focus="handlePlanNameFocus"
          />
          <view class="error-message" :class="{ show: errors.name }">{{ errors.name || '请输入计划名称' }}</view>
        </view>

        <view class="form-row">
          <view class="form-group form-half">
            <label for="planDuration" class="form-label">预计时长（分钟）</label>
            <input
              id="planDuration"
              type="number"
              class="form-input"
              v-model.number="plan.duration"
              min="1"
              max="300"
              placeholder="预计训练时长"
            />
          </view>
          <view class="form-group form-half">
            <label for="planDifficulty" class="form-label">难度级别</label>
            <select id="planDifficulty" class="form-select" v-model="plan.difficulty">
              <option value="beginner">初级</option>
              <option value="intermediate" selected>中级</option>
              <option value="advanced">高级</option>
            </select>
          </view>
        </view>

        <view class="form-group">
          <label for="planNotes" class="form-label">计划备注</label>
          <textarea 
            id="planNotes"
            class="form-textarea" 
            v-model="plan.notes"
            placeholder="添加一些计划说明或提示..."
            maxlength="200"
          ></textarea>
        </view>
      </view>

      <!-- 训练动作列表 -->
      <view class="form-section">
        <h2 class="section-title">训练动作 <span id="exerciseCount">({{ exercises.length }})</span></h2>
        <view class="exercise-list">
          <view 
            v-for="(exercise, index) in exercises" 
            :key="exercise.id"
            class="exercise-item"
          >
            <view class="exercise-item-header">
              <view class="exercise-index">{{ index + 1 }}</view>
              <view class="exercise-controls">
                <button class="move-btn move-up" @click="moveExercise(index, -1)" :disabled="index === 0" title="上移">↑</button>
                <button class="move-btn move-down" @click="moveExercise(index, 1)" :disabled="index === exercises.length - 1" title="下移">↓</button>
                <button class="remove-btn" @click="removeExercise(index)">移除</button>
              </view>
            </view>
            <view class="exercise-fields">
              <view class="exercise-name-field form-group">
                <label class="form-label">动作名称 <span class="required">*</span></label>
                <view class="exercise-name-selector">
                  <view class="exercise-name-input-wrapper">
                <input
                  type="text"
                      class="form-input exercise-name"
                  v-model="exercise.name"
                      placeholder="例如：俯卧撑"
                      maxlength="30"
                      autocomplete="off"
                    />
                    <view class="exercise-name-actions">
                      <button type="button" class="exercise-name-btn" @click="toggleExerciseNameDropdown(index)">
                        <span>📋</span>
                      </button>
                      <button type="button" class="exercise-name-btn save-btn" @click="saveExerciseName(index)" title="保存为常用动作">
                        <span>💾</span>
                      </button>
                    </view>
                  </view>
                  <view class="exercise-name-dropdown" v-show="exercise.showDropdown">
                    <view class="exercise-name-search">
                      <input
                        type="text"
                        placeholder="搜索动作名称..."
                        class="exercise-name-search-input"
                        v-model="exercise.searchTerm"
                        autocomplete="off"
                      />
                    </view>
                    <view class="exercise-name-list">
                      <view class="exercise-name-category">常用动作</view>
                      <view class="exercise-name-common-list">
                        <view
                          v-for="name in getFilteredCommonExercises(index)"
                          :key="name"
                          class="exercise-name-item"
                          @click="selectExerciseName(index, name)"
                        >
                          <span class="exercise-name-item-name">{{ name }}</span>
                        </view>
                      </view>
                      <view class="exercise-name-category" style="margin-top: 8px;">我的动作</view>
                      <view class="exercise-name-custom-list">
                        <view
                          v-for="name in getFilteredCustomExercises(index)"
                          :key="name"
                          class="exercise-name-item"
                          @click="selectExerciseName(index, name)"
                        >
                          <span class="exercise-name-item-name">{{ name }}</span>
                          <button class="exercise-name-item-delete" @click="deleteExerciseName(name)" title="删除">×</button>
                        </view>
                        <view v-if="getFilteredCustomExercises(index).length === 0" class="exercise-name-empty">
                          {{ exercise.searchTerm ? '未找到匹配的动作' : '暂无自定义动作' }}
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="error-message exercise-name-error" :class="{ show: errors[`exercise_${index}_name`] }">
                  {{ errors[`exercise_${index}_name`] || '请输入动作名称' }}
                </view>
              </view>

              <view class="form-row">
                <view class="form-group">
                  <label class="form-label">组数</label>
                  <input
                    type="number"
                    class="form-input exercise-sets"
                    v-model.number="exercise.sets"
                    min="1"
                    max="10"
                    placeholder="3"
                  />
                </view>
                <view class="form-group">
                  <label class="form-label">次数/时长</label>
                  <input
                    type="text"
                    class="form-input exercise-reps"
                    v-model="exercise.reps"
                    placeholder="例如：10次或30秒"
                    maxlength="20"
                  />
                </view>
                <view class="form-group">
                  <label class="form-label">休息时间（秒）</label>
                  <input
                    type="number"
                    class="form-input exercise-rest"
                    v-model.number="exercise.restTime"
                    min="0"
                    max="300"
                    placeholder="60"
                  />
                </view>
              </view>

              <view class="exercise-notes-field form-group">
                <label class="form-label">动作提示或要点</label>
                <textarea
                  class="form-textarea exercise-notes"
                  v-model="exercise.notes"
                  placeholder="添加动作注意事项..."
                  maxlength="100"
                ></textarea>
              </view>
                </view>
                </view>
              </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="exercises.length === 0">
          <view class="empty-state-icon">🏋️</view>
          <view class="empty-state-text">暂无训练动作</view>
          <view class="empty-state-subtext">点击下方按钮添加训练动作</view>
            </view>

        <button class="add-exercise-btn" @click="addExercise">
          <span class="add-icon">+</span>
          <span>添加训练动作</span>
        </button>
          </view>
        </view>

    <!-- 加载动画 -->
    <view class="loading" v-show="isSaving">
      <view class="loading-spinner"></view>
      <view class="loading-text">保存中...</view>
    </view>

    <!-- 成功弹窗 -->
    <view class="modal" v-show="showSuccessModal">
      <view class="modal-content">
        <view class="modal-icon">✅</view>
        <h3 class="modal-title">保存成功！</h3>
        <p class="modal-message">训练计划已保存到您的日历中</p>
        <view class="modal-actions">
          <button class="modal-btn primary" @click="goToCalendar">查看日历</button>
          <button class="modal-btn secondary" @click="createNewPlan">创建新计划</button>
        </view>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <nav class="bottom-nav">
      <a href="home.html" class="nav-item">
        <div class="nav-icon">🏠</div>
        <div class="nav-label">首页</div>
      </a>
      <a href="calendar.html" class="nav-item">
        <div class="nav-icon">📅</div>
        <div class="nav-label">日历</div>
      </a>
      <a href="#" class="nav-item coming-soon" @click.prevent="showComingSoonAlert">
        <div class="nav-icon">👥</div>
        <div class="nav-label">社区</div>
      </a>
      <a href="profile.html" class="nav-item">
        <div class="nav-icon">👤</div>
        <div class="nav-label">我的</div>
      </a>
    </nav>
  </view>
</template>

<script>
import API from './js/api.js';

export default {
  name: 'ManualPlanCreator',
  data() {
    return {
      // 计划信息
      plan: {
        name: '',
        duration: null,
        difficulty: 'intermediate',
        notes: ''
      },
      
      // 训练动作列表
      exercises: [],
      
      // 错误信息
      errors: {},
      
      // 加载状态
      isSaving: false,
      
      // 成功弹窗
      showSuccessModal: false,

      // 常用计划名称列表（保留数据，但不再使用选择功能）
      commonPlanNames: [
        '练胸', '练肩', '练背', '练腿', '练手臂', '练核心', '练腹肌',
        '全身力量训练', '上肢力量训练', '下肢力量训练', '核心力量训练',
        '有氧训练', 'HIIT训练', '拉伸放松', '瑜伽训练',
        '胸肌增肌计划', '肩部塑形计划', '背部强化计划', '腿部力量计划',
        '手臂训练计划', '核心稳定计划', '减脂训练计划', '增肌训练计划',
        '力量提升计划', '耐力训练计划', '柔韧性训练', '康复训练计划',
        '30分钟训练', '45分钟训练', '60分钟训练', '快速训练',
        '晨练计划', '晚练计划', '周末训练', '每日训练'
      ],

      // 常用健身动作列表
      commonExercises: [
        '卧推', '哑铃飞鸟', '俯卧撑', '上斜卧推', '下斜卧推', '哑铃卧推', '杠铃卧推',
        '窄距俯卧撑', '宽距俯卧撑', '钻石俯卧撑', '上斜哑铃飞鸟', '下斜哑铃飞鸟',
        '引体向上', '硬拉', '杠铃划船', '哑铃划船', '坐姿划船', '高位下拉', '单臂划船',
        'T杠划船', '反向飞鸟', '面拉', '直臂下拉',
        '肩推', '哑铃肩推', '杠铃肩推', '侧平举', '前平举', '俯身侧平举', '哑铃飞鸟',
        '阿诺德推举', '反向飞鸟', '耸肩',
        '二头弯举', '哑铃弯举', '杠铃弯举', '锤式弯举', '三头下压', '三头臂屈伸',
        '窄距卧推', '过头臂屈伸', '绳索下压', '21响礼炮',
        '深蹲', '杠铃深蹲', '哑铃深蹲', '腿举', '腿屈伸', '腿弯举', '弓步蹲', '保加利亚分腿蹲',
        '罗马尼亚硬拉', '直腿硬拉', '提踵', '坐姿提踵',
        '平板支撑', '仰卧起坐', '卷腹', '俄罗斯转体', '悬垂举腿', '侧平板支撑',
        '死虫式', '鸟狗式', '登山者', 'V字起身', '腹肌撕裂者',
        '跑步', '快走', '慢跑', '跳绳', '开合跳', '波比跳', '高抬腿', '登山跑',
        '椭圆机', '动感单车', '划船机',
        '静态拉伸', '动态拉伸', '瑜伽', '普拉提', '泡沫轴放松'
      ]
    };
  },

  computed: {
  },

  mounted() {
    // 检查用户登录状态
    this.checkLoginStatus();

    // 初始化一个默认练习
    this.addExercise();

    // 添加全局点击事件监听
    document.addEventListener('click', this.handleGlobalClick);
  },

  beforeUnmount() {
    // 移除全局事件监听
    document.removeEventListener('click', this.handleGlobalClick);
  },
  
  methods: {
    // 处理计划名称输入
    handlePlanNameInput(e) {
      // 标准input的事件处理
      if (e && e.target && e.target.value !== undefined) {
        this.plan.name = e.target.value;
      } else if (e && typeof e === 'string') {
        this.plan.name = e;
      } else if (e && e.detail && e.detail.value !== undefined) {
        // 兼容uni-app格式
      this.plan.name = e.detail.value;
      }
      
      // 清除错误状态
      if (this.plan.name && this.plan.name.trim()) {
        if (this.errors.name) {
          delete this.errors.name;
        }
        this.$nextTick(() => {
          const planNameInput = document.getElementById('planName');
          if (planNameInput) {
            planNameInput.classList.remove('error');
          }
        });
      }
    },

    // 处理计划名称聚焦
    handlePlanNameFocus(e) {
      console.log('计划名称输入框聚焦:', e);
    },

    // 检查登录状态
    checkLoginStatus() {
      try {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('user_info');

        if (!token || !userInfo) {
          console.log('用户未登录，跳转到登录页面');
          setTimeout(() => {
            if (typeof uni !== 'undefined') {
              uni.redirectTo({
                url: '/frontend/index'
              });
            } else {
              window.location.href = '/frontend/index.html';
            }
          }, 1000);
        } else {
          console.log('用户已登录，可以使用创建计划功能');
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
      }
    },

    // 返回上一页
    goBack() {
      try {
        if (typeof uni !== 'undefined') {
          uni.navigateBack({
            fail: () => {
              uni.redirectTo({
                url: '/frontend/calendar'
              });
            }
          });
        } else {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = '/frontend/calendar.html';
          }
        }
      } catch (error) {
        console.error('导航失败:', error);
        if (typeof uni !== 'undefined') {
          uni.redirectTo({
            url: '/frontend/calendar'
          });
        } else {
          window.location.href = '/frontend/calendar.html';
        }
      }
    },

    // 添加新动作（与HTML逻辑一致）
    addExercise() {
      const newExercise = {
        id: Date.now().toString(),
        name: '',
        sets: 3,
        reps: '',
        restTime: 60,
        notes: '',
        showDropdown: false,
        searchTerm: ''
      };
      this.exercises.push(newExercise);
      
      // 滚动到新添加的动作并聚焦到动作名称输入框
      this.$nextTick(() => {
        const lastExercise = document.querySelector('.exercise-item:last-child');
        if (lastExercise) {
          lastExercise.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 聚焦到新添加的动作名称输入框
          const nameInput = lastExercise.querySelector('.exercise-name');
          if (nameInput) {
            setTimeout(() => {
              nameInput.focus();
            }, 300);
          }
        }
      });
    },
    
    // 移除动作
    removeExercise(index) {
      try {
        if (typeof uni !== 'undefined') {
          uni.showModal({
            title: '确认删除',
            content: '确定要删除这个训练动作吗？',
            success: (res) => {
              if (res.confirm) {
                this.exercises.splice(index, 1);
                this.clearExerciseErrors(index);
              }
            }
          });
        } else {
          if (confirm('确定要删除这个训练动作吗？')) {
            this.exercises.splice(index, 1);
            this.clearExerciseErrors(index);
          }
        }
      } catch (error) {
        console.error('删除动作失败:', error);
        this.exercises.splice(index, 1);
        this.clearExerciseErrors(index);
      }
    },
    
    // 移动动作位置
    moveExercise(index, direction) {
      const newIndex = index + direction;
      if (newIndex >= 0 && newIndex < this.exercises.length) {
        const temp = this.exercises[index];
        this.exercises[index] = this.exercises[newIndex];
        this.exercises[newIndex] = temp;
        
        this.clearExerciseErrors(index);
        this.clearExerciseErrors(newIndex);
      }
    },
    
    // 清除动作相关的错误信息
    clearExerciseErrors(index) {
      Object.keys(this.errors).forEach(key => {
        if (key.startsWith(`exercise_${index}_`)) {
          delete this.errors[key];
        }
      });
    },
    
    // 验证表单（与HTML逻辑完全一致）
    validateForm() {
      this.errors = {};
      let isValid = true;
      
      // 验证计划名称
      const planName = this.plan.name.trim();
      if (!planName) {
        this.errors.name = '请输入计划名称';
        isValid = false;
        // 添加错误样式
        this.$nextTick(() => {
          const planNameInput = document.getElementById('planName');
          if (planNameInput) {
            planNameInput.classList.add('error');
          }
        });
      } else {
        // 清除错误
        if (this.errors.name) {
          delete this.errors.name;
        }
        this.$nextTick(() => {
          const planNameInput = document.getElementById('planName');
          if (planNameInput) {
            planNameInput.classList.remove('error');
          }
        });
      }
      
      // 验证动作列表
      if (this.exercises.length === 0) {
        this.showToast('请至少添加一个训练动作', 'error');
        isValid = false;
      } else {
        for (let i = 0; i < this.exercises.length; i++) {
          const exercise = this.exercises[i];
          const exerciseName = exercise.name.trim();
          
          // 验证动作名称
          if (!exerciseName) {
            this.errors[`exercise_${i}_name`] = '请输入动作名称';
            isValid = false;
            // 添加错误样式
            this.$nextTick(() => {
              const exerciseItem = document.querySelectorAll('.exercise-item')[i];
              if (exerciseItem) {
                const nameInput = exerciseItem.querySelector('.exercise-name');
                if (nameInput) {
                  nameInput.classList.add('error');
                }
              }
            });
          } else {
            // 清除错误
            if (this.errors[`exercise_${i}_name`]) {
              delete this.errors[`exercise_${i}_name`];
            }
            this.$nextTick(() => {
              const exerciseItem = document.querySelectorAll('.exercise-item')[i];
              if (exerciseItem) {
                const nameInput = exerciseItem.querySelector('.exercise-name');
                if (nameInput) {
                  nameInput.classList.remove('error');
                }
              }
            });
          }
          
          // 验证次数/时长
          const exerciseReps = exercise.reps ? exercise.reps.trim() : '';
          if (!exerciseReps) {
            this.showToast(`请输入第${i + 1}个动作的次数或时长`, 'error');
            isValid = false;
            // 滚动到错误位置
            this.$nextTick(() => {
              const errorInput = document.querySelector(`.exercise-item:nth-child(${i + 1}) .exercise-reps`);
              if (errorInput) {
                errorInput.focus();
                errorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            });
            break; // 找到第一个错误就停止
          }
        }
      }

      // 如果有错误，滚动到第一个错误
      if (!isValid) {
        this.$nextTick(() => {
          const firstError = document.querySelector('.form-input.error, .exercise-name.error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
          }
        });
      }
      
      return isValid;
    },
    
    // 收集表单数据（与HTML逻辑完全一致）
    collectFormData() {
      const exercises = this.exercises.map((ex, index) => ({
        name: ex.name.trim(),
        sets: parseInt(ex.sets) || 3,
        reps: ex.reps ? ex.reps.trim() : '',
        rest: parseInt(ex.restTime) || 60,
        notes: ex.notes ? ex.notes.trim() : '',
        order: index + 1
      }));

      return {
        name: this.plan.name.trim(),
        duration: parseInt(this.plan.duration) || null,
        difficulty: this.plan.difficulty || 'intermediate',
        notes: this.plan.notes ? this.plan.notes.trim() : '',
        exercises: exercises,
        created_at: new Date().toISOString()
      };
    },

    // 保存计划（与HTML逻辑完全一致）
    async savePlan() {
      if (!this.validateForm()) {
        return;
      }

      this.isSaving = true;

      try {
        // 收集数据
        const planData = this.collectFormData();
        console.log('保存的计划数据:', planData);
        
        // 转换数据格式以匹配API（与HTML完全一致）
        const apiData = {
          name: planData.name,
          duration: parseInt(planData.duration) || 30,
          difficulty: planData.difficulty || 'intermediate',
          notes: planData.notes || '',
          exercises: planData.exercises.map(ex => ({
            name: ex.name,
            sets: parseInt(ex.sets) || 3,
            reps: ex.reps,
            rest: parseInt(ex.rest) || 60,
            notes: ex.notes || ''
          }))
        };

        const response = await API.createPlan(apiData);

        if (response.code === 200) {
          // 获取要添加的日期（从URL参数或使用今天）
          let dateStr;
          try {
            // 在uni-app中获取URL参数
            let urlParams;
            if (typeof uni !== 'undefined') {
              const pages = getCurrentPages();
              const currentPage = pages[pages.length - 1];
              if (currentPage && currentPage.options && currentPage.options.date) {
                dateStr = currentPage.options.date;
              }
      } else {
              urlParams = new URLSearchParams(window.location.search);
              const dateParam = urlParams.get('date');
              if (dateParam) {
                dateStr = dateParam;
              }
            }

            if (!dateStr) {
              // 如果没有指定日期，使用今天
              const today = new Date();
              dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            }

            try {
              await API.addPlanToCalendar(response.data.planId, dateStr, null, 'none');
              console.log('计划已自动添加到日历:', dateStr);
            } catch (calendarError) {
              console.error('添加到日历失败:', calendarError);
              // 即使添加到日历失败，也显示成功，因为计划已经创建
            }
          } catch (dateError) {
            console.error('处理日期参数失败:', dateError);
          }

          this.isSaving = false;
          // 显示成功弹窗
          this.showSuccessModal = true;
        } else {
          this.isSaving = false;
          this.showToast(response.message || '保存失败，请稍后重试', 'error');
        }
      } catch (error) {
        this.isSaving = false;
        console.error('保存计划失败:', error);
        this.showToast(error.message || '保存失败，请稍后重试', 'error');
      }
    },
    
    // 跳转到日历页面
    goToCalendar() {
      try {
        if (typeof uni !== 'undefined') {
          uni.navigateTo({ url: '/frontend/calendar' });
        } else {
          window.location.href = '/frontend/calendar.html';
        }
      } catch (error) {
        console.error('导航失败:', error);
        window.location.href = '/frontend/calendar.html';
      }
    },
    
    // 创建新计划
    createNewPlan() {
      this.showSuccessModal = false;
      this.resetForm();
    },
    
    // 重置表单
    resetForm() {
      this.plan = {
        name: '',
        duration: null,
        difficulty: 'intermediate',
        notes: ''
      };
      this.exercises = [];
      this.errors = {};
      this.addExercise();
    },

    // 显示提示消息
    showToast(message, type = 'default') {
      try {
        if (typeof uni !== 'undefined') {
          uni.showToast({
            title: message,
            icon: type === 'error' ? 'none' : 'success',
            duration: 2000
          });
        } else {
          alert(message);
        }
      } catch (error) {
        console.error('显示消息失败:', error);
        alert(message);
      }
    },


    // 动作名称相关方法
    toggleExerciseNameDropdown(index) {
      this.exercises[index].showDropdown = !this.exercises[index].showDropdown;
    },

    getFilteredCommonExercises(index) {
      const exercise = this.exercises[index];
      if (!exercise.searchTerm) return this.commonExercises;
      return this.commonExercises.filter(name =>
        name.toLowerCase().includes(exercise.searchTerm.toLowerCase())
      );
    },

    getFilteredCustomExercises(index) {
      const exercise = this.exercises[index];
      const customExercises = this.getCustomExercises();
      if (!exercise.searchTerm) return customExercises;
      return customExercises.filter(name =>
        name.toLowerCase().includes(exercise.searchTerm.toLowerCase())
      );
    },

    selectExerciseName(index, name, event) {
      // 如果点击的是删除按钮，不处理
      if (event && event.target && event.target.closest('.exercise-name-item-delete')) {
        return;
      }
      this.exercises[index].name = name;
      this.exercises[index].showDropdown = false;
    },

    saveExerciseName(index) {
      const exerciseName = this.exercises[index].name.trim();
      if (!exerciseName) {
        this.showToast('请输入动作名称', 'error');
        return;
      }

      if (this.commonExercises.includes(exerciseName)) {
        this.showToast('该动作已在常用列表中', 'error');
        return;
      }

      const customExercises = this.getCustomExercises();
      if (customExercises.includes(exerciseName)) {
        this.showToast('该动作已保存', 'error');
        return;
      }

      if (this.saveCustomExercise(exerciseName)) {
        this.showToast('已保存为常用动作', 'success');
        this.exercises[index].showDropdown = false;
      } else {
        this.showToast('保存失败', 'error');
      }
    },

    deleteExerciseName(name, event) {
      // 阻止事件冒泡
      if (event && event.stopPropagation) {
        event.stopPropagation();
      }
      
      if (!confirm(`确定要删除"${name}"吗？`)) {
        return;
      }

      if (this.deleteCustomExercise(name)) {
        this.showToast('已删除', 'success');
      } else {
        this.showToast('删除失败', 'error');
      }
    },

    // 全局点击事件处理
    handleGlobalClick(event) {
      // 如果点击的是输入框、文本域或选择框，不处理
      const target = event.target;
      if (!target) return;
      
      const tagName = target.tagName;
      if (tagName === 'INPUT' || 
          tagName === 'TEXTAREA' || 
          tagName === 'SELECT') {
        return;
      }
      
      // 检查是否点击在输入框内部
      if (target.closest && (
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('select'))) {
        return;
      }
      
      // 点击外部时关闭下拉菜单
      if (target.closest && !target.closest('.exercise-name-selector')) {
        this.exercises.forEach(exercise => {
          exercise.showDropdown = false;
        });
      }
    },

    // 底部导航相关
    showComingSoonAlert() {
      this.showToast('社区功能即将上线，敬请期待！', 'default');
    },

    // 本地存储辅助方法（仅用于动作名称）

    getCustomExercises() {
      try {
        const saved = localStorage.getItem('customExercises');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    },

    saveCustomExercise(exerciseName) {
      if (!exerciseName || !exerciseName.trim()) return false;

      const customExercises = this.getCustomExercises();
      const trimmedName = exerciseName.trim();

      if (customExercises.includes(trimmedName)) {
        return false;
      }

      if (this.commonExercises.includes(trimmedName)) {
        return false;
      }

      customExercises.push(trimmedName);
      try {
        localStorage.setItem('customExercises', JSON.stringify(customExercises));
        return true;
      } catch (e) {
        console.error('保存失败:', e);
        return false;
      }
    },

    deleteCustomExercise(exerciseName) {
      const customExercises = this.getCustomExercises();
      const index = customExercises.indexOf(exerciseName);
      if (index > -1) {
        customExercises.splice(index, 1);
        try {
          localStorage.setItem('customExercises', JSON.stringify(customExercises));
          return true;
        } catch (e) {
          console.error('删除失败:', e);
          return false;
        }
      }
      return false;
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.plan-creator-container {
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
  min-height: 100vh;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'HarmonyOS Sans', sans-serif;
  overflow-x: hidden;
  position: relative;
}

.plan-creator-container input,
.plan-creator-container textarea,
.plan-creator-container select {
  -webkit-user-select: text;
  user-select: text;
  -webkit-tap-highlight-color: transparent;
}

/* 顶部导航栏 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 24px;
  position: sticky;
  top: 0;
  background: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  flex: 1;
  text-align: center;
}

.save-btn {
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #121212;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(204, 255, 0, 0.3);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 主容器 */
.content {
  padding: 0 20px 40px;
  max-width: 800px;
  margin: 0 auto;
}

/* 表单部分 */
.form-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.form-section:hover {
  border-color: rgba(0, 209, 255, 0.2);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 18px;
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  border-radius: 2px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.form-group input,
.form-group textarea,
.form-group select {
  position: relative;
  z-index: 100;
  pointer-events: auto !important;
  -webkit-user-select: text !important;
  user-select: text !important;
  -webkit-tap-highlight-color: transparent;
}

/* 输入框包装器（已不再使用，保留以防需要） */
.input-wrapper {
  position: relative;
  width: 100%;
  z-index: 100;
}

/* 确保所有输入框都可以被点击 */
input[type="text"],
input[type="number"],
textarea,
select {
  pointer-events: auto !important;
  z-index: 100 !important;
  position: relative !important;
  -webkit-user-select: text !important;
  user-select: text !important;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}

.form-label .required {
  color: #ff4d4f;
  margin-left: 4px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 100;
  cursor: text;
  pointer-events: auto !important;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  -webkit-user-select: text;
  user-select: text;
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #00D1FF;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(0, 209, 255, 0.1);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-input.error {
  border-color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.exercise-name.error {
  border-color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

/* uni-input全局样式（已不再使用，可删除） */

.form-select {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
}

.form-select:focus {
  outline: none;
  border-color: #00D1FF;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(0, 209, 255, 0.1);
}

.form-select option {
  background: #1a1a2e;
  color: #fff;
}

/* 文本域 */
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 100;
  cursor: text;
  pointer-events: auto !important;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  -webkit-user-select: text;
  user-select: text;
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #00D1FF;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(0, 209, 255, 0.1);
}

.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* 表单行 */
.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.form-half {
  flex: 1;
  margin-bottom: 0;
}

/* 错误提示 */
.error-message {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
  display: none;
}

.error-message.show {
  display: block;
}

/* 动作列表 */
.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.exercise-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.exercise-item:hover {
  border-color: rgba(0, 209, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}

.exercise-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.exercise-index {
  font-size: 14px;
  font-weight: 600;
  color: #00D1FF;
  background: rgba(0, 209, 255, 0.1);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exercise-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.move-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.move-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: #00D1FF;
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.remove-btn {
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.3);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #ff4d4f;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: rgba(255, 77, 79, 0.2);
  border-color: #ff4d4f;
  transform: scale(1.05);
}

/* 动作字段 */
.exercise-fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.exercise-name-field {
  grid-column: span 3;
  position: relative;
}

.exercise-notes-field {
  grid-column: span 3;
}

/* 动作名称选择器 */
.exercise-name-selector {
  position: relative;
  z-index: 1;
}

.exercise-name-selector .form-input {
  z-index: 100;
  pointer-events: auto !important;
}

.exercise-name-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  /* pointer-events: none; 已删除 */
}

.exercise-name-input-wrapper .form-input {
  flex: 1;
  padding-right: 80px;
  position: relative;
  z-index: 100;
  pointer-events: auto !important;
}

.exercise-name-actions {
  position: absolute;
  right: 8px;
  display: flex;
  gap: 4px;
  align-items: center;
  z-index: 101;
  /* pointer-events: none; 已删除 */
}

.exercise-name-actions .exercise-name-btn {
  pointer-events: auto !important;
}

.exercise-name-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 6px 10px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.exercise-name-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.exercise-name-btn.save-btn {
  background: rgba(82, 196, 26, 0.2);
  border-color: rgba(82, 196, 26, 0.4);
  color: #52C41A;
}

.exercise-name-btn.save-btn:hover {
  background: rgba(82, 196, 26, 0.3);
}

.exercise-name-btn.save-btn.saved {
  background: rgba(82, 196, 26, 0.3);
  color: #52C41A;
}

.exercise-name-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.exercise-name-search {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.exercise-name-list {
  padding: 8px 0;
}

.exercise-name-category {
  padding: 8px 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  text-transform: uppercase;
}

.exercise-name-item {
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 3px solid transparent;
}

.exercise-name-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-left-color: #00D1FF;
}

.exercise-name-item.selected {
  background: rgba(0, 209, 255, 0.1);
  border-left-color: #00D1FF;
  color: #00D1FF;
}

.exercise-name-item-name {
  flex: 1;
  font-size: 14px;
}

.exercise-name-item-delete {
  padding: 4px 8px;
  background: rgba(255, 77, 79, 0.2);
  border: 1px solid rgba(255, 77, 79, 0.3);
  border-radius: 4px;
  color: #FF4D4F;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.exercise-name-item:hover .exercise-name-item-delete {
  opacity: 1;
}

.exercise-name-item-delete:hover {
  background: rgba(255, 77, 79, 0.3);
}

.exercise-name-empty {
  padding: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

/* 添加动作按钮 */
.add-exercise-btn {
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #00D1FF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-exercise-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #00D1FF;
  transform: translateY(-1px);
}

.add-exercise-btn:active {
  transform: translateY(0);
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state-text {
  font-size: 16px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.7);
}

.empty-state-subtext {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

/* 加载动画 */
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 26, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #00D1FF;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #fff;
  font-size: 14px;
  margin-left: 16px;
}

/* 提示弹窗 */
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 9999;
  display: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: toastIn 0.3s ease;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.toast.show {
  display: block;
}

.toast.success {
  background: rgba(82, 196, 26, 0.9);
}

.toast.error {
  background: rgba(255, 77, 79, 0.9);
}

/* 成功弹窗 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: #0a0a1a;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  min-width: 300px;
  max-width: 400px;
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 12px;
}

.modal-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.modal-btn.primary {
  background: linear-gradient(135deg, #00D1FF, #0070F3);
  color: #fff;
}

.modal-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 209, 255, 0.3);
}

.modal-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 底部导航栏 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 0;
  z-index: 1000;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  min-width: 0;
}

.nav-item:hover {
  color: #00D1FF;
}

.nav-item.active {
  color: #CCFF00;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
}

.nav-item.coming-soon {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-item.coming-soon:hover {
  color: rgba(255, 255, 255, 0.6);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 0 16px 40px;
  }

  .exercise-fields {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .exercise-name-field,
  .exercise-notes-field {
    grid-column: span 1;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-half {
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 0 12px 40px;
  }
  
  .header {
    padding: 16px 12px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .save-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .exercise-item {
    padding: 16px;
  }

  .form-section {
    padding: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .nav-label {
    display: none;
  }

  .nav-icon {
    font-size: 22px;
    margin-bottom: 0;
  }
}

/* 全局样式 */
body {
  padding-bottom: 80px;
}
</style>
