<template>
  <view class="ai-assistant-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <button class="back-btn" @click="goBack">←</button>
      <h1 class="page-title">AI训练助手</h1>
      <view class="header-actions">
        <button class="action-btn" @click="showHelpModal = true">❓</button>
        <button class="action-btn" @click="showSettingsModal = true">⚙️</button>
      </view>
    </view>

    <view class="content">
      <!-- 会话列表 -->
      <view class="chat-container">
        <scroll-view class="chat-list" scroll-y="true" :scroll-into-view="scrollToMessage" scroll-with-animation="true">
          <!-- 欢迎消息 -->
          <view class="message-item ai-message" v-if="messages.length === 0">
            <view class="message-avatar ai-avatar">🤖</view>
            <view class="message-content">
              <view class="message-bubble ai-bubble">
                <p class="message-text">你好！我是你的AI训练助手，很高兴为你提供帮助。有什么关于训练的问题都可以问我。</p>
                <view class="quick-questions">
                  <button 
                    v-for="(question, index) in quickQuestions" 
                    :key="index"
                    class="quick-question-btn"
                    @click="sendQuickQuestion(question)"
                  >{{ question }}</button>
                </view>
              </view>
              <view class="message-time">{{ formatTime(new Date()) }}</view>
            </view>
          </view>

          <!-- 消息列表 -->
          <view 
            v-for="(message, index) in messages" 
            :key="message.id || index"
            :id="`message-${index}`"
            class="message-item" 
            :class="message.sender === 'user' ? 'user-message' : 'ai-message'"
          >
            <view class="message-avatar" :class="message.sender === 'user' ? 'user-avatar' : 'ai-avatar'">
              {{ message.sender === 'user' ? '👤' : '🤖' }}</view>
            <view class="message-content">
              <view class="message-bubble" :class="message.sender === 'user' ? 'user-bubble' : 'ai-bubble'">
                <!-- 普通文本消息 -->
                <view v-if="!message.isTrainingPlan" v-html="formatMessageText(message.content)">
                </view>
                <!-- 训练计划消息 -->
                <view v-else class="training-plan">
                  <view class="plan-header">
                    <h3 class="plan-title">{{ message.content.title }}</h3>
                    <view class="plan-meta">
                      <view class="meta-item">
                        <span class="meta-icon">⏱️</span>
                        <span class="meta-text">{{ message.content.duration }}分钟</span>
                      </view>
                      <view class="meta-item">
                        <span class="meta-icon">🏋️</span>
                        <span class="meta-text">{{ message.content.level }}</span>
                      </view>
                    </view>
                  </view>
                  <view class="plan-exercises">
                    <view 
                      v-for="(exercise, exIndex) in message.content.exercises" 
                      :key="exIndex"
                      class="exercise-plan-item"
                    >
                      <view class="exercise-number">{{ exIndex + 1 }}</view>
                      <view class="exercise-details">
                        <view class="exercise-name">{{ exercise.name }}</view>
                        <view class="exercise-sets">
                          {{ exercise.sets }} 组 × {{ exercise.reps }} 次
                          <template v-if="exercise.restTime">（休息 {{ exercise.restTime }} 秒）</template>
                        </view>
                        <template v-if="exercise.notes">
                          <view class="exercise-notes">{{ exercise.notes }}</view>
                        </template>
                      </view>
                    </view>
                  </view>
                  <view class="plan-footer">
                    <button class="action-button primary" @click="startTraining(message.content)">开始训练</button>
                    <button class="action-button secondary" @click="saveTrainingPlan(message.content)">保存计划</button>
                  </view>
                </view>
              </view>
              <view class="message-time">{{ formatTime(message.timestamp) }}</view>
            </view>
          </view>

          <!-- 加载中指示器 -->
          <view v-if="isLoading" class="typing-indicator">
            <view class="message-avatar ai-avatar">🤖</view>
            <view class="message-bubble ai-bubble typing-bubble">
              <view class="typing-dots">
                <view class="dot"></view>
                <view class="dot"></view>
                <view class="dot"></view>
              </view>
            </view>
          </view>
        </scroll-view>

        <!-- 输入区域 -->
        <view class="input-container">
          <view class="input-wrapper">
            <input 
              class="message-input"
              v-model="inputMessage"
              placeholder="输入你的问题..."
              @keyup.enter="sendMessage"
              :disabled="isLoading"
              maxlength="500"
            />
            <view class="char-count">{{ inputMessage.length }}/500</view>
          </view>
          <button class="send-btn" @click="sendMessage" :disabled="!inputMessage.trim() || isLoading">发送</button>
        </view>
      </view>

      <!-- 帮助弹窗 -->
      <view class="modal" v-if="showHelpModal">
        <view class="modal-content">
          <view class="modal-header">
            <h3 class="modal-title">使用帮助</h3>
            <button class="close-btn" @click="showHelpModal = false">✕</button>
          </view>
          <view class="modal-body">
            <view class="help-section">
              <h4 class="help-title">我能帮你做什么？</h4>
              <ul class="help-list">
                <li>生成个性化训练计划</li>
                <li>回答训练动作的正确姿势和技巧</li>
                <li>提供营养和恢复建议</li>
                <li>解答健身疑惑和问题</li>
                <li>分析训练效果并给出优化建议</li>
              </ul>
            </view>
            <view class="help-section">
              <h4 class="help-title">提问小贴士</h4>
              <ul class="help-list">
                <li>尽量详细描述你的健身目标和当前情况</li>
                <li>指定你想要训练的部位或肌群</li>
                <li>告诉助手你的训练经验水平（初级/中级/高级）</li>
                <li>如果有伤病或特殊需求请提前告知</li>
              </ul>
            </view>
          </view>
        </view>
      </view>

      <!-- 设置弹窗 -->
      <view class="modal" v-if="showSettingsModal">
        <view class="modal-content">
          <view class="modal-header">
            <h3 class="modal-title">设置</h3>
            <button class="close-btn" @click="showSettingsModal = false">✕</button>
          </view>
          <view class="modal-body">
            <view class="setting-item">
              <label class="setting-label">重置对话历史</label>
              <button class="danger-btn" @click="confirmResetChat">重置对话</button>
            </view>
            <view class="setting-item">
              <label class="setting-label">清除缓存数据</label>
              <button class="danger-btn" @click="clearCache">清除缓存</button>
            </view>
            <view class="setting-item">
              <label class="setting-label">语言设置</label>
              <view class="language-select">
                <button 
                  v-for="lang in languages" 
                  :key="lang.code"
                  class="language-btn"
                  :class="{ active: selectedLanguage === lang.code }"
                  @click="selectLanguage(lang.code)"
                >{{ lang.name }}</button>
              </view>
            </view>
            <view class="version-info">
              <span>版本 1.0.0</span>
            </view>
          </view>
        </view>
      </view>

      <!-- 确认弹窗 -->
      <view class="modal" v-if="showConfirmModal">
        <view class="modal-content">
          <h3 class="modal-title">{{ confirmModal.title }}</h3>
          <p class="modal-message">{{ confirmModal.message }}</p>
          <view class="modal-actions">
            <button class="modal-btn cancel" @click="showConfirmModal = false">取消</button>
            <button class="modal-btn confirm" @click="confirmModal.callback()">确定</button>
          </view>
        </view>
      </view>

      <!-- 加载动画 -->
      <view class="loading" v-if="showFullLoading">
        <view class="loading-spinner"></view>
        <view class="loading-text">{{ loadingText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AIAssistant',
  data() {
    return {
      // 聊天消息列表
      messages: [],
      // 输入框内容
      inputMessage: '',
      // 加载状态
      isLoading: false,
      // 是否显示全屏加载
      showFullLoading: false,
      loadingText: '',
      // 聊天列表滚动位置
      scrollToMessage: '',
      // 快速问题选项
      quickQuestions: [
        '生成一个30分钟的全身训练计划',
        '如何正确做深蹲？',
        '锻炼后如何合理饮食？',
        '如何增加肌肉量？'
      ],
      // 语言选项
      languages: [
        { code: 'zh-CN', name: '中文' },
        { code: 'en-US', name: 'English' }
      ],
      selectedLanguage: 'zh-CN',
      // 弹窗控制
      showHelpModal: false,
      showSettingsModal: false,
      showConfirmModal: false,
      confirmModal: {
        title: '',
        message: '',
        callback: null
      }
    };
  },
  
  mounted() {
    // 从本地存储加载聊天历史
    this.loadChatHistory();
    
    // 监听键盘事件
    this.setupKeyboardListeners();
  },
  
  beforeUnmount() {
    // 清理键盘事件监听
    this.removeKeyboardListeners();
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
    
    // 发送消息
    sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading) {
        return;
      }
      
      const userMessage = this.inputMessage.trim();
      this.inputMessage = '';
      
      // 添加用户消息到列表
      const newUserMessage = {
        id: Date.now().toString(),
        content: userMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      this.messages.push(newUserMessage);
      
      // 滚动到底部
      this.$nextTick(() => {
        const lastIndex = this.messages.length - 1;
        this.scrollToMessage = `message-${lastIndex}`;
      });
      
      // 显示加载状态
      this.isLoading = true;
      
      // 保存聊天历史
      this.saveChatHistory();
      
      // 模拟AI回复（实际应用中应该调用API）
      setTimeout(() => {
        this.generateAIResponse(userMessage);
      }, 800);
    },
    
    // 发送快速问题
    sendQuickQuestion(question) {
      this.inputMessage = question;
      this.sendMessage();
    },
    
    // 生成AI回复
    generateAIResponse(userMessage) {
      let aiResponse = '';
      let isTrainingPlan = false;
      
      // 根据用户消息内容决定回复类型
      if (userMessage.includes('训练计划') || userMessage.includes('健身计划')) {
        // 生成训练计划类型的回复
        aiResponse = this.generateMockTrainingPlan();
        isTrainingPlan = true;
      } else if (userMessage.includes('深蹲')) {
        // 深蹲动作指导
        aiResponse = '<h3>深蹲技巧指导</h3>\n\n<p><strong>正确姿势：</strong></p>\n<ul>\n<li>双脚与肩同宽，脚尖稍微向外</li>\n<li>挺胸收腹，保持背部挺直</li>\n<li>下蹲时，臀部向后坐，膝盖自然弯曲</li>\n<li>膝盖不应超过脚尖太多</li>\n<li>下蹲到大腿与地面平行或更低</li>\n<li>利用臀部和大腿力量推起</li>\n</ul>\n\n<p><strong>注意事项：</strong></p>\n<ul>\n<li>始终保持背部挺直，避免弯腰驼背</li>\n<li>下蹲过程中膝盖应跟随脚尖方向</li>\n<li>开始时从轻重量或无重量练习</li>\n<li>如果膝盖疼痛，应立即停止并咨询专业人士</li>\n</ul>';
      } else if (userMessage.includes('饮食') || userMessage.includes('营养')) {
        // 营养建议
        aiResponse = '<h3>锻炼后的营养建议</h3>\n\n<p><strong>理想的恢复餐组成：</strong></p>\n<ul>\n<li><strong>蛋白质：</strong>有助于肌肉修复和生长，建议摄入20-40克</li>\n<li><strong>碳水化合物：</strong>补充糖原，比例约为蛋白质的1.5-2倍</li>\n<li><strong>水分：</strong>补充训练中流失的水分</li>\n<li><strong>健康脂肪：</strong>适量添加，有助于激素平衡</li>\n</ul>\n\n<p><strong>推荐食物：</strong></p>\n<ul>\n<li>鸡胸肉配糙米饭和蔬菜</li>\n<li>希腊酸奶配水果和坚果</li>\n<li>全麦面包配鸡蛋和牛油果</li>\n<li>蛋白质奶昔配香蕉</li>\n</ul>\n\n<p><strong>时间：</strong>最好在训练后30-60分钟内进食</p>';
      } else if (userMessage.includes('肌肉量')) {
        // 增肌建议
        aiResponse = '<h3>增加肌肉量的关键策略</h3>\n\n<p><strong>训练原则：</strong></p>\n<ul>\n<li><strong>渐进超负荷：</strong>逐渐增加重量或重复次数</li>\n<li><strong>复合动作：</strong>优先进行深蹲、硬拉、卧推等多关节动作</li>\n<li><strong>训练频率：</strong>每个肌群每周训练2-3次</li>\n<li><strong>训练量：</strong>每个肌群每周10-20组</li>\n<li><strong>休息时间：</strong>大重量训练间休息2-3分钟</li>\n</ul>\n\n<p><strong>营养要点：</strong></p>\n<ul>\n<li><strong>热量盈余：</strong>每天摄入比消耗多250-500卡路里</li>\n<li><strong>蛋白质摄入：</strong>每公斤体重1.6-2.2克蛋白质</li>\n<li><strong>碳水化合物：</strong>提供训练能量</li>\n<li><strong>健康脂肪：</strong>支持激素产生</li>\n</ul>\n\n<p><strong>恢复：</strong>保证充足睡眠，每天7-9小时</p>';
      } else {
        // 默认回复
        aiResponse = `谢谢你的提问！${userMessage}是一个很好的问题。根据我的理解，我建议你可以考虑以下几点：\n\n1. 设定明确的目标和计划\n2. 保持一致性和耐心\n3. 结合适合自己的训练方式\n4. 注意营养和恢复\n\n如果你有更具体的问题，欢迎随时告诉我！`;
      }
      
      // 添加AI回复到列表
      const newAiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        isTrainingPlan: isTrainingPlan
      };
      
      this.messages.push(newAiMessage);
      this.isLoading = false;
      
      // 滚动到底部
      this.$nextTick(() => {
        const lastIndex = this.messages.length - 1;
        this.scrollToMessage = `message-${lastIndex}`;
      });
      
      // 保存聊天历史
      this.saveChatHistory();
    },
    
    // 生成模拟训练计划
    generateMockTrainingPlan() {
      return {
        title: '30分钟全身高效训练计划',
        duration: 30,
        level: '中级',
        exercises: [
          {
            name: '哑铃深蹲',
            sets: 3,
            reps: '12',
            restTime: 60,
            notes: '保持背部挺直，下蹲至大腿与地面平行'
          },
          {
            name: '俯卧撑',
            sets: 3,
            reps: '15',
            restTime: 45,
            notes: '可以使用膝盖着地的方式降低难度'
          },
          {
            name: '哑铃划船',
            sets: 3,
            reps: '12',
            restTime: 60,
            notes: '每侧单独做，感受背部发力'
          },
          {
            name: '箭步蹲',
            sets: 3,
            reps: '10',
            restTime: 45,
            notes: '每侧各做一次算一个完整动作'
          },
          {
            name: '平板支撑',
            sets: 2,
            reps: '45秒',
            restTime: 30,
            notes: '保持核心收紧，不要塌腰'
          }
        ]
      };
    },
    
    // 格式化消息文本（支持简单的HTML标签）
    formatMessageText(text) {
      if (typeof text === 'string') {
        // 将换行符转换为<br>
        return text.replace(/\n/g, '<br>');
      }
      return text;
    },
    
    // 格式化时间
    formatTime(date) {
      const now = new Date(date);
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    
    // 保存聊天历史
    saveChatHistory() {
      try {
        localStorage.setItem('aiChatHistory', JSON.stringify(this.messages));
      } catch (error) {
        console.error('保存聊天历史失败:', error);
      }
    },
    
    // 加载聊天历史
    loadChatHistory() {
      try {
        const savedHistory = localStorage.getItem('aiChatHistory');
        if (savedHistory) {
          this.messages = JSON.parse(savedHistory).map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp) // 转换时间戳
          }));
        }
      } catch (error) {
        console.error('加载聊天历史失败:', error);
        this.messages = [];
      }
    },
    
    // 确认重置聊天
    confirmResetChat() {
      this.showConfirmation({
        title: '重置对话',
        message: '确定要清除所有对话历史吗？此操作无法撤销。',
        callback: this.resetChat
      });
    },
    
    // 重置聊天
    resetChat() {
      this.messages = [];
      this.saveChatHistory();
      this.showConfirmModal = false;
      this.showToast('对话历史已重置');
    },
    
    // 清除缓存
    clearCache() {
      try {
        localStorage.removeItem('aiChatHistory');
        this.messages = [];
        this.showToast('缓存已清除');
      } catch (error) {
        console.error('清除缓存失败:', error);
        this.showToast('清除缓存失败');
      }
    },
    
    // 选择语言
    selectLanguage(languageCode) {
      this.selectedLanguage = languageCode;
      // 实际应用中可能需要重新加载页面或更新翻译
      this.showToast(`语言已切换为${languageCode === 'zh-CN' ? '中文' : 'English'}`);
    },
    
    // 开始训练
    startTraining(plan) {
      this.showFullLoading = true;
      this.loadingText = '准备训练...';
      
      // 模拟准备训练的过程
      setTimeout(() => {
        this.showFullLoading = false;
        
        // 这里应该跳转到训练执行页面，现在只显示提示
        this.showToast(`开始执行「${plan.title}」训练计划`);
        
        // 实际应用中跳转到训练页面
        console.log('跳转到训练执行页面:', plan);
      }, 1500);
    },
    
    // 保存训练计划
    saveTrainingPlan(plan) {
      // 模拟保存计划的过程
      this.showFullLoading = true;
      this.loadingText = '保存计划...';
      
      setTimeout(() => {
        this.showFullLoading = false;
        this.showToast(`「${plan.title}」训练计划已保存`);
        
        // 实际应用中可能需要将计划保存到数据库
        console.log('保存训练计划:', plan);
        
        // 可能需要跳转到计划管理页面
      }, 1000);
    },
    
    // 显示确认弹窗
    showConfirmation(options) {
      this.confirmModal = {
        title: options.title || '确认操作',
        message: options.message || '确定要执行此操作吗？',
        callback: () => {
          this.showConfirmModal = false;
          if (options.callback) {
            options.callback();
          }
        }
      };
      this.showConfirmModal = true;
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
    },
    
    // 设置键盘事件监听
    setupKeyboardListeners() {
      try {
        document.addEventListener('keydown', this.handleKeyDown);
      } catch (error) {
        console.error('设置键盘监听失败:', error);
      }
    },
    
    // 移除键盘事件监听
    removeKeyboardListeners() {
      try {
        document.removeEventListener('keydown', this.handleKeyDown);
      } catch (error) {
        console.error('移除键盘监听失败:', error);
      }
    },
    
    // 处理键盘事件
    handleKeyDown(event) {
      // 按Ctrl+Enter发送消息
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        this.sendMessage();
        event.preventDefault();
      }
    }
  }
};
</script>

<style scoped>
.ai-assistant-container {
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
  min-height: 100vh;
  color: #fff;
  display: flex;
  flex-direction: column;
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

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 主内容区 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 0 20px;
}

/* 聊天容器 */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 聊天列表 */
.chat-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.chat-list::-webkit-scrollbar {
  width: 4px;
}

.chat-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.chat-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.chat-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 消息项 */
.message-item {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-message {
  flex-direction: row-reverse;
}

.ai-message {
  flex-direction: row;
}

/* 头像 */
.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 12px;
  font-size: 18px;
}

.user-avatar {
  background: linear-gradient(135deg, #00D1FF, #0070F3);
}

.ai-avatar {
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  color: #121212;
}

/* 消息内容 */
.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.user-message .message-content {
  align-items: flex-end;
}

.ai-message .message-content {
  align-items: flex-start;
}

/* 消息气泡 */
.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  word-break: break-word;
}

.user-bubble {
  background: linear-gradient(135deg, #00D1FF, #0070F3);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.ai-bubble {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 4px;
}

/* 消息文本 */
.message-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* 快速问题按钮 */
.quick-questions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-question-btn {
  background: rgba(204, 255, 0, 0.1);
  border: 1px solid rgba(204, 255, 0, 0.3);
  border-radius: 20px;
  padding: 6px 12px;
  color: #CCFF00;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-question-btn:hover {
  background: rgba(204, 255, 0, 0.2);
  border-color: rgba(204, 255, 0, 0.5);
}

/* 训练计划样式 */
.training-plan {
  width: 100%;
}

.plan-header {
  margin-bottom: 16px;
}

.plan-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #fff;
}

.plan-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.meta-icon {
  font-size: 14px;
}

.plan-exercises {
  margin-bottom: 16px;
}

.exercise-plan-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;
}

.exercise-number {
  width: 24px;
  height: 24px;
  background: rgba(204, 255, 0, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #CCFF00;
  flex-shrink: 0;
}

.exercise-details {
  flex: 1;
}

.exercise-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #fff;
}

.exercise-sets {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.exercise-notes {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.plan-footer {
  display: flex;
  gap: 12px;
}

.action-button {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.primary {
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  border: none;
  color: #121212;
}

.action-button.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(204, 255, 0, 0.3);
}

.action-button.secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.action-button.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

/* 消息时间 */
.message-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

.user-message .message-time {
  margin-right: 12px;
}

.ai-message .message-time {
  margin-left: 12px;
}

/* 输入区域 */
.input-container {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: rgba(10, 10, 26, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.input-wrapper {
  flex: 1;
  position: relative;
  margin-right: 12px;
}

.message-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 12px 16px;
  color: #fff;
  font-size: 14px;
  resize: none;
  min-height: 48px;
  max-height: 120px;
  transition: all 0.3s ease;
}

.message-input:focus {
  outline: none;
  border-color: rgba(204, 255, 0, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.char-count {
  position: absolute;
  bottom: -16px;
  right: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.send-btn {
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #121212;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(204, 255, 0, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 加载中指示器 */
.typing-indicator {
  display: flex;
  margin-bottom: 20px;
}

.typing-bubble {
  padding: 12px 20px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: typing 1.4s infinite both;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-4px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.3; }
}

/* 弹窗样式 */
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
  max-height: 80vh;
  overflow-y: auto;
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

.modal-body {
  margin-bottom: 16px;
}

.help-section {
  margin-bottom: 20px;
}

.help-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin: 0 0 12px 0;
}

.help-list {
  margin: 0;
  padding-left: 20px;
}

.help-list li {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  line-height: 1.4;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

.danger-btn {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 6px;
  padding: 8px 16px;
  color: #EF4444;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.danger-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.6);
}

.language-select {
  display: flex;
  gap: 8px;
}

.language-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 8px 16px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-btn.active {
  background: linear-gradient(135deg, rgba(204, 255, 0, 0.2), rgba(0, 209, 255, 0.2));
  border-color: rgba(204, 255, 0, 0.5);
}

.language-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
}

.version-info {
  text-align: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.version-info span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.modal-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn.cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.modal-btn.cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  border: none;
  color: #121212;
}

.modal-btn.confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(204, 255, 0, 0.3);
}

/* 全屏加载 */
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
  .message-content {
    max-width: 85%;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .chat-list {
    padding: 16px;
  }
  
  .message-avatar {
    width: 36px;
    height: 36px;
    margin: 0 8px;
    font-size: 16px;
  }
  
  .message-bubble {
    padding: 10px 14px;
  }
  
  .input-container {
    padding: 12px 16px;
  }
  
  .message-input {
    min-height: 44px;
  }
  
  .send-btn {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .modal-content {
    padding: 20px;
  }
}
</style>