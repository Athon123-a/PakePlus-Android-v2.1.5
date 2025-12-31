          });
        }
        
        // 添加当月的日期
        for (let i = 1; i <= daysInMonth; i++) {
          const fullDate = new Date(year, month, i);
          days.push({
            date: i,
            fullDate,
            isCurrentMonth: true,
            isToday: this.isToday(fullDate),
            plans: this.getPlansForDate(fullDate)
          });
        }
        
        // 添加下个月的日期
        for (let i = 1; i <= nextMonthDays; i++) {
          const fullDate = new Date(year, month + 1, i);
          days.push({
            date: i,
            fullDate,
            isCurrentMonth: false,
            isToday: this.isToday(fullDate),
            plans: this.getPlansForDate(fullDate)
          });
        }
        
        this.calendarDays = days;
        
        // 默认选中今天
        if (!this.selectedDate || !this.isSameMonth(this.selectedDate.fullDate, this.currentDate)) {
          const todayIndex = days.findIndex(day => day.isToday && day.isCurrentMonth);
          if (todayIndex >= 0) {
            this.selectedDate = days[todayIndex];
          } else if (days.length > 0) {
            this.selectedDate = days[prevMonthDays]; // 选中当月第一天
          }
        }
        
        this.isLoading = false;
      }, 600);
    },
    
    // 判断是否为今天
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
    },
    
    // 判断是否为同一个月
    isSameMonth(date1, date2) {
      return date1.getMonth() === date2.getMonth() &&
             date1.getFullYear() === date2.getFullYear();
    },
    
    // 获取指定日期的训练计划
    getPlansForDate(date) {
      // 这里应该从API或本地存储获取数据
      // 返回模拟数据
      return this.generateMockPlansForDate(date);
    },
    
    // 为指定日期生成模拟训练计划
    generateMockPlansForDate(date) {
      const plans = [];
      
      // 随机生成一些训练计划
      const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      
      // 简单的哈希函数来确保同一天总是生成相同的计划
      const hash = dateKey.split('-').reduce((acc, val) => acc + parseInt(val), 0) % 3;
      
      if (hash === 1) {
        plans.push({
          id: `${dateKey}-ai-1`,
          name: '全身力量训练',
          type: 'ai',
          duration: 45,
          difficulty: 'intermediate',
          exercises: [
            { name: '深蹲', sets: 4, reps: '8-10' },
            { name: '卧推', sets: 4, reps: '8-10' },
            { name: '硬拉', sets: 3, reps: '6-8' },
            { name: '引体向上', sets: 4, reps: '8-12' },
            { name: '肩推', sets: 3, reps: '10-12' }
          ],
          createdAt: new Date().toISOString()
        });
      } else if (hash === 2) {
        plans.push({
          id: `${dateKey}-manual-1`,
          name: '上肢训练计划',
          type: 'manual',
          duration: 35,
          difficulty: 'beginner',
          exercises: [
            { name: '哑铃卧推', sets: 3, reps: '12-15' },
            { name: '哑铃划船', sets: 3, reps: '12-15' },
            { name: '二头弯举', sets: 3, reps: '15-20' },
            { name: '三头下压', sets: 3, reps: '15-20' }
          ],
          createdAt: new Date().toISOString()
        });
      }
      
      // 每月第一天添加一个额外的AI计划
      if (date.getDate() === 1) {
        plans.push({
          id: `${dateKey}-ai-2`,
          name: '核心强化训练',
          type: 'ai',
          duration: 25,
          difficulty: 'advanced',
          exercises: [
            { name: '平板支撑', sets: 3, reps: '60秒' },
            { name: '仰卧起坐', sets: 4, reps: '20-25' },
            { name: '悬挂举腿', sets: 3, reps: '12-15' },
            { name: '侧平板支撑', sets: 3, reps: '45秒/侧' }
          ],
          createdAt: new Date().toISOString()
        });
      }
      
      return plans;
    },
    
    // 选择日期
    selectDate(day) {
      this.selectedDate = day;
    },
    
    // 格式化选中日期的显示
    formatSelectedDate(selectedDate) {
      const date = selectedDate.fullDate;
      return `${date.getMonth() + 1}月${date.getDate()}日 星期${this.weekdays[date.getDay()]}`;
    },
    
    // 添加新计划
    addNewPlan() {
      try {
        if (typeof uni !== 'undefined') {
          uni.navigateTo({
            url: '/frontend/manual-plan-creator'
          });
        } else {
          window.location.href = '/frontend/manual-plan-creator.html';
        }
      } catch (error) {
        console.error('跳转到计划创建页面失败:', error);
      }
    },
    
    // 为指定日期添加新计划
    addNewPlanToDate() {
      // 可以传递选中的日期到创建页面
      try {
        if (typeof uni !== 'undefined') {
          uni.navigateTo({
            url: '/frontend/manual-plan-creator'
          });
        } else {
          window.location.href = '/frontend/manual-plan-creator.html';
        }
      } catch (error) {
        console.error('跳转到计划创建页面失败:', error);
      }
    },
    
    // 开始训练
    startTraining(plan) {
      try {
        console.log('开始训练:', plan);
        
        if (typeof uni !== 'undefined') {
          // 跳转到训练页面或AI助手页面
          uni.navigateTo({
            url: '/frontend/ai-assistant'
          });
        } else {
          window.location.href = '/frontend/ai-assistant.html';
        }
      } catch (error) {
        console.error('开始训练失败:', error);
      }
    },
    
    // 查看计划详情
    viewPlanDetails(plan) {
      try {
        console.log('查看计划详情:', plan);
        
        if (typeof uni !== 'undefined') {
          uni.showToast({
            title: '查看计划详情功能待实现',
            icon: 'none',
            duration: 2000
          });
        } else {
          alert('查看计划详情功能待实现');
        }
      } catch (error) {
        console.error('查看计划详情失败:', error);
      }
    }
  }
};

<style scoped>
.calendar-container {
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
  min-height: 100vh;
  color: #fff;
  position: relative;
}

/* 顶部导航栏 */
.header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn,
.add-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover,
.add-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.add-btn {
  background: linear-gradient(135deg, #00D1FF, #0070F3);
}

.add-btn:hover {
  background: linear-gradient(135deg, #00C0E6, #005BCC);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  flex: 1;
  text-align: center;
}

/* 主内容区 */
.content {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

/* 月份导航 */
.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.current-month {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

/* 星期标题 */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 4px;
}

/* 日历网格 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
}

.calendar-day {
  min-height: 100px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.02);
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.today {
  background: rgba(0, 209, 255, 0.15);
  border: 1px solid rgba(0, 209, 255, 0.3);
}

.calendar-day.selected {
  background: rgba(0, 209, 255, 0.25);
  border: 1px solid rgba(0, 209, 255, 0.5);
}

.day-number {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 8px;
}

.day-indicators {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: auto;
}

.plan-indicator {
  height: 4px;
  border-radius: 2px;
  opacity: 0.9;
}

.plan-indicator.ai-plan {
  background: linear-gradient(90deg, #00D1FF, #0070F3);
}

.plan-indicator.manual-plan {
  background: linear-gradient(90deg, #CCFF00, #85D000);
}

/* 选中日期的计划列表 */
.selected-date-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.plan-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: normal;
}

.no-plans {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.no-plans-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-plans-text {
  font-size: 16px;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.7);
}

.add-plan-btn {
  background: linear-gradient(135deg, #00D1FF, #0070F3);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-plan-btn:hover {
  background: linear-gradient(135deg, #00C0E6, #005BCC);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 209, 255, 0.3);
}

/* 计划列表 */
.plans-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.plan-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.plan-card.ai-plan {
  border-left: 4px solid #00D1FF;
}

.plan-card.manual-plan {
  border-left: 4px solid #CCFF00;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plan-type-badge {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.plan-card.ai-plan .plan-type-badge {
  background: rgba(0, 209, 255, 0.2);
  color: #00D1FF;
}

.plan-card.manual-plan .plan-type-badge {
  background: rgba(204, 255, 0, 0.2);
  color: #CCFF00;
}

.plan-duration {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.plan-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
}

.plan-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.plan-difficulty,
.plan-exercises-count {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.plan-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn {
  background: linear-gradient(135deg, #00D1FF, #0070F3);
  color: #fff;
}

.start-btn:hover {
  background: linear-gradient(135deg, #00C0E6, #005BCC);
  box-shadow: 0 4px 12px rgba(0, 209, 255, 0.3);
}

.details-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.details-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 加载动画 */
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 26, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #00D1FF;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #fff;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 16px;
  }
  
  .calendar-day {
    min-height: 80px;
    padding: 6px;
  }
  
  .selected-date-section {
    padding: 20px;
  }
  
  .plan-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 12px;
  }
  
  .header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .month-nav {
    padding: 12px 16px;
  }
  
  .current-month {
    font-size: 16px;
  }
  
  .nav-btn {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .calendar-grid {
    padding: 8px;
  }
  
  .calendar-day {
    min-height: 70px;
    padding: 4px;
  }
  
  .day-number {
    font-size: 14px;
  }
  
  .selected-date-section {
    padding: 16px;
  }
  
  .section-title {
    font-size: 16px;
  }
}
</style><template>
  <view class="calendar-page">
    <view class="container">
      <!-- Header -->
      <view class="header">
        <button class="back-btn" @click="goBack">⬅</button>
        <h1 class="page-title">训练计划管理</h1>
        <button class="add-plan-btn" @click="navigateToCreatePlan">+</button>
      </view>
      
      <!-- Calendar Controls -->
      <view class="calendar-controls">
        <button class="month-nav-btn" @click="changeMonth(-1)">‹</button>
        <text class="current-month">{{ currentYear }}年{{ currentMonth + 1 }}月</text>
        <button class="month-nav-btn" @click="changeMonth(1)">›</button>
      </view>
      
      <!-- Calendar Grid -->
      <view class="calendar-grid">
        <view 
          v-for="(day, index) in calendarDays" 
          :key="index"
          :class="['calendar-day', {
            'empty': !day,
            'today': day && isToday(day),
            'has-plan': day && hasPlanOnDay(day)
          }]"
          @click="selectDate(day)"
        >
          <text class="day-number">{{ day ? day.date : '' }}</text>
          <view 
            v-if="day && hasPlanOnDay(day)" 
            class="plan-indicator"
          >
            <view 
              v-for="plan in getPlansOnDay(day)" 
              :key="plan.id"
              class="plan-dot"
              :class="plan.difficulty"
              :title="plan.name"
            ></view>
          </view>
        </view>
      </view>
      
      <!-- Selected Date Plans -->
      <view v-if="selectedDate" class="selected-date-plans">
        <view class="selected-date-header">
          <h2 class="selected-date-title">{{ formatSelectedDate(selectedDate) }} 训练计划</h2>
          <button class="add-day-plan-btn" @click="navigateToCreatePlan">添加计划</button>
        </view>
        <view v-if="getPlansOnDay(selectedDate).length > 0" class="plans-list">
          <view 
            v-for="plan in getPlansOnDay(selectedDate)" 
            :key="plan.id"
            class="plan-card"
            @click="viewPlanDetails(plan)"
          >
            <view class="plan-card-header">
              <h3 class="plan-card-title">{{ plan.name }}</h3>
              <text class="plan-difficulty" :class="plan.difficulty">{{ plan.difficulty }}</text>
            </view>
            <view class="plan-card-meta">
              <text class="plan-duration">⏱️ {{ plan.duration }}分钟</text>
              <text class="plan-exercises">🏃‍♂️ {{ plan.exerciseCount }}个动作</text>
            </view>
            <view class="plan-card-actions">
              <button class="start-plan-btn" @click.stop="() => startPlan(plan)">开始训练</button>
              <button class="edit-plan-btn" @click.stop="() => editPlan(plan)">编辑</button>
              <button class="delete-plan-btn" @click.stop="() => deletePlan(plan)">删除</button>
            </view>
          </view>
        </view>
        <view v-else class="no-plans">
          <text class="no-plans-text">这一天还没有安排训练计划</text>
          <button class="create-first-plan-btn" @click="navigateToCreatePlan">创建第一个计划</button>
        </view>
      </view>

      <!-- Recent Plans -->
      <view v-if="!selectedDate" class="recent-plans">
        <h2 class="section-title">近期训练计划</h2>
        <view v-if="recentPlans.length > 0" class="plans-list">
          <view 
            v-for="plan in recentPlans" 
            :key="plan.id"
            class="plan-card"
            @click="viewPlanDetails(plan)"
          >
            <view class="plan-card-header">
              <h3 class="plan-card-title">{{ plan.name }}</h3>
              <text class="plan-date">{{ formatPlanDate(plan.date) }}</text>
            </view>
            <view class="plan-card-meta">
              <text class="plan-duration">⏱️ {{ plan.duration }}分钟</text>
              <text class="plan-difficulty" :class="plan.difficulty">{{ plan.difficulty }}</text>
            </view>
            <view class="plan-card-actions">
              <button class="start-plan-btn" @click.stop="() => startPlan(plan)">开始训练</button>
              <button class="edit-plan-btn" @click.stop="() => editPlan(plan)">编辑</button>
            </view>
          </view>
        </view>
        <view v-else class="no-plans">
          <text class="no-plans-text">暂无训练计划</text>
          <button class="create-first-plan-btn" @click="navigateToCreatePlan">创建训练计划</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      selectedDate: null,
      calendarDays: [],
      trainingPlans: [
        {
          id: 1,
          name: '腹肌撕裂训练',
          duration: 30,
          difficulty: '中级',
          exerciseCount: 8,
          date: new Date(2024, 3, 15), // 4月15日
          createdAt: new Date(2024, 3, 10)
        },
        {
          id: 2,
          name: '上肢力量训练',
          duration: 45,
          difficulty: '高级',
          exerciseCount: 12,
          date: new Date(2024, 3, 17), // 4月17日
          createdAt: new Date(2024, 3, 12)
        },
        {
          id: 3,
          name: '全身燃脂训练',
          duration: 60,
          difficulty: '初级',
          exerciseCount: 10,
          date: new Date(2024, 3, 19), // 4月19日
          createdAt: new Date(2024, 3, 15)
        }
      ]
    };
  },
  computed: {
    recentPlans() {
      return this.trainingPlans
        .filter(plan => plan.date >= new Date())
        .sort((a, b) => a.date - b.date)
        .slice(0, 5);
    }
  },
  mounted() {
    this.generateCalendar();
  },
  methods: {
    generateCalendar() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();
      
      const days = [];
      
      // 填充前一个月的空白日期
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      // 填充当月日期
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({
          date: i,
          fullDate: new Date(this.currentYear, this.currentMonth, i)
        });
      }
      
      this.calendarDays = days;
    },
    changeMonth(direction) {
      this.currentMonth += direction;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.generateCalendar();
      this.selectedDate = null;
    },
    isToday(day) {
      const today = new Date();
      return day && day.fullDate.getDate() === today.getDate() &&
             day.fullDate.getMonth() === today.getMonth() &&
             day.fullDate.getFullYear() === today.getFullYear();
    },
    hasPlanOnDay(day) {
      return day && this.getPlansOnDay(day).length > 0;
    },
    getPlansOnDay(day) {
      if (!day) return [];
      return this.trainingPlans.filter(plan => {
        return plan.date.getDate() === day.fullDate.getDate() &&
               plan.date.getMonth() === day.fullDate.getMonth() &&
               plan.date.getFullYear() === day.fullDate.getFullYear();
      });
    },
    selectDate(day) {
      if (day) {
        this.selectedDate = day;
      }
    },
    formatSelectedDate(day) {
      const year = day.fullDate.getFullYear();
      const month = day.fullDate.getMonth() + 1;
      const date = day.fullDate.getDate();
      return `${year}年${month}月${date}日`;
    },
    formatPlanDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}.${month}.${day}`;
    },
    viewPlanDetails(plan) {
      console.log('查看计划详情:', plan);
      uni.showToast({
        title: '查看计划详情功能',
        icon: 'none'
      });
    },
    startPlan(plan) {
      console.log('开始训练计划:', plan);
      uni.showToast({
        title: '开始训练',
        icon: 'success'
      });
      // 跳转到AI助手页面开始训练
      this.navigateToAIAssistant();
    },
    editPlan(plan) {
      console.log('编辑计划:', plan);
      uni.showToast({
        title: '编辑计划功能',
        icon: 'none'
      });
      // 跳转到编辑页面
      this.navigateToPage('/frontend/manual-plan-creator?id=' + plan.id);
    },
    deletePlan(plan) {
      console.log('删除计划:', plan);
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个训练计划吗？',
        success: (res) => {
          if (res.confirm) {
            const index = this.trainingPlans.findIndex(p => p.id === plan.id);
            if (index !== -1) {
              this.trainingPlans.splice(index, 1);
              uni.showToast({
                title: '计划已删除',
                icon: 'success'
              });
            }
          }
        }
      });
    },
    navigateToCreatePlan() {
      this.navigateToPage('/frontend/manual-plan-creator');
    },
    navigateToAIAssistant() {
      this.navigateToPage('/frontend/ai-assistant');
    },
    navigateToPage(url) {
      if (typeof uni !== 'undefined' && uni.navigateTo) {
        uni.navigateTo({
          url: url,
          success: () => {
            console.log('跳转成功到:', url);
          },
          fail: (err) => {
            console.error('跳转失败:', err);
            uni.redirectTo({
              url: url
            });
          }
        });
      } else {
        const htmlUrl = url + '.html';
        console.log('Web环境跳转:', htmlUrl);
        window.location.href = htmlUrl;
      }
    },
    goBack() {
      if (typeof uni !== 'undefined' && uni.navigateBack) {
        uni.navigateBack();
      } else {
        window.history.back();
      }
    }
  }
};
</script>

<style scoped>
.calendar-page {
  background-color: #121212;
  min-height: 100vh;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'HarmonyOS Sans', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  padding-bottom: 100px;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn,
.add-plan-btn {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ffffff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover,
.add-plan-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

/* Calendar Controls */
.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
}

.month-nav-btn {
  padding: 10px 16px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.month-nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.current-month {
  font-size: 18px;
  font-weight: 500;
}

/* Calendar Grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.calendar-day:hover:not(.empty) {
  background-color: rgba(0, 209, 255, 0.1);
  transform: scale(1.05);
}

.calendar-day.empty {
  cursor: default;
  opacity: 0;
}

.calendar-day.today {
  background-color: rgba(204, 255, 0, 0.2);
  border: 2px solid #CCFF00;
}

.day-number {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.plan-indicator {
  display: flex;
  gap: 3px;
  margin-top: auto;
}

.plan-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.plan-dot.初级 {
  background-color: #00D1FF;
}

.plan-dot.中级 {
  background-color: #CCFF00;
}

.plan-dot.高级 {
  background-color: #FF5050;
}

/* Selected Date Plans */
.selected-date-plans {
  margin-top: 40px;
}

.selected-date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.selected-date-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.add-day-plan-btn {
  padding: 8px 16px;
  border-radius: 20px;
  background-color: rgba(0, 209, 255, 0.1);
  border: 1px solid rgba(0, 209, 255, 0.3);
  color: #00D1FF;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-day-plan-btn:hover {
  background-color: rgba(0, 209, 255, 0.2);
}

/* Plans List */
.plans-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.plan-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.plan-card:hover {
  border-color: rgba(0, 209, 255, 0.3);
  transform: translateY(-3px);
}

.plan-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.plan-card-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  flex: 1;
}

.plan-date {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.plan-difficulty {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.plan-difficulty.初级 {
  background-color: rgba(0, 209, 255, 0.2);
  color: #00D1FF;
}

.plan-difficulty.中级 {
  background-color: rgba(204, 255, 0, 0.2);
  color: #CCFF00;
}

.plan-difficulty.高级 {
  background-color: rgba(255, 80, 80, 0.2);
  color: #FF5050;
}

.plan-card-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.7);
}

.plan-card-actions {
  display: flex;
  gap: 10px;
}

.start-plan-btn,
.edit-plan-btn,
.delete-plan-btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-plan-btn {
  background: linear-gradient(135deg, #CCFF00, #99FF00);
  color: #121212;
}

.start-plan-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(204, 255, 0, 0.3);
}

.edit-plan-btn {
  background-color: rgba(0, 209, 255, 0.1);
  color: #00D1FF;
  border: 1px solid rgba(0, 209, 255, 0.3);
}

.edit-plan-btn:hover {
  background-color: rgba(0, 209, 255, 0.2);
}

.delete-plan-btn {
  background-color: rgba(255, 80, 80, 0.1);
  color: #ff5050;
  border: 1px solid rgba(255, 80, 80, 0.3);
}

.delete-plan-btn:hover {
  background-color: rgba(255, 80, 80, 0.2);
}

/* No Plans State */
.no-plans {
  text-align: center;
  padding: 40px 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.no-plans-text {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
}

.create-first-plan-btn {
  padding: 12px 24px;
  border-radius: 20px;
  background: linear-gradient(135deg, #CCFF00, #99FF00);
  border: none;
  color: #121212;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-first-plan-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(204, 255, 0, 0.3);
}

/* Recent Plans */
.recent-plans {
  margin-top: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 30px;
  height: 3px;
  background: linear-gradient(90deg, #CCFF00, #00D1FF);
  border-radius: 3px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .calendar-grid {
    padding: 15px;
    gap: 8px;
  }
  
  .calendar-day {
    padding: 8px;
  }
  
  .day-number {
    font-size: 14px;
  }
  
  .selected-date-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .plan-card-actions {
    flex-wrap: wrap;
  }
  
  .plan-card-meta {
    flex-wrap: wrap;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .header {
    padding: 15px 0;
  }
  
  .back-btn,
  .add-plan-btn {
    width: 36px;
    height: 36px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .calendar-controls {
    margin: 20px 0;
  }
  
  .month-nav-btn {
    padding: 8px 12px;
    font-size: 16px;
  }
  
  .current-month {
    font-size: 16px;
  }
  
  .calendar-grid {
    padding: 10px;
    gap: 5px;
  }
  
  .calendar-day {
    padding: 5px;
  }
  
  .day-number {
    font-size: 12px;
  }
  
  .plan-dot {
    width: 4px;
    height: 4px;
  }
}
</style>