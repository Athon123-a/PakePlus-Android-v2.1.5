<template>
  <view class="profile-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-center">
        <view class="page-title">个人中心</view>
      </view>
      <view class="header-right">
        <button class="settings-btn" @click="openSettings">⚙️</button>
      </view>
    </view>

    <!-- 个人信息卡片 -->
    <view class="profile-card">
      <view class="profile-header">
        <view class="avatar-section">
          <view class="user-avatar">{{ userInfo.avatar }}</view>
          <view class="avatar-edit" @click="changeAvatar">📷</view>
        </view>
        <view class="user-info">
          <view class="user-name">{{ userInfo.name }}</view>
          <view class="user-level">LV.{{ userInfo.level }}</view>
          <view class="user-signature">{{ userInfo.signature }}</view>
        </view>
        <view class="edit-profile-btn" @click="editProfile">✏️</view>
      </view>

      <!-- 经验进度 -->
      <view class="exp-section">
        <view class="exp-info">
          <text class="exp-text">经验值</text>
          <text class="exp-value">{{ userInfo.exp }}/{{ userInfo.nextLevelExp }}</text>
        </view>
        <view class="exp-bar">
          <view class="exp-fill" :style="{ width: expProgress + '%' }"></view>
        </view>
        <view class="exp-remaining">还需 {{ userInfo.expToNext }} 经验升级</view>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="stats-section">
      <view class="stat-item" @click="viewTrainingStats">
        <view class="stat-icon">🏋️</view>
        <view class="stat-value">{{ userStats.totalTrainings }}</view>
        <view class="stat-label">总训练次数</view>
      </view>
      <view class="stat-item" @click="viewTimeStats">
        <view class="stat-icon">⏱️</view>
        <view class="stat-value">{{ userStats.totalTime }}</view>
        <view class="stat-label">总训练时长</view>
      </view>
      <view class="stat-item" @click="viewAchievementStats">
        <view class="stat-icon">🏆</view>
        <view class="stat-value">{{ userStats.achievements }}</view>
        <view class="stat-label">获得成就</view>
      </view>
      <view class="stat-item" @click="viewCalorieStats">
        <view class="stat-icon">🔥</view>
        <view class="stat-value">{{ userStats.totalCalories }}</view>
        <view class="stat-label">消耗热量</view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="viewTrainingHistory">
        <view class="menu-icon">📊</view>
        <view class="menu-text">训练历史</view>
        <view class="menu-arrow">→</view>
      </view>
      <view class="menu-item" @click="viewAchievements">
        <view class="menu-icon">🏅</view>
        <view class="menu-text">我的成就</view>
        <view class="menu-arrow">→</view>
      </view>
      <view class="menu-item" @click="viewFavorites">
        <view class="menu-icon">❤️</view>
        <view class="menu-text">收藏夹</view>
        <view class="menu-arrow">→</view>
      </view>
      <view class="menu-item" @click="viewPlans">
        <view class="menu-icon">📋</view>
        <view class="menu-text">我的计划</view>
        <view class="menu-arrow">→</view>
      </view>
      <view class="menu-item" @click="viewBodyData">
        <view class="menu-icon">📏</view>
        <view class="menu-text">身体数据</view>
        <view class="menu-arrow">→</view>
      </view>
      <view class="menu-item" @click="viewSettings">
        <view class="menu-icon">⚙️</view>
        <view class="menu-text">设置</view>
        <view class="menu-arrow">→</view>
      </view>
    </view>

    <!-- 最近成就 -->
    <view class="achievements-section">
      <view class="section-header">
        <view class="section-title">最近成就</view>
        <view class="view-all" @click="viewAllAchievements">查看全部</view>
      </view>
      <view class="achievements-list">
        <view
          v-for="achievement in recentAchievements"
          :key="achievement.id"
          class="achievement-item"
        >
          <view class="achievement-icon">{{ achievement.icon }}</view>
          <view class="achievement-info">
            <view class="achievement-title">{{ achievement.title }}</view>
            <view class="achievement-desc">{{ achievement.description }}</view>
            <view class="achievement-date">{{ achievement.date }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <view class="bottom-nav">
      <view class="nav-item" @click="goToHome">
        <view class="nav-icon">🏠</view>
        <view class="nav-text">首页</view>
      </view>
      <view class="nav-item" @click="goToCalendar">
        <view class="nav-icon">📅</view>
        <view class="nav-text">计划</view>
      </view>
      <view class="nav-item" @click="goToCommunity">
        <view class="nav-icon">👥</view>
        <view class="nav-text">社区</view>
      </view>
      <view class="nav-item active">
        <view class="nav-icon">👤</view>
        <view class="nav-text">我的</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        avatar: '👤',
        name: '健身达人',
        level: 15,
        signature: '坚持训练，改变自己',
        exp: 2450,
        nextLevelExp: 3000,
        expToNext: 550
      },
      userStats: {
        totalTrainings: 89,
        totalTime: '156小时',
        achievements: 12,
        totalCalories: '45,320千卡'
      },
      recentAchievements: [
        {
          id: 1,
          icon: '🔥',
          title: '连续训练7天',
          description: '坚持不懈，保持良好习惯',
          date: '2天前'
        },
        {
          id: 2,
          icon: '💪',
          title: '力量提升',
          description: '卧推重量提升10kg',
          date: '1周前'
        },
        {
          id: 3,
          icon: '🏃‍♂️',
          title: '耐力突破',
          description: '跑步时间超过30分钟',
          date: '2周前'
        }
      ]
    };
  },
  computed: {
    expProgress() {
      return (this.userInfo.exp / this.userInfo.nextLevelExp) * 100;
    }
  },
  methods: {
    changeAvatar() {
      uni.showToast({
        title: '更换头像功能开发中',
        icon: 'none'
      });
    },
    editProfile() {
      uni.showToast({
        title: '编辑资料功能开发中',
        icon: 'none'
      });
    },
    openSettings() {
      this.viewSettings();
    },
    viewTrainingStats() {
      uni.navigateTo({
        url: '/frontend/statistics'
      });
    },
    viewTimeStats() {
      uni.showToast({
        title: '时长统计',
        icon: 'none'
      });
    },
    viewAchievementStats() {
      this.viewAchievements();
    },
    viewCalorieStats() {
      uni.showToast({
        title: '热量统计',
        icon: 'none'
      });
    },
    viewTrainingHistory() {
      uni.showToast({
        title: '训练历史功能开发中',
        icon: 'none'
      });
    },
    viewAchievements() {
      uni.showToast({
        title: '成就系统开发中',
        icon: 'none'
      });
    },
    viewAllAchievements() {
      this.viewAchievements();
    },
    viewFavorites() {
      uni.showToast({
        title: '收藏夹功能开发中',
        icon: 'none'
      });
    },
    viewPlans() {
      uni.showToast({
        title: '我的计划功能开发中',
        icon: 'none'
      });
    },
    viewBodyData() {
      uni.showToast({
        title: '身体数据功能开发中',
        icon: 'none'
      });
    },
    viewSettings() {
      uni.showActionSheet({
        itemList: ['账号设置', '隐私设置', '通知设置', '关于我们'],
        success: function (res) {
          const actions = ['账号设置', '隐私设置', '通知设置', '关于我们'];
          uni.showToast({
            title: `打开${actions[res.tapIndex]}`,
            icon: 'none'
          });
        }
      });
    },
    goToHome() {
      uni.switchTab({
        url: '/frontend/home'
      });
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
    }
  }
};
</script>

<style scoped>
.profile-container {
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

.header-center {
  flex: 1;
  text-align: center;
}

.page-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.settings-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 个人信息卡片 */
.profile-card {
  margin: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-section {
  position: relative;
  margin-right: 16px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
}

.user-info {
  flex: 1;
}

.user-name {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.user-level {
  color: #CCFF00;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.user-signature {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.edit-profile-btn {
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  cursor: pointer;
}

/* 经验进度 */
.exp-section {
  margin-top: 20px;
}

.exp-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.exp-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.exp-value {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.exp-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #CCFF00, #00D1FF);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.exp-remaining {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  text-align: center;
}

/* 统计数据 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 20px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.stat-value {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

/* 功能菜单 */
.menu-section {
  margin: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  width: 40px;
  font-size: 20px;
  margin-right: 16px;
}

.menu-text {
  color: #fff;
  font-size: 16px;
  flex: 1;
}

.menu-arrow {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

/* 最近成就 */
.achievements-section {
  margin: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.view-all {
  color: #00D1FF;
  font-size: 14px;
  cursor: pointer;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.achievement-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
}

.achievement-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
}

.achievement-info {
  flex: 1;
}

.achievement-title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.achievement-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 4px;
}

.achievement-date {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
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

.nav-item.active .nav-text {
  color: #CCFF00;
}

.nav-icon {
  font-size: 22px;
  transition: transform 0.3s ease;
}

.nav-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  transition: color 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-section {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .avatar-section {
    margin-right: 0;
    margin-bottom: 16px;
  }
}
</style>

