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
    ],
    year: 2020,
    month: 7,
    months: [
      { text: 'Jan', value: 1 },
      { text: 'Jan', value: 1 },
      { text: 'Feb', value: 2 },
      { text: 'Mar', value: 3 },
      { text: 'Apr', value: 4 },
      { text: 'May', value: 5 },
      { text: 'Jun', value: 6 },
      { text: 'Jul', value: 7 },
      { text: 'Aug', value: 8 },
      { text: 'Sep', value: 9 },
      { text: 'Oct', value: 10 },
      { text: 'Nov', value: 11 },
      { text: 'Dec', value: 12 }
    ],
    team: 'DA',
    teams: [
      'DA',
      'SEO',
      'CC',
      'AMO'
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
