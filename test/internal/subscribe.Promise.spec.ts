import {subscribe} from '~/internal/subscribe'
import {Subscriber} from '~/internal/types'
import {Deferred} from '../Deferred'
import {createMockSubscriber} from './createMockSubscriber'

describe('subscribe (Promise)', () => {
  const VALUE = {}

  let subscriber: Subscriber<{}>
  let deferred: Deferred<{}>

  beforeEach(() => {
    subscriber = createMockSubscriber()
    deferred = new Deferred()
  })

  it('should pass the resolved value to the subscriber', async () => {
    // act
    subscribe(deferred.promise, subscriber)

    // arrange
    deferred.resolve(VALUE)
    await deferred.promise

    // assert
    expect(subscriber.next).toHaveBeenCalledWith(VALUE)
  })

  it('should not invoke the subscriber multiple times', async () => {
    // act
    subscribe(deferred.promise, subscriber)

    // arrange
    deferred.resolve(VALUE)
    deferred.resolve(VALUE)
    await deferred.promise

    // assert
    expect(subscriber.next).toHaveBeenCalledTimes(1)
  })

  it('should pass errors to the subscriber', async () => {
    // act
    subscribe(deferred.promise, subscriber)

    // arrange
    const ERROR = new Error()
    deferred.reject(ERROR)
    await deferred.promise.catch(() => {})

    // assert
    expect(subscriber.error).toHaveBeenCalledWith(ERROR)
  })

  it('should complete the subscriber when the promise resolves', async () => {
    // act
    subscribe(deferred.promise, subscriber)

    // arrange
    deferred.resolve(VALUE)
    await deferred.promise

    // assert
    expect(subscriber.complete).toHaveBeenCalled()
  })
})
