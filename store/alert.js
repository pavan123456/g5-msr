export const state = () => ({
  alertMsg: '',
  includeRefreshLink: true,
  alertVariant: '',
  alertEnabled: false,
  dismissSecs: 5,
  dismissCountDown: 0,
  countDownAlert: false
})

export const actions = {
  setAlert ({ commit }, val) {
    commit('SET', val)
  },
  resetAlert ({ commit }, val) {
    const defaultValues = {
      alertMsg: '',
      includeRefreshLink: true,
      alertVariant: '',
      alertEnabled: false,
      dismissSecs: 5,
      dismissCountDown: 0,
      countDownAlert: false
    }
    commit('SET', defaultValues
    )
  }
}

export const mutations = {
  SET (state, form) {
    const keys = Object.keys(form)
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => state[key] = form[key])
  }
}
