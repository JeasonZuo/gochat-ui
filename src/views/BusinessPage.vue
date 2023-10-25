<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="8"></el-col>
          <el-col :span="8">
            <el-avatar :src="store.currentUser.avatar_url"/>
            <div style="margin-left: 10px;">
              <strong>{{store.currentUser.name}}</strong>
              <p style="margin:0">TT number: {{store.currentUser.id + 100000}}</p>
            </div>
          </el-col>
          <el-col :span="2" :offset="6">
            <el-button type="danger" @click="logOutHandler" class="exit-btn">退出登陆</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <FriendList ref="friendListRef"></FriendList>
        </el-aside>
        <el-main>
          <WebSocketChat></WebSocketChat>
        </el-main>
        <el-aside width="50px">
          <el-scrollbar>
            <img class='tool-icon'
                 :src="require('@/assets/edit_user.svg')"
                 alt="修改信息"
                 style="width: 25px;"
                 @click="editInfoDialogVisible = true"
            >
            <img class='tool-icon'
                 :src="require('@/assets/add_friend.svg')"
                 alt="添加好友"
                 style="width: 30px;"
                 @click="addFriendDialogVisible = true"
            >
          </el-scrollbar>
        </el-aside>
      </el-container>
    </el-container>
    <el-dialog
        v-model="addFriendDialogVisible"
        title="添加好友"
        width="30%"
    >
      <span>TT number:</span>
      <el-input v-model="ttNumber" style="width: 50%; margin-left: 10px;"></el-input>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="addFriendDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addFriendHandler">
          确认
        </el-button>
      </span>
      </template>
    </el-dialog>
    <el-dialog
        v-model="editInfoDialogVisible"
        title="修改信息"
        width="30%"
    >
      <p>
        <span>昵称:</span>
        <el-input v-model="nickname" style="width: 50%; margin-left: 10px;"></el-input>
      </p>
      <p>
        <span>头像链接:</span>
        <el-input v-model="avatarUrl" style="width: 50%; margin-left: 10px;"></el-input>
      </p>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="editInfoDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUserHandler">
          确认
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import WebSocketChat from "@/components/WebSocketChat.vue";
import FriendList from "@/components/FriendList.vue";
import { useRouter } from 'vue-router';
import { onMounted, ref } from "vue";
import { store } from "@/store/store";
import {addFriend, getUserInfo, editUser} from "@/api/ApiService"
import { useWebSocket } from "@/api/WebSocketService"
import {ElMessage} from "element-plus";

const nickname = ref('')
const avatarUrl = ref('')
const editInfoDialogVisible = ref(false)
const ttNumber = ref('')
const addFriendDialogVisible = ref(false)
const friendListRef = ref(null)
const router = useRouter();
const { connectWebSocket } = useWebSocket()


const logOutHandler = () => {
  console.log("logOutHandler...")
  localStorage.removeItem('token')
  router.push('/login');
}

const addFriendHandler = async () => {
  const response = await addFriend({"tt_number": ttNumber.value})
  if (response.code == 10000) {
    addFriendDialogVisible.value = false
    ttNumber.value = ''
    ElMessage.success('添加成功')
    await friendListRef.value.getFriendListFunc(false)
  } else {
    ElMessage.error(response.msg)
  }
}

const editUserHandler = async () => {
  const response = await editUser({
    "name": nickname.value,
    "avatar_url": avatarUrl.value,
  })
  if (response.code == 10000) {
    editInfoDialogVisible.value = false
    ElMessage.success('修改成功')
    await callGetUserInfo()
  } else {
    ElMessage.error(response.msg)
  }
}

const callGetUserInfo = async () => {
  try {
    const response = await getUserInfo()
    console.log(response)
    if (response.code == 10000) {
      response.data.avatar_url = decodeURIComponent(response.data.avatar_url)
      store.currentUser = response.data
      nickname.value = response.data.name
      avatarUrl.value = response.data.avatar_url
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
.el-container
{
  overflow: hidden;
}
.el-main
{
  overflow: hidden;
}
.el-header {
  background: #b5c4b1;
}
.el-aside {
  background: #fffaf4;
}
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
.tool-icon {
  margin-top: 10px;
}
</style>