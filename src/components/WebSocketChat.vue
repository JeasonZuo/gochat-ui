<template>
  <div v-if="isConnected" style="height: 100%;">
    <div  class="chat-window">
      <el-scrollbar>
        <div v-for="(message, index) in messages"
             :key="index"
             class="scrollbar-demo-item"
        >
          {{ message }}
        </div>
      </el-scrollbar>
    </div>
    <div>
      <el-input
          v-model="newMessage"
          @keyup.enter="handleSendMessage"
          size="large"
          placeholder="Please Input"
          style="width: 60%; margin:10px"
      />
      <el-button type="success" @click="handleSendMessage" size="large">发送消息</el-button>
      <el-button type="danger"  @click="disconnectWebSocket" size="large">断开连接</el-button>
    </div>
  </div>
  <div v-else>
    <p>WebSocket is not connected.</p>
    <el-button type="success" @click="connectWebSocket">重新连接</el-button>
  </div>
</template>

<script setup>
import { ref,watch } from "vue";
import { useWebSocket } from '../api/WebSocketService'
import { store } from '../store/store.js'

const newMessage = ref('')
const { messages, isConnected, sendMessage, connectWebSocket, disconnectWebSocket  } = useWebSocket()

const handleSendMessage = () => {
  if (newMessage.value.trim() !== '') {
    sendMessage({ content: newMessage.value, toUserId: store.focusFriendId });
    newMessage.value = ''
  }
};

watch(
    () => store.focusFriendId,
    () => {
      messages.value = []
    }
)
</script>

<style scoped>
.chat-window {
  height: 90%;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
