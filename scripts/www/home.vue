<template>
  <view class="home-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="user-info">
        <view class="user-avatar" @click="goToProfile">{{ userInitials }}</view>
        <view>
          <view class="greeting">{{ greetingMessage }}</view>
          <view class="greeting-time">{{ greetingTime }}</view>
        </view>
      </view>
      <button class="calendar-btn" @click="goToCalendar">📅</button>
    </view>

    <!-- AI计划生成板块 -->
    <view class="ai-plan-generator">
      <view class="ai-generator-header">
        <view class="ai-generator-title">
          <view class="ai-icon">🤖</view>
          <view class="ai-title-text">
            <view class="ai-title-main">AI 智能计划生成</view>
            <view class="ai-title-desc">根据您的目标，AI为您定制专属训练计划</view>
          </view>
        </view>
        <view class="ai-badge">NEW</view>
      </view>
      <view class="ai-generator-options">
        <view 
          v-for="option in aiOptions" 
          :key="option.value"
          class="ai-option-card"
          :class="{ active: selectedOption === option.value }"
          @click="selectOption(option.value)"
        >
          <view class="ai-option-icon">{{ option.icon }}</view>
          <view class="ai-option-text">{{ option.text }}</view>
        </view>
      </view>
      <button class="ai-generate-btn" @click="generateAIPlan">
        <text>✨</text>
        <text>立即生成训练计划</text>
      </button>
    </view>

    <!-- AI训练计划卡片 -->
    <view class="ai-planner-card" v-if="showAIPlan">
      <view class="ai-planner-header">
        <view class="exercise-preview">
          <view class="plan-badge">推荐</view>
        </view>
        <view class="plan-details">
          <view class="plan-title">
            <text class="plan-title-icon">🎯</text>
            <text>{{ currentPlan.title }}</text>
          </view>
          <view class="plan-meta">
            <view class="plan-meta-item">
              <text>⏱️ {{ currentPlan.duration }}</text>
            </view>
            <view class="plan-meta-item">
              <text>🏃‍♂️ {{ currentPlan.exercises }}</text>
            </view>
            <view class="plan-meta-item">
              <text>🔥 {{ currentPlan.calories }}</text>
            </view>
          </view>
        </view>
      </view>
      <button class="start-training-btn" @click="startTraining">
        <text>🚀</text>
        <text>开始 AI 纠错训练</text>
      </button>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-actions">
      <view class="section-title">快捷入口</view>
      <view class="quick-entry-container">
        <button class="entry-btn" @click="goToManualCreate">
          <view class="entry-btn-icon">📝</view>
          <text class="entry-btn-text">手动创建</text>
        </button>
        <button class="entry-btn" @click="goToStatistics">
          <view class="entry-btn-icon">📊</view>
          <text class="entry-btn-text">数据统计</text>
        </button>
        <button class="entry-btn" @click="goToCommunity">
          <view class="entry-btn-icon">👥</view>
          <text class="entry-btn-text">社区</text>
        </button>
        <button class="entry-btn" @click="scanEquipment">
          <view class="entry-btn-icon">📷</view>
          <text class="entry-btn-text">器械扫码</text>
        </button>
      </view>
    </view>

    <!-- 最近训练 -->
    <view class="recent-training">
      <view class="section-title">最近训练</view>
      <view class="recent-list">
        <view 
          v-for="(session, index) in recentSessions" 
          :key="index"
          class="recent-item"
          @click="viewSessionDetail(session)"
        >
          <view class="recent-icon">{{ session.icon }}</view>
          <view class="recent-info">
            <view class="recent-title">{{ session.title }}</view>
            <view class="recent-meta">{{ session.date }} · {{ session.duration }}分钟</view>
          </view>
          <view class="recent-calories">{{ session.calories }} 千卡</view>
        </view>
      </view>
    </view>

    <!-- 今日数据 -->
    <view class="daily-stats">
      <view class="section-title">今日数据</view>
      <view class="stats-grid">
        <view class="stat-card">
          <view class="stat-header">
            <view class="stat-icon">🔥</view>
            <text class="stat-title">热量消耗</text>
          </view>
          <view class="progress-container">
            <view class="progress-bar" :style="{ width: caloriesProgress + '%' }"></view>
          </view>
          <view class="stat-value">
            <text>{{ dailyStats.calories.current }}/{{ dailyStats.calories.target }} 千卡</text>
            <text class="stat-trend">↑ {{ dailyStats.calories.trend }}%</text>
          </view>
        </view>
        <view class="stat-card">
          <view class="stat-header">
            <view class="stat-icon">💧</view>
            <text class="stat-title">水分摄入</text>
          </view>
          <view class="progress-container">
            <view class="progress-bar" :style="{ width: waterProgress + '%' }"></view>
          </view>
          <view class="stat-value">
            <text>{{ dailyStats.water.current }}/{{ dailyStats.water.target }} 升</text>
            <text class="stat-trend">↑ {{ dailyStats.water.trend }}%</text>
          </view>
        </view>
        <view class="stat-card">
          <view class="stat-header">
            <view class="stat-icon">❤️</view>
            <text class="stat-title">平均心率</text>
          </view>
          <view class="progress-container">
            <view class="progress-bar" :style="{ width: heartProgress + '%' }"></view>
          </view>
          <view class="stat-value">
            <text>{{ dailyStats.heart.current }} BPM</text>
            <text class="stat-trend">正常</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <view class="bottom-nav">
      <view class="nav-item active" @click="goToHome">
        <view class="nav-icon">🏠</view>
        <view class="nav-label">首页</view>
      </view>
      <view class="nav-item" @click="goToCalendar">
        <view class="nav-icon">📅</view>
        <view class="nav-label">日历</view>
      </view>
      <view class="nav-item" @click="goToCommunity">
        <view class="nav-icon">👥</view>
        <view class="nav-label">社区</view>
      </view>
      <view class="nav-item" @click="goToProfile">
        <view class="nav-icon">👤</view>
        <view class="nav-label">我的</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInitials: 'JD',
      greetingMessage: '准备好虐腹了吗？',
      greetingTime: '',
      selectedOption: 'weight-loss',
      showAIPlan: true,
      aiOptions: [
        { value: 'weight-loss', icon: '🔥', text: '减脂塑形' },
        { value: 'muscle-gain', icon: '💪', text: '增肌增重' },
        { value: 'endurance', icon: '🏃', text: '提升耐力' },
        { value: 'flexibility', icon: '🧘', text: '柔韧性' }
      ],
      currentPlan: {
        title: '腹肌撕裂训练',
        duration: '30分钟',
        exercises: '8个动作',
        calories: '~300千卡'
      },
      recentSessions: [
        { icon: '💪', title: '上肢力量训练', date: '今天', duration: 45, calories: 320 },
        { icon: '🦵', title: '腿部爆发力', date: '昨天', duration: 35, calories: 280 },
        { icon: '🔥', title: 'HIIT燃脂', date: '2天前', duration: 25, calories: 350 }
      ],
      dailyStats: {
        calories: { current: 325, target: 500, trend: 12 },
        water: { current: 1.2, target: 2.5, trend: 5 },
        heart: { current: 72, target: 100, trend: 0 }
      }
    };
  },
  computed: {
    caloriesProgress() {
      return (this.dailyStats.calories.current / this.dailyStats.calories.target) * 100;
    },
    waterProgress() {
      return (this.dailyStats.water.current / this.dailyStats.water.target) * 100;
    },
    heartProgress() {
      return (this.dailyStats.heart.current / this.dailyStats.heart.target) * 100;
    }
  },
  mounted() {
    this.updateGreetingTime();
    setInterval(() => {
      this.updateGreetingTime();
    }, 60000);
  },
  methods: {
    updateGreetingTime() {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes().toString().padStart(2, '0');
      this.greetingTime = `${hour}:${minute}`;
      
      if (hour < 6) {
        this.greetingMessage = '深夜了，注意休息哦';
      } else if (hour < 12) {
        this.greetingMessage = '早安！准备开始新一天的训练吧';
      } else if (hour < 14) {
        this.greetingMessage = '中午好！午餐后稍作休息再训练';
      } else if (hour < 18) {
        this.greetingMessage = '下午好！是时候动起来了';
      } else {
        this.greetingMessage = '晚上好！晚间训练效果更佳';
      }
    },
    selectOption(value) {
      this.selectedOption = value;
    },
    generateAIPlan() {
      const selectedOption = this.aiOptions.find(opt => opt.value === this.selectedOption);
      if (!selectedOption) {
        uni.showToast({
          title: '请先选择训练目标',
          icon: 'none'
        });
        return;
      }

      // 跳转到AI助手页面并传递参数
      uni.navigateTo({
        url: `/frontend/ai-assistant?mode=generate&target=${this.selectedOption}`
      });
    },
    startTraining() {
      uni.showLoading({
        title: '准备中...'
      });

      setTimeout(() => {
        uni.hideLoading();
        uni.navigateTo({
          url: '/frontend/ai-assistant'
        });
      }, 500);
    },
    goToHome() {
      console.log('已在首页');
    },
    goToCalendar() {
      uni.navigateTo({
        url: '/frontend/calendar'
      });
    },
    goToCommunity() {
      uni.navigateTo({
        url: '/frontend/community'
      });
    },
    goToProfile() {
      uni.navigateTo({
        url: '/frontend/profile'
      });
    },
    goToManualCreate() {
      uni.navigateTo({
        url: '/frontend/manual-plan-creator'
      });
    },
    goToStatistics() {
      uni.navigateTo({
        url: '/frontend/statistics'
      });
    },
    scanEquipment() {
      uni.showToast({
        title: '器械扫码功能开发中',
        icon: 'none'
      });
    },
    viewSessionDetail(session) {
      uni.showToast({
        title: `查看${session.title}`,
        icon: 'none'
      });
    }
  }
};
</script>

<style scoped>
.home-container {
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
  min-height: 100vh;
  padding-bottom: 70px;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #0a0a1a;
  cursor: pointer;
}

.greeting {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.greeting-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.calendar-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calendar-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* AI计划生成板块 */
.ai-plan-generator {
  margin: 20px;
  background: linear-gradient(135deg, rgba(204, 255, 0, 0.1), rgba(0, 209, 255, 0.1));
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(204, 255, 0, 0.3);
}

.ai-generator-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.ai-generator-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.ai-title-main {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.ai-title-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.ai-badge {
  background: linear-gradient(135deg, #FF6B6B, #FF4757);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

.ai-generator-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.ai-option-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-option-card.active {
  border-color: #CCFF00;
  background: rgba(204, 255, 0, 0.1);
}

.ai-option-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.ai-option-icon {
  font-size: 32px;
}

.ai-option-text {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.ai-generate-btn {
  width: 100%;
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: #0a0a1a;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(204, 255, 0, 0.3);
}

/* AI训练计划卡片 */
.ai-planner-card {
  margin: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
}

.ai-planner-header {
  margin-bottom: 16px;
}

.plan-badge {
  display: inline-block;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0a0a1a;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 12px;
}

.plan-title {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.plan-title-icon {
  font-size: 20px;
}

.plan-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.plan-meta-item {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}

.start-training-btn {
  width: 100%;
  background: linear-gradient(135deg, #00D1FF, #0070F3);
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-training-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 209, 255, 0.3);
}

/* 快捷入口 */
.quick-actions {
  margin: 20px;
}

.section-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.quick-entry-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.entry-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.entry-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.entry-btn-icon {
  font-size: 28px;
}

.entry-btn-text {
  color: #fff;
  font-size: 12px;
  text-align: center;
}

/* 最近训练 */
.recent-training {
  margin: 20px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recent-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.recent-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.recent-info {
  flex: 1;
}

.recent-title {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
}

.recent-meta {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.recent-calories {
  color: #CCFF00;
  font-size: 14px;
  font-weight: 600;
}

/* 今日数据 */
.daily-stats {
  margin: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-icon {
  font-size: 20px;
}

.stat-title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.progress-container {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-bottom: 12px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #CCFF00, #00D1FF);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.stat-value {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value text:first-child {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.stat-trend {
  color: #52C41A;
  font-size: 11px;
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
  display: flex;
  justify-content: space-around;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-item.active .nav-label {
  color: #CCFF00;
}

.nav-icon {
  font-size: 22px;
  transition: transform 0.3s ease;
}

.nav-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  transition: color 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-entry-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .ai-generator-options {
    grid-template-columns: 1fr;
  }
}
</style>

