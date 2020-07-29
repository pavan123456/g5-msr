export const state = () => {
  return {
    type: null,
    types: [
      {
        text: 'What kind of feedback?', value: null
      },
      '🐞 Report a Bug!',
      '😳 There\'s a Better Way!',
      '🤓 Add Something New!'
    ],
    comment: '',
    maxCommentLength: 250
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
