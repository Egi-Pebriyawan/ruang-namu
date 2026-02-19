import { mount } from '@vue/test-utils'
import BaseButton from '../src/components/Base/BaseButton.vue'

describe('BaseButton', () => {
  it('should render with default props', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Click Me' }
    })
    
    expect(wrapper.text()).toBe('Click Me')
    expect(wrapper.classes()).toContain('bg-amber-900')
    expect(wrapper.classes()).toContain('text-white')
  })

  it('should render primary button variant', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'primary' },
      slots: { default: 'Primary' }
    })
    
    expect(wrapper.classes()).toContain('bg-amber-900')
    expect(wrapper.classes()).toContain('text-white')
    expect(wrapper.classes()).toContain('hover:bg-amber-800')
  })

  it('should render secondary button variant', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'secondary' },
      slots: { default: 'Secondary' }
    })
    
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('border-amber-900')
    expect(wrapper.classes()).toContain('text-amber-900')
  })

  it('should render as link when href is provided', () => {
    const wrapper = mount(BaseButton, {
      props: { href: 'https://example.com' },
      slots: { default: 'Link Button' }
    })
    
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
  })

  it('should render as button when no href', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Regular Button' }
    })
    
    expect(wrapper.element.tagName).toBe('BUTTON')
  })
})
