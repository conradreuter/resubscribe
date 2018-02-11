import { shallow, ShallowWrapper } from 'enzyme'
import * as React from 'react'
import Subscribe, { SubscribeRenderer } from '~/Subscribe'
import Deferred from './Deferred'

describe('<Subscribe /> (Promise)', () => {

  let renderer: { [P in keyof SubscribeRenderer<{}>]: jest.Mock<React.ReactNode> }
  let deferred: Deferred<{}>
  let wrapper: ShallowWrapper
  
  beforeEach(() => {
    renderer = {
      empty: jest.fn().mockReturnValue('empty'),
      next: jest.fn().mockReturnValue('next'),
      error: jest.fn().mockReturnValue('error'),
    }
    deferred = new Deferred
    wrapper = shallow(<Subscribe to={deferred.promise}>{renderer}</Subscribe>)
  })

  it('should render the empty state by default', () => {
    // assert
    expect(renderer.empty).toHaveBeenCalled()
    expect(wrapper.text()).toBe('empty')
  })

  it('should render the next state when the promise resolves', async () => {
    // arrange
    const VALUE = {}
    deferred.resolve(VALUE)
    await deferred

    // assert
    expect(renderer.next).toHaveBeenCalledWith(VALUE)
    expect(wrapper.update().text()).toBe('next')
  })

  it('should render the error state when the promise rejects', async () => {
    // arrange
    const ERROR = new Error()
    deferred.reject(ERROR)
    await deferred.promise.catch(() => {})

    // assert
    expect(renderer.error).toHaveBeenCalledWith(ERROR)
    expect(wrapper.update().text()).toBe('error')
  })
})
