// 创建一个 Vue Composition API 实例
import { ref, onBeforeUnmount } from 'vue';
import { store } from '@/store/store.js'

let socket = null;
const messages = ref({});
const isConnected = ref(false);
const jwtToken = localStorage.getItem('token');

const createWebSocket = () => {
  socket = new WebSocket(process.env.VUE_APP_WS_URL);
  console.log('WebSocket connect...')

  socket.onopen = () => {
    //连接之后立即发送一个带token的请求让后端确认用户身份
    socket.send(JSON.stringify({"jwtToken": jwtToken}));
    isConnected.value = true;
  };

  socket.onclose = (event) => {
    console.log('websocket 断开: ' + event.code + ' ' + event.reason + ' ' + event.wasClean)
    isConnected.value = false;
    createWebSocket() //断开后自动重连
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    let fromUserId = message.fromUserId
    if (messages.value[fromUserId] == null) {
      messages.value[fromUserId] = [message];
    } else {
      messages.value[fromUserId].push(message)
    }
  };
}

const sendMessage = (message) => {
  if (isConnected.value) {
    //记录到本地变量
    message.fromUserId = store.currentUser.id
    if (messages.value[message.toUserId] == null) {
      messages.value[message.toUserId] = [message]
    } else {
      messages.value[message.toUserId].push(message);
    }

    //发送到服务器
    message.jwtToken = jwtToken
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
