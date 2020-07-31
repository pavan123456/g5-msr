import Vuex from 'vuex'
// import axios from 'axios'
// import MockAdapter from 'axios-mock-adapter'
import { createLocalVue } from '@vue/test-utils'

describe('Vuex Store', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let NuxtStore, store
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`
    NuxtStore = await import(storePath)
  })

  beforeEach(async () => {
    store = await NuxtStore.createStore()
  })

  describe('inputs/onUpdate', () => {
    const payload = { key: 'month', value: 6 }
    beforeEach(() => {
      store.dispatch('inputs/onUpdate', payload)
    })

    test('is a function', () => {
      expect(store.state.inputs.month).toBe(6)
    })
  })

  describe('feedback', () => {
    let isValid
    const payload = {
      key: 'comment',
      value: 'sdfjkhfdsajklsdfakljfdskljsdfakjlsdfajkldfsakjlsdfakljsdfkjlsdfkjldsfjklsdfakjsdfkjldsfkjldfskjadkfjlsadfkjsdfkljsdfakjlsdfakjlsdfakljsdfakjlsdfakjlsdfakjlsdafkljsadfkljadsfklsdfakljsdfaklsdfakljsdfkljsdfkljdsakjlsdakjlsdaklsdfkljdsfakl;adsfkljsdafkljdfaskjldsafkljdsfaklj'
    }
    beforeEach(() => {
      store.dispatch('feedback/onUpdate', payload)
      isValid = store.getters['feedback/isValid']
    })

    test('is Invalid', () => {
      expect(isValid).toBe(false)
    })
  })
})
