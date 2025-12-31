<template>
  <view class="statistics-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <button class="back-btn" @click="goBack">←</button>
      <h1 class="page-title">训练统计</h1>
      <button class="export-btn" @click="exportData">📊</button>
    </view>

    <view class="content">
      <!-- 时间筛选器 -->
      <view class="time-filter">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          class="filter-btn"
          :class="{ active: selectedPeriod === period.value }"
          @click="selectTimePeriod(period.value)"
        >{{ period.label }}</button>
      </view>

      <!-- 数据总览卡片 -->
      <view class="stats-overview">
        <view class="stat-card"
          v-for="(stat, index) in overviewStats" 
          :key="stat.key"
          :class="{ 'highlight': index === 0 }"
        >
          <view class="stat-icon">{{ stat.icon }}</view>
          <view class="stat-content">
            <view class="stat-value">{{ stat.value }}</view>
            <view class="stat-label">{{ stat.label }}</view>
            <view 
              class="stat-change" 
              :class="stat.isPositive ? 'positive' : 'negative'"
              v-if="stat.change !== null"
            >
              <span class="change-icon">{{ stat.isPositive ? '↑' : '↓' }}</span>
              <span class="change-value">{{ Math.abs(stat.change) }}</span>
              <span class="change-unit">% vs 上期</span>
            </view>
          </view>
        </view>
      </view>

      <!-- 图表区域 -->
      <view class="charts-section">
        <!-- 训练时长趋势图 -->
        <view class="chart-card">
          <view class="chart-header">
            <h3 class="chart-title">训练时长趋势</h3>
            <view class="chart-legend">
              <view class="legend-item">
                <view class="legend-color" style="background: #00D1FF;"></view>
                <span class="legend-text">训练时长(分钟)</span>
              </view>
            </view>
          </view>
          <view class="chart-container">
            <!-- 图表容器 -->
            <view class="bar-chart">
              <view class="chart-grid">
                <view class="chart-labels">
                  <view 
                    v-for="(item, index) in durationTrendData" 
                    :key="index"
                    class="chart-label"
                  >{{ item.label }}</view>
                </view>
                <view class="chart-bars">
                  <view 
                    v-for="(item, index) in durationTrendData" 
                    :key="index"
                    class="bar-wrapper"
                  >
                    <view 
                      class="bar"
                      :style="{ 
                        height: `${item.percentage}%`,
                        background: item.percentage > 0 ? 'linear-gradient(to top, #00D1FF, #0070F3)' : 'transparent'
                      }"
                    >
                      <view class="bar-value">{{ item.value }}</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 肌肉群分布饼图 -->
        <view class="chart-card">
          <view class="chart-header">
            <h3 class="chart-title">肌肉群训练分布</h3>
            <view class="chart-legend">
              <view 
                v-for="(group, index) in muscleGroupsData" 
                :key="index"
                class="legend-item"
              >
                <view class="legend-color" :style="{ background: group.color }"></view>
                <span class="legend-text">{{ group.name }}</span>
              </view>
            </view>
          </view>
          <view class="chart-container">
            <!-- 简化的饼图实现 -->
            <view class="pie-chart">
              <view class="pie-container">
                <!-- 简化的饼图用圆形表示 -->
              <view class="pie-simplified">
                  <view 
                    v-for="(group, index) in muscleGroupsData" 
                    :key="index"
                    class="pie-slice"
                    :style="{ 
                      backgroundColor: group.color,
                      opacity: 0.8
                    }"
                  >
                    <view class="slice-text">{{ group.percentage }}%</view>
                  </view>
                  <view class="pie-center">
                    <view class="center-icon">💪</view>
                  </view>
                </view>
                <view class="pie-legend">
                  <view 
                    v-for="(group, index) in muscleGroupsData" 
                    :key="index"
                    class="pie-legend-item"
                  >
                    <span class="legend-percentage">{{ group.percentage }}%</span>
                    <span class="legend-name">{{ group.name }}</span>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 训练历史记录 -->
      <view class="history-section">
        <view class="section-header">
          <h3 class="section-title">最近训练记录</h3>
          <button class="view-all-btn" @click="viewAllHistory">查看全部 ></button>
        </view>
        <view class="history-list">
          <view 
            v-for="(session, index) in recentSessions" 
            :key="index"
            class="history-item"
            @click="viewSessionDetails(session)"
          >
            <view class="history-icon">{{ session.icon }}</view>
            <view class="history-content">
              <view class="history-header">
                <view class="history-title">{{ session.title }}</view>
                <view class="history-duration">{{ session.duration }}分钟</view>
              </view>
              <view class="history-meta">
                <view class="history-date">{{ formatDate(session.date) }}</view>
                <view class="history-stats">
                  <view class="stat-dot">•</view>
                  <view class="stat-item">
                    <span class="stat-icon">🔥</span>
                    <span class="stat-value">{{ session.calories }}千卡</span>
                  </view>
                  <view class="stat-dot">•</view>
                  <view class="stat-item">
                    <span class="stat-icon">💪</span>
                    <span class="stat-value">{{ session.completedExercises }}个动作</span>
                  </view>
                </view>
              </view>
              <view class="history-progress">
                <view class="progress-bar">
                  <view 
                    class="progress-fill"
                    :style="{ width: `${session.completionRate}%` }"
                  ></view>
                </view>
                <view class="progress-text">完成率 {{ session.completionRate }}%</view>
              </view>
            </view>
            <view class="history-arrow">→</view>
          </view>
          <view v-if="recentSessions.length === 0" class="no-history">
            <view class="no-history-icon">📊</view>
            <view class="no-history-text">暂无训练记录</view>
            <view class="no-history-subtext">开始你的第一次训练，记录将显示在这里</view>
            <button class="start-training-btn" @click="goToHome">开始训练</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 数据导出弹窗 -->
    <view class="modal" v-if="showExportModal">
      <view class="modal-content">
        <view class="modal-header">
          <h3 class="modal-title">导出数据</h3>
          <button class="close-btn" @click="showExportModal = false">×</button>
        </view>
        <view class="modal-body">
          <view class="export-options">
            <button class="export-option" @click="exportAsCSV">
              <view class="option-icon">📊</view>
              <view class="option-text">导出为CSV文件</view>
            </button>
            <button class="export-option" @click="exportAsPDF">
              <view class="option-icon">📋</view>
              <view class="option-text">导出为PDF报告</view>
            </button>
            <button class="export-option" @click="shareStats">
              <view class="option-icon">📤</view>
              <view class="option-text">分享统计图表</view>
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载动画 -->
    <view class="loading" v-if="isLoading">
      <view class="loading-spinner"></view>
      <view class="loading-text">加载中...</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Statistics',
  data() {
    return {
      // 时间周期选项
      timePeriods: [
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '本年', value: 'year' }
      ],
      selectedPeriod: 'week',

      // 数据加载状态
      isLoading: false,

      // 数据导出弹窗
      showExportModal: false,

      // 概览数据
      overviewStats: [],

      // 训练时长趋势数据
      durationTrendData: [],

      // 肌肉群分布数据
      muscleGroupsData: [],

      // 最近训练记录
      recentSessions: []
    };
  },
  
  onLoad() {
    // 初始加载数据
    this.loadStatsData();
  },
  
  methods: {
    // 返回上一页
    goBack() {
      try {
        // 优先使用uni-app的导航
        if (typeof uni !== 'undefined') {
          uni.navigateBack();
        } else {
          // Web环境下的后备方案
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = '/frontend/home.html';
          }
        }
      } catch (error) {
        console.error('导航失败:', error);
        window.location.href = '/frontend/home.html';
      }
    },
    
    // 跳转到首页
    goToHome() {
      try {
        if (typeof uni !== 'undefined') {
          uni.navigateTo({ url: '/frontend/home' });
        } else {
          window.location.href = '/frontend/home.html';
        }
      } catch (error) {
        console.error('导航失败:', error);
        window.location.href = '/frontend/home.html';
      }
    },
    
    // 选择时间周期
    selectTimePeriod(period) {
      if (this.selectedPeriod !== period) {
        this.selectedPeriod = period;
        this.loadStatsData();
      }
    },
    
    // 加载统计数据
    loadStatsData() {
      this.isLoading = true;
      
      // 模拟数据加载
      setTimeout(() => {
        this.updateStatsData();
        this.isLoading = false;
      }, 500);
    },
    
    // 更新统计数据
    updateStatsData() {
      // 根据选择的时间周期更新数据
      const data = this.generateMockData(this.selectedPeriod);
      
      this.overviewStats = data.overview;
      this.durationTrendData = data.durationTrend;
      this.muscleGroupsData = data.muscleGroups;
      this.recentSessions = data.recentSessions;
    },
    
    // 生成模拟数据
    generateMockData(period) {
      // 根据不同的时间周期返回不同的模拟数据
      switch(period) {
        case 'week':
          return this.generateWeekData();
        case 'month':
          return this.generateMonthData();
        case 'year':
          return this.generateYearData();
        default:
          return this.generateWeekData();
      }
    },
    
    // 生成周数据
    generateWeekData() {
      const today = new Date();
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekData = [];
      
      // 生成最近7天的训练时长数据
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(today.getDate() - i);
        const randomMinutes = Math.floor(Math.random() * 90) + 15; // 15-105分钟
        weekData.push({
          label: days[day.getDay()],
          value: randomMinutes,
          percentage: randomMinutes * 100 / 120 // 假设最大120分钟
        });
      }
      
      return {
        overview: [
          { key: 'duration', icon: '⏱️', value: '5.2小时', label: '总训练时长', change: 15, isPositive: true },
          { key: 'calories', icon: '🔥', value: '3,245千卡', label: '消耗热量', change: 8, isPositive: true },
          { key: 'sessions', icon: '🏋️', value: '5次', label: '训练次数', change: -1, isPositive: false },
          { key: 'completion', icon: '✅', value: '85%', label: '计划完成率', change: 12, isPositive: true }
        ],
        durationTrend: weekData,
        muscleGroups: [
          { name: '腿部', percentage: 25, color: '#00D1FF' },
          { name: '背部', percentage: 20, color: '#CCFF00' },
          { name: '胸部', percentage: 30, color: '#FF4D4F' },
          { name: '手臂', percentage: 15, color: '#722ED1' },
          { name: '核心', percentage: 10, color: '#FA8C16' }
        ],
        recentSessions: [
          {
            id: '1',
            title: '全身力量训练',
            date: new Date(),
            duration: 60,
            calories: 420,
            completedExercises: 8,
            completionRate: 100,
            icon: '🏋️'
          },
          {
            id: '2',
            title: 'HIIT燃脂训练',
            date: new Date(Date.now() - 86400000), // 昨天
            duration: 30,
            calories: 350,
            completedExercises: 12,
            completionRate: 90,
            icon: '🔥'
          },
          {
            id: '3',
            title: '上肢力量训练',
            date: new Date(Date.now() - 172800000), // 前天
            duration: 45,
            calories: 310,
            completedExercises: 6,
            completionRate: 100,
            icon: '💪'
          },
          {
            id: '4',
            title: '有氧拉伸放松训练',
            date: new Date(Date.now() - 259200000), // 3天前
            duration: 50,
            calories: 280,
            completedExercises: 15,
            completionRate: 100,
            icon: '馃'
          }
        ]
      };
    },
    
    // 生成月数据
    generateMonthData() {
      // 简化的月度数据，实际应用中可以生成更详细的数据
      const weeks = ['第1周', '第2周', '第3周', '第4周'];
      const monthData = [];
      
      for (let i = 0; i < 4; i++) {
        const randomHours = Math.floor(Math.random() * 8) + 12; // 12-20小时
        monthData.push({
          label: weeks[i],
          value: randomHours + 'h',
          percentage: randomHours * 100 / 24 // 假设每周最大24小时
        });
      }
      
      return {
        overview: [
          { key: 'duration', icon: '⏱️', value: '18.5小时', label: '总训练时长', change: 7, isPositive: true },
          { key: 'calories', icon: '🔥', value: '12,500千卡', label: '消耗热量', change: -5, isPositive: false },
          { key: 'sessions', icon: '🏋️', value: '16次', label: '训练次数', change: 2, isPositive: true },
          { key: 'completion', icon: '✅', value: '80%', label: '计划完成率', change: 3, isPositive: true }
        ],
        durationTrend: monthData,
        muscleGroups: [
          { name: '腿部', percentage: 22, color: '#00D1FF' },
          { name: '背部', percentage: 23, color: '#CCFF00' },
          { name: '胸部', percentage: 28, color: '#FF4D4F' },
          { name: '手臂', percentage: 14, color: '#722ED1' },
          { name: '核心', percentage: 13, color: '#FA8C16' }
        ],
        recentSessions: [
          {
            id: '1',
            title: '全身力量训练',
            date: new Date(),
            duration: 60,
            calories: 420,
            completedExercises: 8,
            completionRate: 100,
            icon: '🏋️'
          },
          {
            id: '2',
            title: 'HIIT燃脂训练',
            date: new Date(Date.now() - 86400000),
            duration: 30,
            calories: 350,
            completedExercises: 12,
            completionRate: 90,
            icon: '🔥'
          },
          {
            id: '3',
            title: '上肢力量训练',
            date: new Date(Date.now() - 172800000),
            duration: 45,
            calories: 310,
            completedExercises: 6,
            completionRate: 100,
            icon: '💪'
          },
          {
            id: '4',
            title: '有氧拉伸放松训练',
            date: new Date(Date.now() - 259200000),
            duration: 50,
            calories: 280,
            completedExercises: 15,
            completionRate: 100,
            icon: '🧘'
          }
        ]
      };
    },
    
    // 生成年数据
    generateYearData() {
      // 简化的年度数据
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'];
      const yearData = [];
      
      for (let i = 0; i < 8; i++) {
        const randomHours = Math.floor(Math.random() * 20) + 40; // 40-60小时/月
        yearData.push({
          label: months[i],
          value: randomHours + 'h',
          percentage: randomHours * 100 / 80 // 假设每月最大80小时
        });
      }
      
      return {
        overview: [
          { key: 'duration', icon: '⏱️', value: '345小时', label: '总训练时长', change: 12, isPositive: true },
          { key: 'calories', icon: '🔥', value: '215,000千卡', label: '消耗热量', change: 8, isPositive: true },
          { key: 'sessions', icon: '🏋️', value: '186次', label: '训练次数', change: -4, isPositive: false },
          { key: 'completion', icon: '✅', value: '78%', label: '计划完成率', change: 6, isPositive: true }
        ],
        durationTrend: yearData,
        muscleGroups: [
          { name: '腿部', percentage: 24, color: '#00D1FF' },
          { name: '背部', percentage: 21, color: '#CCFF00' },
          { name: '胸部', percentage: 26, color: '#FF4D4F' },
          { name: '手臂', percentage: 16, color: '#722ED1' },
          { name: '核心', percentage: 13, color: '#FA8C16' }
        ],
        recentSessions: [
          {
            id: '1',
            title: '全身力量训练',
            date: new Date(),
            duration: 60,
            calories: 420,
            completedExercises: 8,
            completionRate: 100,
            icon: '🏋️'
          },
          {
            id: '2',
            title: 'HIIT燃脂训练',
            date: new Date(Date.now() - 86400000),
            duration: 30,
            calories: 350,
            completedExercises: 12,
            completionRate: 90,
            icon: '🔥'
          },
          {
            id: '3',
            title: '上肢力量训练',
            date: new Date(Date.now() - 172800000),
            duration: 45,
            calories: 310,
            completedExercises: 6,
            completionRate: 100,
            icon: '💪'
          },
          {
            id: '4',
            title: '有氧拉伸放松训练',
            date: new Date(Date.now() - 259200000),
            duration: 50,
            calories: 280,
            completedExercises: 15,
            completionRate: 100,
            icon: '🧘'
          }
        ]
      };
    },
    
    // 格式化日期
    formatDate(date) {
      const d = new Date(date);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      
      // 判断是否是今天或昨天
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const targetDate = new Date(d);
      targetDate.setHours(0, 0, 0, 0);
      
      if (targetDate.getTime() === today.getTime()) {
        return `今天 ${hours}:${minutes}`;
      } else if (targetDate.getTime() === yesterday.getTime()) {
        return `昨天 ${hours}:${minutes}`;
      } else {
        return `${month}/${day} ${hours}:${minutes}`;
      }
    },
    
    // 查看训练详情
    viewSessionDetails(session) {
      console.log('查看训练详情:', session);
      // 实际应用中应该跳转到训练详情页面
      this.showToast(`查看"${session.title}"的详细记录`);
    },
    
    // 查看全部历史
    viewAllHistory() {
      console.log('查看全部训练历史');
      this.showToast('查看全部训练历史记录');
      // 实际应用中应该跳转到完整的历史记录页面
    },
    
    // 导出数据
    exportData() {
      this.showExportModal = true;
    },
    
    // 导出为CSV
    exportAsCSV() {
      this.showExportModal = false;
      this.isLoading = true;
      
      // 模拟导出过程
      setTimeout(() => {
        this.isLoading = false;
        this.showToast('CSV文件已导出');
        console.log('导出CSV数据:', this.selectedPeriod);
      }, 1000);
    },
    
    // 导出为PDF
    exportAsPDF() {
      this.showExportModal = false;
      this.isLoading = true;
      
      // 模拟导出过程
      setTimeout(() => {
        this.isLoading = false;
        this.showToast('PDF报告已生成');
        console.log('导出PDF报告:', this.selectedPeriod);
      }, 1500);
    },
    
    // 分享统计图表
    shareStats() {
      this.showExportModal = false;
      this.showToast('分享功能开发中');
      console.log('分享统计数据:', this.selectedPeriod);
    },
    
    // 显示提示
    showToast(message, duration = 2000) {
      try {
        // 优先使用uni-app的提示
        if (typeof uni !== 'undefined') {
          uni.showToast({
            title: message,
            icon: 'none',
            duration: duration
          });
        } else {
          // Web环境下的后备方案
          const toast = document.createElement('div');
          toast.className = 'toast';
          toast.textContent = message;
          document.body.appendChild(toast);
          toast.style.display = 'block';
          
          setTimeout(() => {
            toast.style.display = 'none';
            document.body.removeChild(toast);
          }, duration);
        }
      } catch (error) {
        console.error('Toast显示失败:', error);
        alert(message);
      }
    }
  }
};
</script>

<style scoped>
.statistics-container {
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
  min-height: 100vh;
  color: #fff;
  position: relative;
}

/* 页面导航栏 */
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
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  flex: 1;
  text-align: center;
}

.export-btn {
  background: rgba(204, 255, 0, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn:hover {
  background: rgba(204, 255, 0, 0.3);
}

/* 内容区域 */
.content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 时间筛选器 */
.time-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: center;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 10px 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.filter-btn.active {
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  border-color: transparent;
  color: #121212;
}

/* 数据总览卡片 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.stat-card.highlight {
  background: linear-gradient(135deg, rgba(204, 255, 0, 0.1), rgba(0, 209, 255, 0.1));
  border-color: rgba(204, 255, 0, 0.3);
}

.stat-icon {
  font-size: 32px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.stat-change {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: #52C41A;
}

.stat-change.negative {
  color: #F5222D;
}

.change-icon {
  margin-right: 2px;
}

.change-value {
  margin-right: 2px;
}

.change-unit {
  opacity: 0.8;
}

/* 图表区域 */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 柱状图样式 */
.bar-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-grid {
  display: flex;
  flex: 1;
  align-items: flex-end;
}

.chart-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 16px;
  width: 40px;
}

.chart-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-bottom: 20px;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 20px;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
}

.bar {
  width: 100%;
  border-radius: 8px 8px 0 0;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
  transition: height 0.5s ease;
}

.bar-value {
  font-size: 11px;
  color: #fff;
  font-weight: 600;
}

/* 饼图样式 */
.pie-chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
}

.pie-simplified {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.pie-slice {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: center;
}

.pie-center {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.center-icon {
  font-size: 32px;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pie-legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-percentage {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  min-width: 30px;
}

/* 训练历史记录 */
.history-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.view-all-btn {
  background: transparent;
  border: none;
  color: #00D1FF;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px 0;
}

.view-all-btn:hover {
  color: #CCFF00;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.history-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  flex-shrink: 0;
}

.history-content {
  flex: 1;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.history-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.history-duration {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.history-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.history-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-dot {
  font-size: 6px;
  color: rgba(255, 255, 255, 0.4);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.stat-icon {
  font-size: 14px;
}

.history-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00D1FF, #CCFF00);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  min-width: 80px;
}

.history-arrow {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

/* 无训练记录 */
.no-history {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.no-history-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-history-text {
  font-size: 16px;
  color: #fff;
  margin-bottom: 8px;
}

.no-history-subtext {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
}

.start-training-btn {
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #121212;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-training-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(204, 255, 0, 0.3);
}

/* 导出弹窗 */
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
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #0a0a1a;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #fff;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-option {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.option-icon {
  font-size: 20px;
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

/* Toast样式 */
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 9999;
  display: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 16px;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stats-overview {
    grid-template-columns: 1fr 1fr;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .pie-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .pie-simplified {
    width: 150px;
    height: 150px;
  }
  
  .pie-legend {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 12px;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .time-filter {
    flex-direction: column;
  }
  
  .filter-btn {
    text-align: center;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .chart-legend {
    flex-wrap: wrap;
  }
  
  .history-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .history-icon {
    align-self: center;
  }
  
  .history-progress {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .progress-text {
    min-width: auto;
  }
  
  .modal-content {
    padding: 20px;
  }
}
</style>
