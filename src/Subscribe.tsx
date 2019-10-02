import * as PropTypes from 'prop-types'
import React, {ReactNode} from 'react'

import {useSubscribable} from './useSubscribable'
import {Subscribable} from './internal/types'

function createRenderer<T>(
  options: Pick<SubscribeProps<T>, 'children' | 'placeholder'>,
): SubscribeRenderer<T> {
  const {placeholder, children} = options
  const renderer: SubscribeRenderer<T> = {
    loading: () => placeholder || null,
    next: value => value,
    error: () => null,
  }
  if (!children) return renderer
  if (typeof children === 'function') {
    renderer.next = children as any
  } else {
    Object.assign(renderer, children)
  }
  return renderer
}

/**
 * Subscribes to a source and asynchronously renders content as soon as a value is available.
 */
function InternalSubscribe<T>(props: SubscribeProps<T>) {
  const subscriptionState = useSubscribable(props.to)
  const renderer = createRenderer(props)

  switch (subscriptionState.kind) {
    case 'loading':
      return <>{renderer.loading()}</>
    case 'next':
      return <>{renderer.next(subscriptionState.value)}</>
    case 'error':
      return <>{renderer.error(subscriptionState.err)}</>
    default:
      let _never: never = subscriptionState
      throw new Error('Unkown subscription state: ' + _never)
  }
}

InternalSubscribe.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      loading: PropTypes.func,
      next: PropTypes.func,
      error: PropTypes.func,
    }),
  ]),
  placeholder: PropTypes.node,
  to: PropTypes.any.isRequired,
}

const Subscribe = React.memo(InternalSubscribe) as <T>(
  props: SubscribeProps<T>,
) => JSX.Element | null

/**
 * Renders asynchronously obtained values.
 */
interface SubscribeRenderer<T> {
  /**
   * Render the loading state, i.e. no value has been obtained yet.
   * Defaults to `() => this.props.placeholder || null` when missing.
   */
  loading(): ReactNode

  /**
   * Render the next value.
   * Defaults to `value => value` when missing.
   */
  next(value: T): ReactNode

  /**
   * Render an error.
   * Defaults to `() => null` when missing.
   */
  error(err: any): ReactNode
}

interface SubscribeProps<T> {
  /**
   * Renders the asynchronously obtained value.
   */
  children?: SubscribeRenderer<T>['next'] | Partial<SubscribeRenderer<T>>

  /**
   * The placeholder to be rendered if no loading-renderer is specified.
   */
  placeholder?: ReactNode

  /**
   * The source to subscribe to.
   */
  to: Subscribable<T>
}

export {Subscribe, SubscribeProps, SubscribeRenderer}
