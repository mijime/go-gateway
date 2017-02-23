/**
 * Copyright 2017 The Go Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

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
