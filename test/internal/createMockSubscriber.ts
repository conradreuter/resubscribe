import {Subscriber} from '~/internal/types'

function createMockSubscriber(): Subscriber<any> {
  return {
    next: jest.fn(),
    error: jest.fn(),
    complete: jest.fn(),
  }
}

export {createMockSubscriber}
