import subscribe from '~/internal/subscribe'
import Subscriber from '~/internal/Subscriber'

describe('subscribe (Value)', () => {

  const VALUE = {}
  
  let subscriber: Subscriber<{}>
  
  beforeEach(() => {
    subscriber = { next: jest.fn(), error: jest.fn() }
  })

  it('should pass the values to the subscriber asynchronously', () => {
    // act
    subscribe(VALUE, subscriber)

    // assert
    expect(subscriber.next).toHaveBeenCalledWith(VALUE)
  })
})
