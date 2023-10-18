// 创建一个 Vue Composition API 实例
import { ref, onBeforeUnmount } from 'vue';

let socket = null;
// const socket = new WebSocket('ws://127.0.0.1:8001/ws');
const messages = ref([]);
const isConnected = ref(false);
const jwtToken = localStorage.getItem('token');

const createWebSocket = () => {
  socket = new WebSocket('ws://127.0.0.1:8001/ws');
  console.log('WebSocket connect...')

  socket.onopen = () => {
    //连接之后立即发送一个带token的请求让后端确认用户身份
    socket.send(JSON.stringify({"jwtToken": jwtToken}));
    isConnected.value = true;
  };

  socket.onclose = (event) => {
    console.log('websocket 断开: ' + event.code + ' ' + event.reason + ' ' + event.wasClean)
    isConnected.value = false;
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log(message)
    messages.value.push(message.content);
  };
}

const sendMessage = (message) => {
  if (isConnected.value) {
    message.jwtToken = jwtToken
    console.log(jwtToken)
    socket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not connected.');
  }
};

const connectWebSocket = () => {
  if (!isConnected.value) {
    createWebSocket();
  }
};

const disconnectWebSocket = () => {
  if (isConnected.value) {
    socket.close();
  }
};

onBeforeUnmount(() => {
  socket.close();
});

export function useWebSocket() {
  return {
    messages,
    isConnected,
    sendMessage,
    connectWebSocket,
    disconnectWebSocket
  };
}
