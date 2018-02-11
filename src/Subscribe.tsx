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
        empty: PropTypes.func,
        next: PropTypes.func.isRequired,
        error: PropTypes.func,
      }),
    ]).isRequired,
    to: PropTypes.any.isRequired,
  }

  private subscription: Subscription = Subscription.EMPTY
  
  constructor(props: SubscribeProps<T>) {
    super(props)
    this.state = { kind: 'empty' }
  }
  
  componentDidMount(): void {
    this.subscribe(this.props.to)
  }

  componentWillReceiveProps(nextProps: Readonly<SubscribeProps<T>>): void {
    if (nextProps.to && nextProps.to !== this.props.to) {
      this.subscribe(nextProps.to)
    }
  }

  componentWillUnmount(): void {
    this.subscription.unsubscribe()
  }
  
  subscribe(to: Subscribable<T>): void {
    this.setState({ kind: 'empty' })
    this.subscription.unsubscribe()
    this.subscription = subscribe(to, {
      next: (value) => this.setState({ kind: 'next', value }),
      error: (err) => this.setState({ kind: 'error', err })
    })
  }

  render() {
    const renderer = this.getRenderer()
    switch (this.state.kind) {
      case 'empty': return renderer.empty()
      case 'next': return renderer.next(this.state.value)
      case 'error': return renderer.error(this.state.err)
    }
  }

  getRenderer(): SubscribeRenderer<T> {
    const renderer: SubscribeRenderer<T> = {
      empty: () => null,
      next: () => null,
      error: () => null,
    }
    if (typeof this.props.children === 'function') {
      renderer.next = this.props.children
    } else {
      Object.assign(renderer, this.props.children)
    }
    return renderer
  }
}

/**
 * Renders asynchronously obtained values.
 */
export interface SubscribeRenderer<T> {

  /**
   * Render the empty state, i.e. no value has been obtained yet.
   */
  empty(): ReactNode

  /**
   * Render the next value.
   */
  next(value: T): ReactNode

  /**
   * Render an error.
   */
  error(err: any): ReactNode
}

export interface SubscribeProps<T> {

  /**
   * Renders the asynchronously obtained value.
   * Missing render functions default to `() => null`.
   */
  children: SubscribeRenderer<T>['next'] | Partial<SubscribeRenderer<T>>

  /**
   * The source to subscribe to.
   */
  to: Subscribable<T>
}

export type SubscribeState<T> = (
  | { kind: 'empty' }
  | { kind: 'next', value: T }
  | { kind: 'error', err: any }
)
