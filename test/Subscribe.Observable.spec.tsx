import { shallow, ShallowWrapper } from 'enzyme'
import * as React from 'react'
import { Subject } from 'rxjs'
import Subscribe, { SubscribeRenderer } from '~/Subscribe'

describe('<Subscribe /> (Observable)', () => {

  type Value = { content: number }

  let renderer: { [P in keyof SubscribeRenderer<Value>]: jest.Mock<React.ReactNode> }
  let subject: Subject<Value>
  let wrapper: ShallowWrapper

  beforeEach(() => {
    renderer = {
      loading: jest.fn().mockReturnValue('loading'),
      next: jest.fn().mockImplementation(value => 'next: ' + value.content),
      error: jest.fn().mockReturnValue('error'),
    }
    subject = new Subject
    wrapper = shallow(<Subscribe to={subject.asObservable()}>{renderer}</Subscribe>)
  })

  it('should render the loading state by default', () => {
    // assert
    expect(renderer.loading).toHaveBeenCalled()
    expect(wrapper.text()).toBe('loading')
  })

  it('should render the next state when the next value arrives', async () => {
    // arrange
    const VALUE = { content: 0 }
    subject.next(VALUE)

    // assert
    expect(renderer.next).toHaveBeenCalledWith(VALUE)
    expect(wrapper.update().text()).toBe('next: 0')
  })

  it('should render the last value that arrived', async () => {
    // arrange
    subject.next({ content: 1 })
    subject.next({ content: 2 })

    // assert
    expect(wrapper.update().text()).toBe('next: 2')
  })

  it('should render the error state when the observable throws', async () => {
    // arrange
    const ERROR = new Error()
    subject.error(ERROR)

    // assert
    expect(renderer.error).toHaveBeenCalledWith(ERROR)
    expect(wrapper.update().text()).toBe('error')
  })

  it('should unsubscribe from the observable when unmounting', () => {
    // assert
    expect(subject.observers).toHaveLength(1)

    // act
    wrapper.unmount()

    // assert
    expect(subject.observers).toHaveLength(0)
  })
})
