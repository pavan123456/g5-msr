export const state = () => {}
export const actions = {
  // this function get ran when the nuxt server initializes
  async nuxtServerInit ({ dispatch }, { error }) {
    try {
      await dispatch('user/setUser')
    } catch (e) {
      error(e)
    }
  }
}
export const mutations = {}
export const getters = {}
