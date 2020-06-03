export const state = () => ({
  messages: [],
})

export const mutations = {
  addMessage(state, message) {
    state.messages.push(message)
  },

  removeFirstMessage(state) {
    state.messages.shift()
  },
}

export const getters = {
  messages(state) {
    return state.messages
  },

  messagesCount(state) {
    return state.messages.length
  },

  firstMessage(state) {
    return state.messages[0] || null
  },
}
