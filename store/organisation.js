export const state = () => ({
  current: null,
})

export const mutations = {
  setCurrent(state, organisation) {
    state.current = organisation || null
  },

  unsetCurrent(state) {
    state.current = null
  },
}

export const getters = {
  current(state) {
    return state.current
  },
}
