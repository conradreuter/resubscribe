/**
 * A deferred value, i.e. a promise that can be externally resolved or rejected.
 */
class Deferred<T> {
  public constructor() {
    this.promise = new Promise((resolve, reject) => {
      Object.assign(this, {resolve, reject})
    })
  }

  /**
   * The underlying promise.
   */
  public readonly promise: Promise<T>

  /**
   * Resolve the underlying promise.
   */
  public resolve(value: T): void {
    throw new Error('wtf') // method is overridden in constructor
  }

  /**
   * Reject the underlying promise.
   */
  public reject(err: any): void {
    throw new Error('wtf') // method is overridden in constructor
  }
}

export default Deferred
