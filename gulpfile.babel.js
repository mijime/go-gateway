/**
 * Copyright 2017 The Go Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import gulp from 'gulp'
import util from 'gulp-util'
import flowtype from 'gulp-flowtype'
import jest from 'gulp-jest'
import eslint from 'gulp-eslint'
import minimist from 'minimist'
import webpack from 'webpack'
import config from './webpack.config'
import jsxRenderer from './gulpfile.d/jsx-renderer'

const argv = minimist(process.argv.slice(2))

const watched = {}

gulp.task('default', ['test', 'html', 'webpack'])
gulp.task('test', ['eslint', 'flowtype', 'jest'])

gulp.task('flowtype', () => {
  if (argv.watch && !watched['flowtype']) {
    gulp.watch(['src/**/*.js'], ['flowtype'])
    watched['flowtype'] = true
  }

  return gulp.src(['src/**/*.js'])
    .pipe(flowtype({abort: true}))
})

gulp.task('jest', () => {
  if (argv.watch && !watched['jest']) {
    gulp.watch(['src/**/*.js'], ['jest'])
    watched['jest'] = true
  }

  return gulp.src(['src/**/__tests__'])
    .pipe(jest())
})

gulp.task('eslint', () => {
  if (argv.watch && !watched['eslint']) {
    gulp.watch(['*.js', 'src/**/*.js'], ['eslint'])
    watched['eslint'] = true
  }

  return gulp.src(['*.js', 'src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('html', () => {
  if (argv.watch && !watched['html']) {
    gulp.watch(['src/route/**/*.js'], ['html'])
    watched['html'] = true
  }

  return gulp.src(['src/route/**/*.js'])
    .pipe(jsxRenderer())
    .pipe(gulp.dest(config.output.path))
})

gulp.task('webpack', (cb) => {
  const compiler = webpack(Object.assign({}, config, argv.production ? {
    plugins: [
      new webpack.DefinePlugin({'process.env': {
        NODE_ENV: JSON.stringify('production')
      }}),
      new webpack.optimize.UglifyJsPlugin()
    ]
  } : {
    devtool: 'inline-source-map'
  }))

  if (argv.watch) {
    cb()

    return compiler.watch({}, (err, stats) => {
      if (err) {
        util.log('Found error', util.colors.magenta(err))
      } else {
        util.log('Update', util.colors.blue('webpack'), stats.toString({
          chunks: false,
          colors: true
        }))
      }
    })
  }

  return compiler.run(cb)
})
