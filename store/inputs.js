export const state = () => {
  return {
    isBusy: false,
    isSubmitted: false,
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
    monthly: false,
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
    team: 'da',
    teams: [
      {
        text: 'Digital Advertising',
        id: 'da',
        isSelected: true,
        isApproved: false
      },
      {
        text: 'SEO',
        id: 'seo',
        isSelected: false,
        isApproved: false
      },
      {
        text: 'Customer Care',
        id: 'cc',
        isSelected: false,
        isApproved: true
      }
    ]
  }
}

export const getters = {
  selectedDate(state) {
    const thirtyOne = [1, 3, 5, 7, 8, 10, 12]
    const mo = state.month < 10
      ? `0${state.month}`
      : state.month
    const day = state.month === 2
      ? '28'
      : thirtyOne.includes(state.month)
        ? '31'
        : '30'
    return {
      from: `${state.year}-${mo}-01`,
      to: `${state.year}-${mo}-${day}`
    }
  },
  selectedQuarter(state) {
    const ranges = {
      Q1: { start: '01-01', end: '03-31' },
      Q2: { start: '04-01', end: '06-30' },
      Q3: { start: '07-01', end: '09-30' },
      Q4: { start: '10-01', end: '12-31' }
    }
    return {
      from: `${state.year}-${ranges[state.period].start}`,
      to: `${state.year}-${ranges[state.period].end}`
    }
  }
}

export const actions = {
  onUpdate({ commit }, payload) {
    commit('ON_UPDATE', payload)
  },
  onNested({ commit }, payload) {
    commit('ON_NESTED', payload)
  },
  fillClients({ commit }) {
    this.$axios
      .$get('api/v1/hub/clients')
      .then(clients => commit('FILL_CLIENTS', clients))
  }
}

export const mutations = {
  ON_UPDATE(state, payload) {
    state[payload.key] = payload.value
  },
  ON_NESTED(state, payload) {
    state.teams.forEach((team) => {
      team.isSelected = false
    })
    const i = state.teams.findIndex(team => team.id === payload.id)
    state.teams[i][payload.prop] = payload.value
  },
  FILL_CLIENTS(state, clients) {
    state.clients = clients
  }
}
