<template>
  <div>
    <h1>WebSocket Chat</h1>
    <div v-if="isConnected">
      <div v-for="(message, index) in messages" :key="index">
        {{ message }}
      </div>
      <el-input
          v-model="newMessage"
          @keyup.enter="handleSendMessage"
          size="default"
          placeholder="Please Input"
          style="width: 300px; margin:3px"
      />
      <el-button type="success" @click="handleSendMessage">发送消息</el-button>
      <el-button type="danger"  @click="disconnectWebSocket">断开连接</el-button>
    </div>
    <div v-else>
      <p>WebSocket is not connected.</p>
      <el-button type="success" @click="connectWebSocket">开启连接</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useWebSocket } from '../api/WebSocketService';


const { messages, isConnected, sendMessage, connectWebSocket, disconnectWebSocket  } = useWebSocket();
const newMessage = ref('');

const handleSendMessage = () => {
  if (newMessage.value.trim() !== '') {
    sendMessage({ message: newMessage.value });
    newMessage.value = '';
  }
};
</script>

<style>
</style>
