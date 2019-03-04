/**
 * Something that can be subscribed to.
 */
type Subscribable<T> = Observable<T> | Promise<T> | AsyncIterator<T> | T

// TODO Remove as soon as Observables make it to the spec and have appropriate typings.
// https://github.com/tc39/proposal-observable#api

interface Observable<T> {
  subscribe(observer: Partial<Observer<T>>): Subscription
}

interface Observer<T> {
  next(value: T): void
  error(err: any): void
  complete(): void
}

interface Subscription {
  unsubscribe(): void
}

export default Subscribable
export {Observable, Observer, Subscription}
