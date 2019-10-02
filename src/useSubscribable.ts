import {useState, useEffect} from 'react'

import {Subscribable} from './internal/types'
import {subscribe} from './internal/subscribe'

export function useSubscribable<T>(subscribable: Subscribable<T>): SubscribeState<T> {
  const [state, setState] = useState<SubscribeState<T>>({kind: 'loading'})

  useEffect(() => {
    setState({kind: 'loading'})
    const subscription = subscribe(subscribable, {
      next: value => setState({kind: 'next', value: value as any}),
      error: err => setState({kind: 'error', err}),
      complete: () => {},
    })
    return () => subscription.unsubscribe()
  }, [subscribable])

  return state
}

export type SubscribeState<T> =
  | {kind: 'loading'}
  | {kind: 'next'; value: T}
  | {kind: 'error'; err: any}
