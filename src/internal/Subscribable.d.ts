/**
 * Something that can be subscribed to.
 */
type Subscribable<T> = (
  | Observable<T>
  | Promise<T>
  | AsyncIterator<T>
  | T
)

export default Subscribable

// TODO Remove as soon as Observables make it to the spec and have appropriate typings.
// https://github.com/tc39/proposal-observable#api

export interface Observable<T> {
  subscribe(observer: Observer<T>): Subscription
}

interface Observer<T> {
  next(value: T): void
  error(err: any): void
}

interface Subscription {
  unsubscribe(): void
}
