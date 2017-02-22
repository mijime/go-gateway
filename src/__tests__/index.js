import React from 'react'
import renderer from 'react-test-renderer'
import Index from '../route'

it('renders correctly', () => {
  renderer.create(<Index />)
})
