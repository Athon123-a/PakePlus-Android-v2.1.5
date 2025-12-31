<template>
  <view class="community-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-left">
        <button class="back-btn" @click="goBack">←</button>
      </view>
      <view class="header-center">
        <view class="page-title">健身社区</view>
      </view>
      <view class="header-right">
        <button class="post-btn" @click="createPost">+</button>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 社区动态 -->
      <view class="feed-section">
        <view class="section-header">
          <view class="section-title">最新动态</view>
          <view class="feed-filter">
            <view
              v-for="filter in feedFilters"
              :key="filter.value"
              class="filter-item"
              :class="{ active: selectedFilter === filter.value }"
              @click="selectFilter(filter.value)"
            >
              {{ filter.label }}
            </view>
          </view>
        </view>

        <!-- 动态列表 -->
        <view class="posts-list">
          <view
            v-for="post in posts"
            :key="post.id"
            class="post-item"
            @click="viewPostDetail(post)"
          >
            <view class="post-header">
              <view class="user-avatar">{{ post.userAvatar }}</view>
              <view class="post-info">
                <view class="user-name">{{ post.userName }}</view>
                <view class="post-time">{{ post.timeAgo }}</view>
              </view>
              <view class="post-menu" @click.stop="showPostMenu(post)">⋯</view>
            </view>

            <view class="post-content">
              <view class="post-text">{{ post.content }}</view>
              <view v-if="post.images && post.images.length" class="post-images">
                <image
                  v-for="(image, index) in post.images"
                  :key="index"
                  :src="image"
                  class="post-image"
                  mode="aspectFill"
                />
              </view>
            </view>

            <view class="post-stats">
              <view class="stat-item" @click.stop="likePost(post)">
                <text class="stat-icon">{{ post.liked ? '❤️' : '🤍' }}</text>
                <text class="stat-count">{{ post.likes }}</text>
              </view>
              <view class="stat-item" @click.stop="commentPost(post)">
                <text class="stat-icon">💬</text>
                <text class="stat-count">{{ post.comments }}</text>
              </view>
              <view class="stat-item" @click.stop="sharePost(post)">
                <text class="stat-icon">🔗</text>
                <text class="stat-count">{{ post.shares }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view class="load-more" @click="loadMorePosts">
          <text>加载更多动态</text>
        </view>
      </view>

      <!-- 排行榜 -->
      <view class="leaderboard-section">
        <view class="section-title">训练达人榜</view>
        <view class="leaderboard-list">
          <view
            v-for="(user, index) in leaderboard"
            :key="user.id"
            class="leaderboard-item"
          >
            <view class="rank-badge">{{ index + 1 }}</view>
            <view class="user-avatar">{{ user.avatar }}</view>
            <view class="user-info">
              <view class="user-name">{{ user.name }}</view>
              <view class="user-stats">{{ user.stats }}</view>
            </view>
            <view class="user-score">{{ user.score }}</view>
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
      <view class="nav-item active">
        <view class="nav-icon">👥</view>
        <view class="nav-text">社区</view>
      </view>
      <view class="nav-item" @click="goToProfile">
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
      selectedFilter: 'all',
      feedFilters: [
        { value: 'all', label: '全部' },
        { value: 'training', label: '训练' },
        { value: 'nutrition', label: '饮食' },
        { value: 'tips', label: '技巧' }
      ],
      posts: [
        {
          id: 1,
          userName: '健身小白',
          userAvatar: '🏃‍♂️',
          timeAgo: '2小时前',
          content: '今天完成了第一节HIIT训练，感觉太爽了！坚持就是胜利！💪',
          images: [],
          likes: 25,
          comments: 8,
          shares: 3,
          liked: false
        },
        {
          id: 2,
          userName: '肌肉达人',
          userAvatar: '💪',
          timeAgo: '4小时前',
          content: '分享一个训练小技巧：深蹲时注意膝盖不要超过脚尖，这样可以更好地保护膝关节。',
          images: [],
          likes: 42,
          comments: 15,
          shares: 8,
          liked: true
        },
        {
          id: 3,
          userName: '营养师小王',
          userAvatar: '🥗',
          timeAgo: '6小时前',
          content: '早餐吃什么很重要！推荐：全麦吐司 + 鸡蛋 + 水果 + 牛奶，营养均衡又饱腹！',
          images: [],
          likes: 38,
          comments: 12,
          shares: 5,
          liked: false
        }
      ],
      leaderboard: [
        { id: 1, name: '健身冠军', avatar: '🏆', stats: '本月训练 25 天', score: '1250' },
        { id: 2, name: '肌肉达人', avatar: '💪', stats: '累计训练 180 小时', score: '980' },
        { id: 3, name: '坚持者', avatar: '🔥', stats: '连续打卡 30 天', score: '750' }
      ]
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    createPost() {
      uni.showToast({
        title: '发帖功能开发中',
        icon: 'none'
      });
    },
    selectFilter(filter) {
      this.selectedFilter = filter;
      // 这里可以根据筛选条件重新加载数据
    },
    viewPostDetail(post) {
      uni.showToast({
        title: `查看动态详情`,
        icon: 'none'
      });
    },
    showPostMenu(post) {
      uni.showActionSheet({
        itemList: ['举报', '屏蔽用户'],
        success: function (res) {
          console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
        }
      });
    },
    likePost(post) {
      post.liked = !post.liked;
      if (post.liked) {
        post.likes++;
        uni.showToast({
          title: '点赞成功',
          icon: 'none'
        });
      } else {
        post.likes--;
      }
    },
    commentPost(post) {
      uni.showToast({
        title: '评论功能开发中',
        icon: 'none'
      });
    },
    sharePost(post) {
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      });
    },
    loadMorePosts() {
      uni.showToast({
        title: '加载更多动态',
        icon: 'none'
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
    goToProfile() {
      uni.navigateTo({
        url: '/frontend/profile'
      });
    }
  }
};
</script>

<style scoped>
.community-container {
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

.back-btn, .post-btn {
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

.back-btn:hover, .post-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 内容区域 */
.content {
  padding: 20px;
}

/* 动态筛选 */
.feed-section {
  margin-bottom: 30px;
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

.feed-filter {
  display: flex;
  gap: 8px;
}

.filter-item {
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-item.active {
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  color: #0a0a1a;
}

/* 动态列表 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 12px;
}

.post-info {
  flex: 1;
}

.user-name {
  color: #fff;
  font-weight: 600;
  margin-bottom: 4px;
}

.post-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.post-menu {
  color: rgba(255, 255, 255, 0.4);
  font-size: 20px;
  cursor: pointer;
}

.post-content {
  margin-bottom: 12px;
}

.post-text {
  color: #fff;
  line-height: 1.5;
  margin-bottom: 12px;
}

.post-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.post-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}

.post-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item:hover {
  opacity: 0.8;
}

.stat-icon {
  font-size: 16px;
}

.stat-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 16px;
  color: #00D1FF;
  cursor: pointer;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  margin-top: 16px;
}

.load-more:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 排行榜 */
.leaderboard-section {
  margin-top: 30px;
}

.leaderboard-list {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.leaderboard-item:last-child {
  border-bottom: none;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0a1a;
  font-weight: 700;
  margin-right: 12px;
}

.leaderboard-item:nth-child(2) .rank-badge {
  background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
}

.leaderboard-item:nth-child(3) .rank-badge {
  background: linear-gradient(135deg, #CD7F32, #A0522D);
}

.user-info {
  flex: 1;
  margin-left: 12px;
}

.user-stats {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.user-score {
  color: #CCFF00;
  font-weight: 600;
  font-size: 16px;
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
  .feed-filter {
    flex-wrap: wrap;
  }

  .filter-item {
    padding: 6px 12px;
    font-size: 12px;
  }

  .post-stats {
    gap: 16px;
  }
}
</style>

