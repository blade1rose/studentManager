<template>
    <div class="register-container">
      <div class="register-card">
        <h2 class="register-title">创建账户</h2>
        <form @submit.prevent="handleRegister" class="register-form">
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
          
          <button type="submit" class="submit-button">注册</button>
        </form>
        
        <p class="error-message" v-if="error">{{ error }}</p>
        
        <div class="login-link">
          已有账户？<router-link to="/login">立即登录</router-link>
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
  const router = useRouter()
  
  const handleRegister = async () => {
    error.value = ''
    try {
      const response = await axios.post('/api/auth/register', {
        account: account.value,
        password: password.value
      })
      if (response.data.status === 'success') {
        alert('注册成功')
        router.push('/login')
      }
    } catch (err) {
      error.value = err.response?.data?.error || '注册失败'
    }
  }
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
  }
  
  .register-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    padding: 40px;
    transition: all 0.3s ease;
  }
  
  .register-title {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
    font-size: 28px;
    font-weight: 600;
  }
  
  .register-form {
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
  
  .submit-button {
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
  }
  
  .submit-button:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(52, 152, 219, 0.4);
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
  
  .login-link {
    text-align: center;
    color: #7f8c8d;
    margin-top: 20px;
    font-size: 15px;
  }
  
  .login-link a {
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .login-link a:hover {
    color: #2980b9;
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    .register-card {
      padding: 30px;
      width: 90%;
    }
  }
  </style>
