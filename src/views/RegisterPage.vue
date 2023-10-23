<template>
  <div class="register-container">
    <div v-show="is_show_register">
      <h1>注册新账号</h1>
      <form @submit.prevent="registerHandler">
        <div><el-input type="text" v-model="name" placeholder="昵称" /></div>
        <div><el-input type="text" v-model="avatar_url" placeholder="头像链接" /></div>
        <div>
          <el-input
              type="password"
              v-model="password"
              placeholder="密码"
              show-password
              @keyup="checkPwd"
              minlength=6
              maxlength=20
              show-word-limit
              @change="checkPasswordLength"
          />
        </div>
        <div>
          <el-input
            type="password"
            v-model="confirm_password"
            placeholder="再输入一次密码"
            @keyup="checkPwd"
            show-password
            minlength=6
            maxlength=20
            show-word-limit
            @change="checkPasswordLength"
          />
          <p v-show="is_confirm_pwd_error">两次输入的密码不一致</p>
        </div>
      </form>
      <div>
        <el-button
            type="success"
            size="large"
            class="btn"
            :disabled="is_register_btn_disable"
            @click="registerHandler"
        >注册</el-button>
      </div>
    </div>
    <div v-show="!is_show_register">
      <h2>您的TT号是: {{ tt_number }}, 用于登录请妥善保存</h2>
    </div>
    <div>
      <div>
        <el-button type="primary" @click="toLoginPage" size="large" class="btn">返回登录页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,watch } from 'vue';
import { register } from '../api/ApiService';
import { useRouter } from 'vue-router';
import {ElMessage} from "element-plus";

const name = ref('');
const avatar_url = ref('');
const password = ref('');
const confirm_password = ref('');
const is_show_register = ref(true);
const is_confirm_pwd_error = ref(false);
const is_register_btn_disable = ref(true);
const tt_number = ref('');
const router = useRouter();

const registerHandler = async () => {
  try {
    const response = await register({
      name: name.value,
      avatar_url: avatar_url.value,
      password: password.value,
      confirm_password: confirm_password.value,
    });
    // 处理注册成功后的逻辑
    if (response.code == 10000) {
      tt_number.value = response.data.tt_number
      is_show_register.value = false
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

const toLoginPage = () => {
  router.push('/login');
}

const checkPwd = () => {
  if (password.value === confirm_password.value || confirm_password.value === '') {
    is_confirm_pwd_error.value = false
  } else {
    is_confirm_pwd_error.value = true
  }
}

const checkPasswordLength  = (e) => {
  if (e.length < 6) {
    ElMessage.warning('密码长度至少6位')
  }
}

watch (
    () => name.value === '' || avatar_url.value === '' || password.value === '' || confirm_password.value === '' || is_confirm_pwd_error.value,
    (isRegisterBtnDisable) => {
      is_register_btn_disable.value = isRegisterBtnDisable
    }
)

</script>

<style scoped>
.el-input {
  width: 300px;
  margin:3px;
}
.btn {
  width: 300px;
  margin-top: 20px;
}
.register-container {
  margin-top: 200px;
}
</style>
