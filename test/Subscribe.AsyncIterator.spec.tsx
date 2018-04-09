import { shallow, ShallowWrapper } from 'enzyme'
import * as React from 'react'
import { Subscribe, SubscribeRenderer } from '~/Subscribe'
import Deferred from './Deferred'

describe('<Subscribe /> (Value)', () => {

  type Value = { content: number }

  let renderer: { [P in keyof SubscribeRenderer<Value>]: jest.Mock<React.ReactNode> }
  let deferred1: Deferred<Value>
  let deferred2: Deferred<Value>
  let after1: Deferred<void>
  let after2: Deferred<void>
  let wrapper: ShallowWrapper

  beforeEach(() => {
    renderer = {
      loading: jest.fn().mockReturnValue('loading'),
      next: jest.fn().mockImplementation(value => 'next: ' + value.content),
      error: jest.fn().mockReturnValue('error'),
    }
    deferred1 = new Deferred
    deferred2 = new Deferred
    after1 = new Deferred
    after2 = new Deferred
    const asyncIterator = (async function*() {
      yield await deferred1.promise
      after1.resolve(undefined)
      yield await deferred2.promise
      after2.resolve(undefined)
    })()
    wrapper = shallow(<Subscribe to={asyncIterator}>{renderer}</Subscribe>)
  })

  it('should render the loading state by default', () => {
    // assert
    expect(renderer.loading).toHaveBeenCalled()
    expect(wrapper.text()).toBe('loading')
  })

  it('should render the next state when the next value arrives', async () => {
    // arrange
    const VALUE = { content: 0 }
    deferred1.resolve(VALUE)
    await after1.promise

    // assert
    expect(renderer.next).toHaveBeenCalledWith(VALUE)
    expect(wrapper.update().text()).toBe('next: 0')
  })

  it('should render the last value that arrived', async () => {
    // arrange
    deferred1.resolve({ content: 1 })
    deferred2.resolve({ content: 2 })
    await after2.promise

    // assert
    expect(wrapper.update().text()).toBe('next: 2')
  })
})
