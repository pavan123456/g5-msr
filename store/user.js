export const state = () => ({
  user: null
})

export const actions = {
  async setUser ({ commit }) {
    await this.$axios
      .$get('/api/v1/users/me')
      .then(user => commit('SET_USER', user))
  }
}

export const mutations = {
  SET_USER (state, user) {
    state.user = user
  }
}

export const getters = {
  get (state) {
    return state.user
  },
  isGlobal (state) {
    return state.user.roles.find(role => role.type === 'GLOBAL')
  },
  getFullName (state) {
    return `${state.user.firstName} ${state.user.lastName}`
  }
}
