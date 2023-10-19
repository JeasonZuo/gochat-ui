<template>
  <div>
    <h1>Login</h1>
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
        />
      </div>
      <el-button type="success" @click="loginHandler">Login</el-button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { login } from '../api/ApiService';
import { useRouter } from 'vue-router';
import {ElMessage} from "element-plus";

export default {
  name: 'LoginPage',
  setup() {
    const tt_number = ref('');
    const password = ref('');
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

    onMounted(() => {
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/business');
      }
    });

    return {
      tt_number,
      password,
      loginHandler,
    };
  },
};
</script>
