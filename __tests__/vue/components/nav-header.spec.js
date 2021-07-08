import { mount } from '@vue/test-utils'
import NavHeader from '@/components/nav-header'

describe('components/nav-header', () => {
  test('is a Vue component', () => {
    const wrapper = mount(NavHeader)
    expect(wrapper.vm).toBeTruthy()
  })
})

describe('components/nav-header', () => {
  test('is hidden when prop is set', () => {
    const wrapper = mount(NavHeader, {
      propsData: {
        hideHamburger: false
      }
    })
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.vm.isHamburgerVisible).toBeFalsy()
  })
})
