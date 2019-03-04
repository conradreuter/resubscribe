import {Observable} from './Observable'

/**
 * Something that can be subscribed to.
 */
type Subscribable<T> = Observable<T> | Promise<T> | AsyncIterator<T> | T

/**
 * A subscription than can be unsubscribed from.
 */
interface Subscription {
  unsubscribe(): void
}

namespace Subscription {
  /**
   * An empty subscription.
   */
  export const EMPTY: Subscription = {unsubscribe: () => {}}
}

/**
 * Handles subscription events.
 */
interface Subscriber<T> {
  next(value: T): void
  error(err: any): void
  complete(): void
}

export {Subscribable, Subscriber, Subscription}
