<template>
  <view class="register-container">
    <view class="logo-section">
      <view class="logo-icon">🏋️‍♂️</view>
      <view class="register-title">注册账号</view>
      <view class="motivational-slogan">开启你的健身之旅</view>
    </view>
    
    <view class="input-group">
      <view class="input-label">用户名</view>
      <input 
        type="text" 
        class="input-field" 
        placeholder="请输入用户名（4-20个字符）"
        v-model="username"
        @input="handleUsernameInput"
        maxlength="20"
      />
    </view>

    <view class="input-group">
      <view class="input-label">密码</view>
      <input 
        type="password" 
        class="input-field" 
        placeholder="请输入密码（6-20个字符）"
        v-model="password"
        @input="handlePasswordInput"
        maxlength="20"
      />
    </view>

    <view class="input-group">
      <view class="input-label">确认密码</view>
      <input 
        type="password" 
        class="input-field" 
        placeholder="请再次输入密码"
        v-model="confirmPassword"
        @input="handleConfirmPasswordInput"
        maxlength="20"
      />
    </view>

    <view class="form-options">
      <label class="agree-terms" @click="toggleAgree">
        <checkbox-group @change="handleAgreeChange">
          <checkbox value="agree" :checked="agreeTerms" />
        </checkbox-group>
        <text>我已阅读并同意</text>
        <text class="terms-link" @click.stop="showTerms">《用户协议》</text>
      </label>
    </view>

    <button class="register-btn" @click="handleRegister">立即注册</button>

    <view class="extra-links">
      <text class="link" @click="goToLogin">已有账号？立即登录</text>
    </view>
  </view>
</template>

<script>
import API from './js/api.js';

export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    };
  },
  methods: {
    handleUsernameInput(e) {
      this.username = e.detail.value;
    },
    handlePasswordInput(e) {
      this.password = e.detail.value;
    },
    handleConfirmPasswordInput(e) {
      this.confirmPassword = e.detail.value;
    },
    toggleAgree() {
      this.agreeTerms = !this.agreeTerms;
    },
    handleAgreeChange(e) {
      this.agreeTerms = e.detail.value.length > 0;
    },
    async handleRegister() {
      // 表单验证
      if (!this.username.trim()) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      if (this.username.trim().length < 4) {
        uni.showToast({
          title: '用户名至少4个字符',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      if (!this.password.trim()) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      if (this.password.length < 6) {
        uni.showToast({
          title: '密码至少6个字符',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      if (this.password !== this.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      if (!this.agreeTerms) {
        uni.showToast({
          title: '请阅读并同意用户协议',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 调用真实的注册API
      console.log('尝试注册，用户名：', this.username);

      try {
        const response = await API.register(this.username.trim(), this.password.trim());

        if (response.code === 200) {
          // 注册成功后跳转到登录页
          uni.showToast({
            title: '注册成功，请使用账号登录',
            icon: 'success',
            duration: 2000,
            success: () => {
              setTimeout(() => {
                this.goToLogin();
              }, 1500);
            }
          });
        } else {
          // 注册失败
          uni.showToast({
            title: response.message || '注册失败，请稍后重试',
            icon: 'none',
            duration: 3000
          });
        }
      } catch (error) {
        console.error('注册请求失败:', error);
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
          duration: 3000
        });
      }
    },
    goToLogin() {
      console.log('返回登录页面');
      if (typeof uni !== 'undefined' && uni.navigateBack) {
        uni.navigateBack({
          fail: () => {
            // 如果返回失败，直接跳转到登录页
            uni.redirectTo({
              url: '/frontend/index'
            });
          }
        });
      } else if (typeof window !== 'undefined') {
        window.location.href = '/frontend/index.html';
      }
    },
    showTerms() {
      uni.showModal({
        title: '用户协议',
        content: '这是用户协议的内容示例。实际应用中应该展示完整的用户协议和隐私政策。',
        showCancel: false,
        confirmText: '我知道了'
      });
    }
  }
};
</script>

<style scoped>
.register-container {
  margin: 40px auto;
  background: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  transition: all 0.3s ease;
  position: relative;
}

/* 健身主题装饰条 */
.register-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #CCFF00, #00D1FF, #00b894, #6c5ce7);
  animation: gradientShift 5s ease infinite;
  background-size: 400% 100%;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.register-container:hover {
  box-shadow: 0 15px 45px rgba(0, 209, 255, 0.15);
}

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  font-size: 50px;
  margin-bottom: 15px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-7px);
  }
}

.register-title {
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #CCFF00;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
}

.motivational-slogan {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.input-label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  pointer-events: none;
}

.input-field {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  box-sizing: border-box;
  display: block;
  height: 44px;
  line-height: 1.5;
}

.input-field:focus {
  outline: none;
  border-color: #CCFF00;
  box-shadow: 0 0 0 3px rgba(204, 255, 0, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

input::placeholder,
.input-field::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-options {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
}

.agree-terms {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  flex-wrap: wrap;
}

.agree-terms checkbox {
  transform: scale(1.2);
}

.agree-terms text {
  color: rgba(255, 255, 255, 0.7);
}

.terms-link {
  color: #00D1FF !important;
  text-decoration: underline;
  cursor: pointer;
}

.terms-link:hover {
  color: #CCFF00 !important;
}

.register-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #CCFF00, #00D1FF);
  color: #121212;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(204, 255, 0, 0.3);
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
}

.register-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
    opacity: 0;
  }
  20% {
    opacity: 0.5;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(204, 255, 0, 0.4);
}

.register-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(204, 255, 0, 0.4);
}

.extra-links {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

.link {
  color: #00D1FF;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.link:hover {
  color: #CCFF00;
}

.link:active {
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .register-title {
    font-size: 1.5rem;
  }
  
  .motivational-slogan {
    font-size: 0.95rem;
  }
  
  .logo-icon {
    font-size: 45px;
  }
  
  .input-field,
  .register-btn {
    padding: 0.75rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 1.5rem 1.25rem;
    border-radius: 16px;
  }
  
  .register-title {
    font-size: 1.35rem;
  }
  
  .motivational-slogan {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
  
  .logo-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }
  
  .input-group {
    margin-bottom: 1.25rem;
  }
  
  .input-label {
    font-size: 0.85rem;
  }
}
</style>

