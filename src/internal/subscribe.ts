import Subscribable, { Observable } from './Subscribable'
import Subscriber from './Subscriber'
import Subscription from './Subscription'

/**
 * Subscribe something that can be subscribed to into a unified interface.
 */
export default function subscribe<T>(
  source: Subscribable<T>,
  subscriber: Subscriber<T>,
): Subscription {
  if (isObservable(source)) return subscribeToObservable(source, subscriber)
  if (isPromise(source)) return subscribeToPromise(source, subscriber)
  if (isAsyncIterator(source)) return subscribeToAsyncIterator(source, subscriber)
  return subscribeToValue(source, subscriber)
}

function isObservable<T>(source: Subscribable<T>): source is Observable<T> {
  return (true
    && !!source
    && typeof source === 'object'
    && typeof (source as any).subscribe === 'function'
  )
}

function subscribeToObservable<T>(
  observable: Observable<T>,
  subscriber: Subscriber<T>,
): Subscription {
  const subscription = observable.subscribe(subscriber)
  return { unsubscribe: () => subscription.unsubscribe() }
}

function isPromise<T>(subscribable: Subscribable<T>): subscribable is Promise<T> {
  return (true
    && !!subscribable
    && typeof subscribable === 'object'
    && typeof (subscribable as any).then === 'function'
  )
}

function subscribeToPromise<T>(
  promise: Promise<T>,
  subscriber: Subscriber<T>,
): Subscription {
  promise.then(subscriber.next, subscriber.error)
  return Subscription.EMPTY // Promises are not cancellable ):
}

function isAsyncIterator<T>(subscribable: Subscribable<T>): subscribable is AsyncIterator<T> {
  return (true
    && !!subscribable
    && typeof subscribable === 'object'
    && typeof (subscribable as any).next === 'function'
  )
}

function subscribeToAsyncIterator<T>(
  asyncIterator: AsyncIterator<T>,
  subscriber: Subscriber<T>,
): Subscription {
  fetchNext()
  return { unsubscribe }
  
  function fetchNext() {
    asyncIterator.next().then(result => {
      if (result.done) return
      fetchNext()
      subscriber.next(result.value)
    })
  }

  function unsubscribe() {
    if (asyncIterator.return) asyncIterator.return()
  }
}

function subscribeToValue<T>(
  value: T,
  subscriber: Subscriber<T>,
): Subscription {
  subscriber.next(value)
  return Subscription.EMPTY // value is delivered immediately
}
