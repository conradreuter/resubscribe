const Enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

Enzyme.configure({adapter: new Adapter()})

Symbol.asyncIterator =
  Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator')
