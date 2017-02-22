// @flow

import React, {Component} from 'react'
import {render} from 'react-dom'

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
    const Index = renderer()
    render(<Index />, main)
  }
}
