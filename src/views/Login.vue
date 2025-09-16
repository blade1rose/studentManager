<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">欢迎登录</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input 
            v-model="account" 
            placeholder=" "
            class="form-input"
            required 
          />
          <label class="form-label">账号</label>
          <span class="input-highlight"></span>
        </div>
        <div class="form-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder=" "
            class="form-input"
            required 
          />
          <label class="form-label">密码</label>
          <span class="input-highlight"></span>
        </div>
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="!loading">登 录</span>
          <span v-else class="loading-text">
            <span class="loading-dots"></span> 登录中
          </span>
        </button>
      </form>
      
      <p class="error-message" v-if="error">{{ error }}</p>
      
      <div class="register-link">
        还没有账户？<router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const account = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const response = await axios.post('/api/auth/login', {
      account: account.value,
      password: password.value
    })
    
    if (response.data.status === 'success') {
      // 模拟成功登录状态 - 前端认证
      sessionStorage.setItem('isAuthenticated', 'true');
      
      // 检查是否有重定向路径
      const redirect = router.currentRoute.value.query.redirect;
      
      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/score');
      }
    } else {
      error.value = response.data.error || '登录失败，请重试';
    }
  } catch (err) {
    if (err.response) {
      // 有响应但状态码错误
      error.value = err.response.data?.error || `登录失败: ${err.response.status} ${err.response.statusText}`;
    } else if (err.request) {
      // 请求已发出但无响应
      error.value = '服务器无响应，请检查网络连接';
    } else {
      // 其他错误
      error.value = '登录请求失败: ' + err.message;
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.login-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 40px;
  transition: all 0.3s ease;
}

.login-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  position: relative;
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  height: 50px;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  padding: 8px 0;
  font-size: 16px;
  background-color: transparent;
  transition: border-color 0.3s;
  position: relative;
  z-index: 2;
}

.form-input:focus {
  outline: none;
  border-color: transparent;
}

.form-input:focus ~ .input-highlight {
  width: 100%;
}

.form-input:focus ~ .form-label,
.form-input:not(:placeholder-shown) ~ .form-label {
  top: -18px;
  left: 0;
  font-size: 14px;
  color: #3498db;
}

.input-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background-color: #3498db;
  transition: width 0.4s ease;
  z-index: 1;
}

.form-label {
  position: absolute;
  top: 15px;
  left: 0;
  color: #777;
  font-size: 16px;
  transition: all 0.3s ease;
  pointer-events: none;
}

.login-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  letter-spacing: 2px;
  height: 50px;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.4);
}

.login-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin: 20px 0;
  font-weight: 500;
  background: rgba(231, 76, 60, 0.1);
  padding: 12px;
  border-radius: 6px;
}

.register-link {
  text-align: center;
  color: #7f8c8d;
  margin-top: 20px;
  font-size: 15px;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.register-link a:hover {
  color: #2980b9;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px;
    width: 90%;
  }
}

/* 加载动画效果 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-dots::after {
  content: '•';
  animation: pulse 1.5s infinite;
  animation-delay: 0.1s;
}

.loading-dots::before {
  content: '•';
  animation: pulse 1.5s infinite;
  animation-delay: 0.3s;
  margin-right: 4px;
}

.loading-dots::after {
  content: '•';
  animation: pulse 1.5s infinite;
  animation-delay: 0.5s;
  margin-left: 4px;
}
</style>
