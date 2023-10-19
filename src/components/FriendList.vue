<template>
  <el-scrollbar v-if="friendList.length > 0">
      <div v-for="item in friendList"
           :key="item.id" class="friend-item"
           @click="clickOnFriend(item.id)"
           :class="{ 'btnActive' : item.id == focusFriendId  }"
      >
        <el-avatar :src="item.avatar_url"/>
        <p class="friend-item-name" style="margin-left: 5px;"><strong>{{ item.name }}</strong></p>
      </div>
  </el-scrollbar>
  <p v-else>好友列表加载中</p>
</template>

<script setup>
import {ref, onMounted} from "vue"
import {getFriendList} from "@/api/ApiService"
import { store } from '@/store/store.js'

let friendList = ref([])
let focusFriendId = ref(0)

const getFriendListFunc = async () => {
  try {
    const response = await getFriendList()
    console.log(response)
    if (response.code == 10000) {
      let list = response.data
      list.forEach(item => {
        item.avatar_url = decodeURIComponent(item.avatar_url)
      });
      console.log(list)
      friendList.value = list

      if (list.length > 0) {
        store.focusFriendId = focusFriendId.value = list[0].id
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

</script>

<style scoped>
.friend-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 60px;
  width: 95%;
  margin: 5px;
  text-align: left;
  border-radius: 4px;
  color: black;
}
.friend-item-name {
  white-space: nowrap;         /* 禁用文本换行 */
  overflow: hidden;            /* 隐藏文本溢出部分 */
  text-overflow: ellipsis;     /* 显示省略号 */
}
.btnActive {
  background: #ececea;
}
</style>