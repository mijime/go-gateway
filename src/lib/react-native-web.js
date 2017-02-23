/**
 * Copyright 2017 The Go Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

// @flow

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export class Text extends Component {
  render () {
    const {props} = this
    const {children} = this.props
    return <p {...props}>{children}</p>
  }
}

export class View extends Component {
  render () {
    const {props} = this
    const {children} = this.props
    return <div {...props}>{children}</div>
  }
}

export class StyleSheet {
  static create (object) {
    return object
  }
}

export class AppRegistry {
  static registerComponent (id, renderer) {
    const main = document.getElementById(id)
    ReactDOM.render(renderer(), main)
  }
}
