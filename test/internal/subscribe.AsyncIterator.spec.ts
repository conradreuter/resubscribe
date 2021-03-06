import {subscribe} from '~/internal/subscribe'
import {Subscriber} from '~/internal/types'
import {Deferred} from '../Deferred'
import {createMockSubscriber} from './createMockSubscriber'

describe('subscribe (AsyncIterator)', () => {
  const VALUE1 = {value: '1'}
  const VALUE2 = {value: '2'}

  let subscriber: Subscriber<{}>
  let deferred1: Deferred<{}>
  let deferred2: Deferred<{}>
  let end: Deferred<void>
  let asyncIterator: AsyncIterator<{}>

  beforeEach(() => {
    subscriber = createMockSubscriber()
    deferred1 = new Deferred()
    deferred2 = new Deferred()
    end = new Deferred()
    asyncIterator = (async function*() {
      yield await deferred1.promise
      yield await deferred2.promise
      end.resolve(undefined)
    })()
  })

  it('should pass resolved values to the subscriber', async () => {
    // act
    subscribe(asyncIterator, subscriber)

    // arrange
    deferred1.resolve(VALUE1)
    deferred2.resolve(VALUE2)
    await end.promise

    // assert
    expect(subscriber.next).toHaveBeenCalledWith(VALUE1)
    expect(subscriber.next).toHaveBeenCalledWith(VALUE2)
  })

  it('should pass errors to the subscriber', async () => {
    // act
    subscribe(asyncIterator, subscriber)

    // arrange
    const ERROR = new Error()
    deferred1.reject(ERROR)
    await deferred1.promise.catch(() => {})
    await new Promise(resolve => resolve())

    // assert
    expect(subscriber.error).toHaveBeenCalledWith(ERROR)
  })

  it('should complete the subscriber after all values have been passed', async () => {
    // act
    subscribe(asyncIterator, subscriber)

    // arrange
    deferred1.resolve(VALUE1)
    deferred2.resolve(VALUE2)
    await end.promise
    await new Promise(resolve => resolve())

    // assert
    expect(subscriber.complete).toHaveBeenCalled()
  })
})
