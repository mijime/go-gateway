// @flow

import {createClass} from 'react'

const Cycle = createClass({
  componentDidMount () {
    const {vtree} = this.props

    vtree.subscribe(newVTree => this.setState({
      vtree: newVTree
    }))
  },

  getInitialState () {
    return {vtree: this.props.children}
  },

  render () {
    return this.state.vtree
  }
})

export default Cycle
