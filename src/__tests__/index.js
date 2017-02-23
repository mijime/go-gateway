/**
 * Copyright 2017 The Go Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

// @flow

import React from 'react'
import renderer from 'react-test-renderer'
import Index from '../route'

it('renders correctly', () => {
  renderer.create(<Index />)
})
