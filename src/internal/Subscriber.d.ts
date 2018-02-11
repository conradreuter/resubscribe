/**
 * Handles subscription events.
 */
interface Subscriber<T> {
  next(value: T): void
  error(err: any): void
}

export default Subscriber
