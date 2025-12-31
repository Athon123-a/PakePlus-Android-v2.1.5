<template>
  <!-- 页面背景 -->
  <view class="page-background">
    <!-- 装饰性元素 -->
    <view class="background-decoration"></view>

    <view class="login-container">
    <view class="login-title">用户登录</view>
    <view class="motivational-slogan">今天的付出，明天的改变！</view>

    <!-- 消息提示区域 -->
    <view v-if="message.text" class="message" :class="message.type">
      {{ message.text }}
    </view>

    <view class="input-group">
      <view class="input-label">用户名</view>
      <input
        type="text"
        class="input-field"
        :class="{ error: usernameError }"
        placeholder="请输入用户名"
        v-model="username"
        @input="handleUsernameInput"
        @focus="onFocus"
        @blur="onBlur"
        @click="onClick"
        confirm-type="next"
      />
      <view v-if="usernameError" class="error-message">{{ usernameError }}</view>
    </view>

    <view class="input-group">
      <view class="input-label">密码</view>
      <input
        :type="passwordVisible ? 'text' : 'password'"
        class="input-field"
        :class="{ error: passwordError }"
        placeholder="请输入密码"
        v-model="password"
        @input="handlePasswordInput"
        @focus="onFocus"
        @blur="onBlur"
        @click="onClick"
        confirm-type="done"
      />
      <view class="password-toggle" @click="togglePasswordVisibility">
        {{ passwordVisible ? '👁️‍🗨️' : '👁️' }}
      </view>
      <view v-if="passwordError" class="error-message">{{ passwordError }}</view>
    </view>

    <view class="remember-me">
      <uni-checkbox :checked="rememberMe" @change="handleRememberMeChange" />
      <text @click="toggleRememberMe">记住我</text>
    </view>

    <button class="login-btn" @click="handleLogin" :disabled="isLoading">
      {{ isLoading ? '登录中...' : '立即登录' }}
    </button>

    <view class="extra-links">
      <text class="link" @click="showForgotPasswordForm">忘记密码？</text>
      <text class="link" @click="goToRegister">注册新账号</text>
    </view>
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
      rememberMe: false,
      isLoading: false,
      passwordVisible: false,
      usernameError: '',
      passwordError: '',
      message: {
        text: '',
        type: 'success'
      }
    };
  },
  mounted() {
    // 从本地存储恢复记住的用户名
    try {
      const rememberedUsername = localStorage.getItem('rememberedUsername');
      if (rememberedUsername) {
        this.username = rememberedUsername;
        this.rememberMe = true;
      }
    } catch (error) {
      console.warn('无法读取本地存储:', error);
    }
  },
  methods: {
    // 显示消息函数
    showMessage(text, type = 'success') {
      this.message.text = text;
      this.message.type = type;

      // 3秒后自动隐藏消息
      setTimeout(() => {
        this.message.text = '';
      }, 3000);
    },

    // 切换密码可见性
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },

    // 处理用户名输入
    handleUsernameInput(e) {
      this.username = e.detail.value;
      this.validateUsername();
    },

    // 处理密码输入
    handlePasswordInput(e) {
      this.password = e.detail.value;
      this.validatePassword();
    },

    // 调试事件
    onFocus(e) {
      console.log('Input focused:', e);
    },
    onBlur(e) {
      console.log('Input blurred:', e);
    },
    onClick(e) {
      console.log('Input clicked:', e);
    },

    // 用户名验证
    validateUsername() {
      if (!this.username.trim()) {
        this.usernameError = '';
        return;
      }

      if (this.username.trim().length < 3 || this.username.trim().length > 20) {
        this.usernameError = '用户名长度应在3-20个字符之间';
      } else {
        this.usernameError = '';
      }
    },

    // 密码验证
    validatePassword() {
      if (!this.password) {
        this.passwordError = '';
        return;
      }

      if (this.password.length < 6) {
        this.passwordError = '密码长度至少为6个字符';
      } else {
        this.passwordError = '';
      }
    },

    toggleRememberMe() {
      this.rememberMe = !this.rememberMe;
    },
    handleRememberMeChange(e) {
      this.rememberMe = e.detail.value.length > 0;
    },
    async handleLogin() {
      // 验证输入
      this.validateUsername();
      this.validatePassword();

      if (!this.username.trim()) {
        this.showMessage('请输入用户名', 'error');
        return;
      }

      if (!this.password.trim()) {
        this.showMessage('请输入密码', 'error');
        return;
      }

      if (this.usernameError || this.passwordError) {
        return;
      }

      // 防止重复点击
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;

      try {
        console.log('尝试登录，用户名：', this.username);

        // 调用登录API
        const response = await API.login(this.username.trim(), this.password.trim(), this.rememberMe);

        if (response.code === 200) {
          // 如果勾选了记住我，保存用户名
          try {
            if (this.rememberMe) {
              localStorage.setItem('rememberedUsername', this.username);
            } else {
              localStorage.removeItem('rememberedUsername');
            }
          } catch (error) {
            console.warn('无法保存到本地存储:', error);
          }

          // 显示成功消息
          this.showMessage('登录成功！正在跳转到首页...', 'success');

          // 延迟跳转到首页
          setTimeout(() => {
            this.navigateToHome();
          }, 1500);
        } else {
          this.showMessage(response.message || '登录失败，请检查用户名和密码', 'error');
        }
      } catch (error) {
        console.error('登录失败:', error);
        this.showMessage(error.message || '登录失败，请稍后重试', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    navigateToHome() {
      console.log('跳转到首页');
      if (typeof uni !== 'undefined' && uni.navigateTo) {
        // uni-app环境
        uni.navigateTo({
          url: '/frontend/home',
          success: () => {
            console.log('成功跳转到首页');
          },
          fail: (err) => {
            console.error('首页跳转失败:', err);
            // Web环境的备用方案
            if (typeof window !== 'undefined') {
              window.location.href = 'home.html';
            }
          }
        });
      } else if (typeof window !== 'undefined') {
        // Web环境
        window.location.href = 'home.html';
      }
    },
    goToRegister() {
      console.log('跳转到注册页面');
      if (typeof uni !== 'undefined' && uni.navigateTo) {
        uni.navigateTo({
          url: '/frontend/register',
          fail: (err) => {
            console.error('注册页面跳转失败:', err);
            this.showMessage('注册功能正在开发中', 'error');
          }
        });
      } else if (typeof window !== 'undefined') {
        window.location.href = 'register.html';
      }
    },
    showForgotPasswordForm() {
      console.log('显示忘记密码功能');
      this.showMessage('忘记密码功能正在开发中', 'error');
    }
  }
};
</script>

<style scoped>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

/* 页面背景 */
.page-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #00b894 0%, #00cec9 50%, #74b9ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 添加装饰性元素 */
.page-background::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.3)"/></svg>') repeat;
  opacity: 0.3;
  z-index: 0;
  animation: float 30s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(5%, 5%) rotate(1deg); }
  50% { transform: translate(0, 10%) rotate(0deg); }
  75% { transform: translate(-5%, 5%) rotate(-1deg); }
}

/* 登录容器 */
.login-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2.5rem 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

/* 健身主题装饰条 */
.login-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #00b894, #00cec9, #0984e3, #6c5ce7);
  animation: gradientShift 5s ease infinite;
  background-size: 400% 100%;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.login-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
}

.login-title {
  color: #2c405a;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
}

.login-title::after {
  content: '';
  display: block;
  width: 50px;
  height: 4px;
  background: #00b894;
  margin: 10px auto 0;
  border-radius: 2px;
}

/* 健身励志标语 */
.motivational-slogan {
  text-align: center;
  color: #00b894;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 2rem;
  font-style: italic;
}

.input-group {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 5;
}

.input-label {
  display: block;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-field {
  width: 100%;
  height: 44px;
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  box-sizing: border-box;
  position: relative;
  z-index: 10;
  pointer-events: auto;
  cursor: text;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.input-field:focus {
  outline: none;
  border-color: #00b894;
  box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
  transform: translateY(-1px);
}

.input-field.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 2.5rem;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #00b894;
}

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}

.login-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(to right, #00b894, #00cec9);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
  margin-top: 1rem;
}

.login-btn:hover {
  background: linear-gradient(to right, #00cec9, #00b894);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 184, 148, 0.4);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(0, 184, 148, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.extra-links {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
}

.link {
  color: #00b894;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
  color: #00cec9;
  transform: translateX(2px);
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background-color: rgba(0, 184, 148, 0.1);
  color: #00b894;
  border: 1px solid rgba(0, 184, 148, 0.3);
}

.message.error {
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

/* 添加响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .motivational-slogan {
    font-size: 1rem;
  }

  .input-field,
  .login-btn {
    padding: 0.75rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem 1.25rem;
    border-radius: 16px;
  }

  .login-title {
    font-size: 1.35rem;
    margin-bottom: 1.5rem;
  }

  .motivational-slogan {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  .input-group {
    margin-bottom: 1.25rem;
  }

  .input-label {
    font-size: 0.85rem;
  }

  .extra-links {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
}
</style>