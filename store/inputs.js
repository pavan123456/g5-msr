export const state = () => {
  return {
    client: null,
    clients: [],
    period: 'Q1',
    periods: [
      'Q1',
      'Q2',
      'Q3',
      'Q4'
    ]
  }
}

export const actions = {
  onUpdate({ commit }, payload) {
    commit('ON_UPDATE', payload)
  }
}

export const mutations = {
  ON_UPDATE(state, payload) {
    state[payload.key] = payload.value
  }
}
