import * as PropTypes from 'prop-types'
import { PureComponent, ReactNode } from 'react'
import Subscribable from './internal/Subscribable'
import subscribe from './internal/subscribe'
import Subscription from './internal/Subscription'

/**
 * Subscribes to a source and asynchronously renders content as soon as a value is available.
 */
export default class Subscribe<T> extends PureComponent<SubscribeProps<T>, SubscribeState<T>> {

  static readonly displayName = 'Subscribe'
  static readonly propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({
        loading: PropTypes.func,
        next: PropTypes.func,
        error: PropTypes.func,
      }),
    ]),
    to: PropTypes.any.isRequired,
  }

  private static createRenderer<T>(children: SubscribeProps<T>['children']): SubscribeRenderer<T> {
    const renderer: SubscribeRenderer<T> = {
      loading: () => null,
      next: value => value,
      error: () => null,
    }
    if (!children) return renderer
    if (typeof children === 'function') {
      renderer.next = children
    } else {
      Object.assign(renderer, children)
    }
    return renderer
  }

  private renderer: SubscribeRenderer<T>
  private subscription: Subscription = Subscription.EMPTY

  constructor(props: SubscribeProps<T>) {
    super(props)
    this.renderer = Subscribe.createRenderer(props.children)
    this.state = { kind: 'loading' }
  }

  componentDidMount(): void {
    this.subscribe(this.props.to)
  }

  componentWillReceiveProps(nextProps: Readonly<SubscribeProps<T>>): void {
    if ('children' in nextProps) {
      this.renderer = Subscribe.createRenderer(nextProps.children)
    }
    if ('to' in nextProps && nextProps.to !== this.props.to) {
      this.subscribe(nextProps.to)
    }
  }

  componentWillUnmount(): void {
    this.subscription.unsubscribe()
  }

  private subscribe(to: Subscribable<T>): void {
    this.setState({ kind: 'loading' })
    this.subscription.unsubscribe()
    this.subscription = subscribe(to, {
      next: (value) => this.setState({ kind: 'next', value }),
      error: (err) => this.setState({ kind: 'error', err })
    })
  }

  render() {
    switch (this.state.kind) {
      case 'loading': return this.renderer.loading()
      case 'next': return this.renderer.next(this.state.value)
      case 'error': return this.renderer.error(this.state.err)
    }
  }
}

/**
 * Renders asynchronously obtained values.
 */
export interface SubscribeRenderer<T> {

  /**
   * Render the loading state, i.e. no value has been obtained yet.
   * Defaults to `() => null` when missing.
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

export interface SubscribeProps<T> {

  /**
   * Renders the asynchronously obtained value.
   */
  children?: SubscribeRenderer<T>['next'] | Partial<SubscribeRenderer<T>>

  /**
   * The source to subscribe to.
   */
  to: Subscribable<T>
}

export type SubscribeState<T> = (
  | { kind: 'loading' }
  | { kind: 'next', value: T }
  | { kind: 'error', err: any }
)
