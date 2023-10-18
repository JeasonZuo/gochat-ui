<template>
  <div class="common-layout" style="height: 100%;">
    <el-container style="height: 100%;">
      <el-header style="background: cornflowerblue;">
        <el-row :gutter="20">
          <el-col :span="6" :offset="20">
            <el-button type="danger" @click="logOutHandler" class="exit-btn">退出登陆</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px" style="background: antiquewhite;">
            Aside
        </el-aside>
        <el-main>
          <WebSocketChat></WebSocketChat>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import WebSocketChat from "@/components/WebSocketChat.vue";
import { useRouter } from 'vue-router';

export default {
  name: "BusinessPage",
  components: {WebSocketChat},
  setup() {
    const router = useRouter();
    const logOutHandler = () => {
      console.log("logOutHandler...")
      localStorage.removeItem('token')
      router.push('/login');
    }

    return {
      logOutHandler
    };
  }
}
</script>

<style scoped>
.exit-btn {
  margin-top: 10px;
}
</style>