import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue/nuxt'
import NavHeader from '@/components/nav-header'

const vue = createLocalVue()
vue.use(BootstrapVue)

describe('components/nav-header', () => {
  test('is a Vue component', () => {
    const wrapper = mount(NavHeader, { vue })
    expect(wrapper.vm).toBeTruthy()
  })
})
