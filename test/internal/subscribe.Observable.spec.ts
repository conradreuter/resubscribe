import { Subject } from 'rxjs'
import subscribe from '~/internal/subscribe'
import Subscriber from '~/internal/Subscriber'

describe('subscribe (Observable)', () => {
  
  const VALUE1 = { value: '1' }
  const VALUE2 = { value: '2' }
  
  let subscriber: Subscriber<{}>
  let subject: Subject<{}>
  
  beforeEach(() => {
    subscriber = { next: jest.fn(), error: jest.fn() }
    subject = new Subject()
  })

  it('should pass incoming values to the subscriber', () => {
    // act
    subscribe(subject.asObservable(), subscriber)

    // arrange
    subject.next(VALUE1)
    subject.next(VALUE2)

    // assert
    expect(subscriber.next).toHaveBeenCalledWith(VALUE1)
    expect(subscriber.next).toHaveBeenCalledWith(VALUE2)
  })

  it('should pass errors to the subscriber', () => {
    // act
    subscribe(subject.asObservable(), subscriber)

    // arrange
    const ERROR = new Error()
    subject.error(ERROR)

    // assert
    expect(subscriber.error).toHaveBeenCalledWith(ERROR)
  })

  it('should close the subscription when unsubscribing', () => {
    // act
    const subscription = subscribe(subject.asObservable(), subscriber)
    
    // assert
    expect(subject.observers).toHaveLength(1)

    // act
    subscription.unsubscribe()

    // assert
    expect(subject.observers).toHaveLength(0)
  })

  it('should not pass any more values when unsubscribed', () => {
    // act
    const subscription = subscribe(subject.asObservable(), subscriber)
    subscription.unsubscribe()

    // arrange
    subject.next({})

    // assert
    expect(subscriber.next).not.toHaveBeenCalled()
  })
})
