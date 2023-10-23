<template>
  <div class="login-container">
    <h1>TT Chat</h1>
    <form @submit.prevent="loginHandler">
      <div>
        <el-input
            v-model="tt_number"
            size="default"
            placeholder="TT号"
            style="width: 300px; margin:3px"
        />
      </div>
      <div>
        <el-input
            v-model="password"
            size="default"
            placeholder="密码"
            show-password
            style="width: 300px; margin:3px"
            maxlength="20"
            @change="checkPasswordLength"
        />
      </div>
      <div class="btn-div">
        <el-button type="success" @click="loginHandler" size="large" :disabled="is_login_btn_disabled">登录</el-button>
        <el-button type="primary" @click="toRegisterPage" size="large">注册</el-button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import { login } from '../api/ApiService';
import { useRouter } from 'vue-router';
import {ElMessage} from "element-plus";

const tt_number = ref('');
const password = ref('');
const is_login_btn_disabled = ref(true);
const router = useRouter();

const loginHandler = async () => {
  try {
    const response = await login({
      tt_number: tt_number.value,
      password: password.value,
    });
    console.log(response)
    if (response.code != 10000) {
      ElMessage.error(response.msg)
    } else {
      const token = response.data.token;
      // 将JWT令牌存储在本地
      localStorage.setItem('token', token);
      // 跳转到业务页面
      router.push('/business');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const toRegisterPage = () => {
  router.push('/register');
}

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    router.push('/business');
  }
});

const checkPasswordLength  = (e) => {
  if (e.length < 6) {
    ElMessage.warning('密码长度至少6位')
  }
}

watch (
    () => tt_number.value === '' || password.value === '',
    (isLoginBtnDisable) => {
      is_login_btn_disabled.value = isLoginBtnDisable
    }
)

</script>

<style scoped>
  .btn-div {
    margin-top: 10px;
  }
  .login-container {
    margin-top: 200px;
  }
</style>
