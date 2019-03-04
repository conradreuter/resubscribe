// TODO Remove as soon as Observables make it to the spec and have appropriate typings.
// https://github.com/tc39/proposal-observable#api

interface Observable<T> {
  subscribe(observer: Partial<Observer<T>>): ObservableSubscription
}

interface Observer<T> {
  next(value: T): void
  error(err: any): void
  complete(): void
}

interface ObservableSubscription {
  unsubscribe(): void
}

export {Observable, ObservableSubscription, Observer}
