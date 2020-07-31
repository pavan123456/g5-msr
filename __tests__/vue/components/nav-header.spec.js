import { mount } from '@vue/test-utils'
import NavHeader from '@/components/nav-header'

describe('components/nav-header', () => {
  test('is a Vue component', () => {
    const wrapper = mount(NavHeader)
    expect(wrapper.vm).toBeTruthy()
  })
})
