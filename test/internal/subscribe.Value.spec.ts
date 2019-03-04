import {subscribe} from '~/internal/subscribe'
import {Subscriber} from '~/internal/types'
import {createMockSubscriber} from './createMockSubscriber'

describe('subscribe (Value)', () => {
  const VALUE = {}

  let subscriber: Subscriber<{}>

  beforeEach(() => {
    subscriber = createMockSubscriber()
  })

  it('should pass the values to the subscriber asynchronously', () => {
    // act
    subscribe(VALUE, subscriber)

    // assert
    expect(subscriber.next).toHaveBeenCalledWith(VALUE)
  })

  it('should complete the subscriber when all values have been passed', () => {
    // act
    subscribe(VALUE, subscriber)

    // assert
    expect(subscriber.complete).toHaveBeenCalled()
  })
})
