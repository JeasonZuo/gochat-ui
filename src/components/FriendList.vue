<template>
  <el-scrollbar v-if="friendList.length > 0">
      <div v-for="item in friendList"
           :key="item.id" class="friend-item"
           @click="clickOnFriend(item.id)"
           :class="{ 'btnActive' : item.id == focusFriendId  }"
      >
        <div class="avatar">
          <el-avatar shape="square" :size="50" :src="item.avatar_url"/>
        </div>
        <div class="friend-name">
          <strong>{{ item.name }}</strong>
        </div>
      </div>
  </el-scrollbar>
  <p v-else>好友列表为空</p>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getFriendList } from "@/api/ApiService"
import { store } from '@/store/store.js'

let friendList = ref([])
let focusFriendId = ref(0)

const getFriendListFunc = async (isFocusOnFirst = true) => {
  try {
    const response = await getFriendList()
    if (response.code == 10000) {
      let list = response.data
      list.forEach(item => {
        item.avatar_url = decodeURIComponent(item.avatar_url)
      });
      friendList.value = list

      if (isFocusOnFirst) {
        if (list.length > 0) {
          store.focusFriendId = focusFriendId.value = list[0].id
        }
      }
    }
  } catch (error) {
    console.error('Get friend list error:', error)
  }
}

const clickOnFriend = (id) => {
  store.focusFriendId = focusFriendId.value = id
}

onMounted(() => {
  getFriendListFunc()
});

// eslint-disable-next-line no-undef
defineExpose({
  getFriendListFunc
})
</script>

<style scoped>
.friend-item {
  display: flex;
  /*align-items: center;*/
  justify-content: flex-start;
  height: 50px;
  width: 90%;
  margin: 5px;
  text-align: left;
  border-radius: 4px;
  color: black;
  padding: 5px;
}
.friend-name {
  font-size: 13px;
  white-space: nowrap;         /* 禁用文本换行 */
  overflow: hidden;            /* 隐藏文本溢出部分 */
  text-overflow: ellipsis;     /* 显示省略号 */
  margin-left: 5px;
}
.btnActive {
  background: #ececea;
}
</style>