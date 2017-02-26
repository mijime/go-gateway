/**
 * Copyright 2017 The Go Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from 'react'
import Helmet from 'react-helmet'
import ReactDomServer from 'react-dom/server'
import stream from 'event-stream'
import path from 'path'

export default function () {
  return stream.map((file, cb) => {
    const filePath = path.resolve(file.path)
    if (require.cache[filePath]) {
      delete require.cache[filePath]
    }
    const Index = require(filePath).default

    if (Index == null) return cb(null, file)

    const head = Helmet.rewind()
    const component = ReactDomServer.renderToString(<Index />)

    file.contents = new Buffer(`<!DOCTYPE html>
<html lang=ja>
  <head>
    ${head.title.toString()}
    ${head.meta.toString()}
    ${head.link.toString()}
    ${head.script.toString()}
  </head>
  <body>
    <div id=main>${component}</div>
    <script defer src=/main.bundle.js></script>
  </body>
</html>`)
    file.path = file.path.replace(/\.jsx?/, '.html')
    return cb(null, file)
  })
}
