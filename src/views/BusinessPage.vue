<template>
  <div class="common-layout">
    <el-container>
      <el-header style="background: #b5c4b1;">
        <el-row>
          <el-col :span="8"></el-col>
          <el-col :span="8">
            <el-avatar :src="store.currentUser.avatar_url"/>
            <strong style="margin-left: 10px;">{{store.currentUser.name}}</strong>
          </el-col>
          <el-col :span="2" :offset="6">
            <el-button type="danger" @click="logOutHandler" class="exit-btn">退出登陆</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px" style="background: #fffaf4;">
          <FriendList></FriendList>
        </el-aside>
        <el-main>
          <WebSocketChat></WebSocketChat>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import WebSocketChat from "@/components/WebSocketChat.vue";
import FriendList from "@/components/FriendList.vue";
import { useRouter } from 'vue-router';
import {onMounted} from "vue";
import {store} from "@/store/store";
import {getUserInfo} from "@/api/ApiService"
import {useWebSocket} from "@/api/WebSocketService"

const router = useRouter();
const { connectWebSocket } = useWebSocket()
const logOutHandler = () => {
  console.log("logOutHandler...")
  localStorage.removeItem('token')
  router.push('/login');
}

const callGetUserInfo = async () => {
  try {
    const response = await getUserInfo()
    console.log(response)
    if (response.code == 10000) {
      response.data.avatar_url = decodeURIComponent(response.data.avatar_url)
      store.currentUser = response.data
    }
  } catch (error) {
    console.error('Get user info error:', error)
  }
}

onMounted(() => {
  callGetUserInfo()
  connectWebSocket()
});
</script>

<style scoped>
.el-row {
  margin-top: 10px;
}
.el-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
.exit-btn {
  margin-top: 10px;
}
</style>