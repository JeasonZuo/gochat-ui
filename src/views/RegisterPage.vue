<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="registerHandler">
      <input type="text" v-model="username" placeholder="Username">
      <input type="password" v-model="password" placeholder="Password">
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { register } from '../api/apiService';
import { useRouter } from 'vue-router';

export default {
  name: "RegisterPage",
  setup() {
    const username = ref('');
    const password = ref('');
    const router = useRouter();

    const registerHandler = async () => {
      try {
        const response = await register({
          username: username.value,
          password: password.value,
        });
        // 处理注册成功后的逻辑
        if (response.code == 10000) {
          await router.push('/login');
        } else {
          alert(response.msg)
        }
      } catch (error) {
        console.error('Registration failed:', error);
      }
    };

    return {
      username,
      password,
      registerHandler,
    };
  },
};
</script>
