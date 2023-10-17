// 创建一个 Vue Composition API 实例
import { ref, onBeforeUnmount } from 'vue';

let socket = null;
// const socket = new WebSocket('ws://127.0.0.1:8001/ws');
const messages = ref([]);
const isConnected = ref(false);
const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InpqeCIsImV4cCI6MTcwMDEwODUzMywibmJmIjoxNjk3NTE2NTMzLCJpYXQiOjE2OTc1MTY1MzN9.r7R-WPQ62Ad54Hq4_GAIRNauZQLsabEYxfmWWyvsWus";

const createWebSocket = () => {
  socket = new WebSocket('ws://127.0.0.1:8001/ws');

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
    // const message = JSON.parse(event.data);
    const message = event.data;
    console.log(message)
    messages.value.push(message);
  };
}

const sendMessage = (message) => {
  if (isConnected.value) {
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
