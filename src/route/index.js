/**
 * Copyright 2017 The Go Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

// @flow

import React from 'react'
import {AsyncSubject, Observable} from 'rx'
import {run} from '@cycle/core'
import Cycle from '../lib/cycle/component'
import makeDriver from '../lib/cycle'
import {View} from '../lib/react-native-web'

const subject = new AsyncSubject()

run(({REACT}) => {
  return {
    REACT: Observable.empty()
  }
}, {
  REACT: makeDriver(subject)
})

export default class Index extends React.Component {
  render () {
    return (
      <Cycle vtree={subject}><View /></Cycle>
    )
  }
}
