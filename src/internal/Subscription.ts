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
  export const EMPTY: Subscription = { unsubscribe() {} }
}

export default Subscription
