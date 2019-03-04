/**
 * Handles subscription events.
 */
interface Subscriber<T> {
  next(value: T): void
  error(err: any): void
  complete(): void
}

export default Subscriber
