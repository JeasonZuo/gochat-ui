<template>
  <div>
    <h1>WebSocket Chat</h1>
    <div v-if="isConnected">
      <div v-for="(message, index) in messages" :key="index">
        {{ message }}
      </div>
      <input v-model="newMessage" @keyup.enter="handleSendMessage" />
      <button @click="handleSendMessage">发送消息</button>
      <button @click="disconnectWebSocket">断开连接</button>
    </div>
    <div v-else>
      <p>WebSocket is not connected.</p>
      <button @click="connectWebSocket">开启连接</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useWebSocket } from '../api/WebSocketService';

export default {
  setup() {
    const { messages, isConnected, sendMessage, connectWebSocket, disconnectWebSocket  } = useWebSocket();
    const newMessage = ref('');

    const handleSendMessage = () => {
      if (newMessage.value.trim() !== '') {
        sendMessage({ message: newMessage.value });
        newMessage.value = '';
      }
    };

    return {
      messages,
      isConnected,
      newMessage,
      handleSendMessage,
      connectWebSocket,
      disconnectWebSocket,
    };
  },
};
</script>
