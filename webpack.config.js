/**
 * Copyright 2017 The Go Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

const path = require('path')
const destPath = path.resolve(__dirname, 'cmd/go-gateway/data')

module.exports = Object.assign({
  entry: {
    main: './src'
  },
  output: {
    path: destPath,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: ['babel-loader', 'eslint-loader']
    }]
  }
})
