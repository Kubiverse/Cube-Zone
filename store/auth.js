export const state = () => ({
	user: null,
})

export const mutations = {
	setUserInit(state, authPayload) {
		state.user = authPayload.user || null;
	},

  unsetUser(state) {
		state.user = null;
	},
}

export const getters = {
  user (state) {
    return state.user
	},
}