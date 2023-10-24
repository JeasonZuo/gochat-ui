<template>
  <div class="chat-window" v-show="showChatWindow" >
    <div v-if="isConnected" class="chat-window">
      <div class="message-window">
        <el-scrollbar ref="scrollbarRef" always>
          <div ref="scrollbarInnerDiv">
            <div v-for="(message, index) in currentMessages"
                 :key="index"
                 class="scrollbar-item"
                 :class="[message.fromUserId == store.currentUser.id ? 'my-msg' : 'friend-msg']"
            >
              <div class="msg-content">
                {{ message.content }}
              </div>
            </div>
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
      </div>
    </div>
    <div v-else>
      <p>WebSocket is not connected.</p>
      <el-button type="success" @click="connectWebSocket">重新连接</el-button>
    </div>
  </div>
  <div v-show="!showChatWindow">
    <h1>TT chat</h1>
    <h1>先去加一个好友吧</h1>
  </div>
</template>

<script setup>
import { ref,watch,nextTick,onMounted } from "vue";
import { useWebSocket } from '@/api/WebSocketService'
import { store } from '@/store/store'
import { getMessageList } from '@/api/ApiService'

const newMessage = ref('')
const currentMessages = ref([])
const { messages, isConnected, sendMessage, connectWebSocket } = useWebSocket()
const scrollbarRef = ref(null)
const scrollbarInnerDiv = ref(null)
const showChatWindow = ref(false)

const handleSendMessage = () => {
  if (newMessage.value.trim() !== '') {
    sendMessage({
      content: newMessage.value,
      toUserId: store.focusFriendId
    });
    newMessage.value = ''
  }
};

const loadUserMessage = async (focusUserId) => {
  if (messages.value[focusUserId] == undefined) {
    messages.value[focusUserId] = []
  }

  //加载历史记录
  const response = await getMessageList({"toUserId": focusUserId})
  if (response.code == 10000) {
    response.data.forEach(item => {
      item.fromUserId = item.from_user_id,
          item.toUserId = item.to_user_id
    })
    messages.value[focusUserId] = response.data
  }

  currentMessages.value = messages.value[focusUserId]
}

watch(
    () => store.focusFriendId,
    (focusUserId) => {
      if (focusUserId == 0) {
        showChatWindow.value = false
      } else {
        showChatWindow.value = true
      }
      loadUserMessage(focusUserId)
    }
)

watch (currentMessages,
    async () => {
      if (scrollbarRef.value != null) {
        await nextTick()
        scrollbarRef.value.setScrollTop(scrollbarInnerDiv.value.clientHeight)
      }
    },
    { deep: true }
)

onMounted(() => {
  if (store.focusFriendId == 0) {
    showChatWindow.value = false
  } else {
    showChatWindow.value = true
    loadUserMessage(store.focusFriendId)
  }
})
</script>

<style scoped>
.chat-window {
  height: 100%;
}
.message-window {
  height: 90%;
  overflow: auto;
}
.scrollbar-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  color: var(--el-color-primary);
}
.my-msg {
  justify-content: flex-end;
}
.my-msg .msg-content  {
  background: #A9EA7A;
}
.friend-msg {
  justify-content: flex-start;
}
.friend-msg .msg-content  {
  background: whitesmoke;
}
.msg-content {
  justify-content: left;
  text-align: left;
  margin: 0 20px 0 20px;
  padding: 5px 10px;
  max-width: 50%;
  border-radius: 6px;
  word-wrap: break-word;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  color: #11170C;
}
</style>
