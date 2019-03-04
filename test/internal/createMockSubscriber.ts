import Subscriber from '~/internal/Subscriber'

function createMockSubscriber(): Subscriber<any> {
  return {
    next: jest.fn(),
    error: jest.fn(),
    complete: jest.fn(),
  }
}

export default createMockSubscriber
