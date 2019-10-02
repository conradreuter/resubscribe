import {mount, ReactWrapper} from 'enzyme'
import * as React from 'react'

import {Subscribe} from '~/Subscribe'

describe('<Subscribe /> (Value)', () => {
  const VALUE = {}

  let renderer: jest.Mock<React.ReactNode>
  let wrapper: ReactWrapper

  beforeEach(() => {
    ;(renderer = jest.fn().mockReturnValue('next')),
      (wrapper = mount(<Subscribe to={VALUE}>{renderer}</Subscribe>))
  })

  it('should render the next state', () => {
    // assert
    expect(renderer).toHaveBeenCalledWith(VALUE)
    expect(wrapper.text()).toBe('next')
  })
})
