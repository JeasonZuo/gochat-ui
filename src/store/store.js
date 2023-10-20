import { reactive } from 'vue'

export const store = reactive({
  currentUser: {
    id: 0,
    name: '',
    avatar_url: ''
  },
  focusFriendId: 0,
})