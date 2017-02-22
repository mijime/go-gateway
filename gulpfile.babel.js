import gulp from 'gulp'
import flowtype from 'gulp-flowtype'
import jest from 'gulp-jest'
import webpack from 'webpack'
import config from './webpack.config'
import minimist from 'minimist'
import jsxRenderer from './gulpfile.d/jsx-renderer'

const argv = minimist(process.argv.slice(2))

gulp.task('default', ['test', 'html', 'webpack'])

gulp.task('test', ['flowtype', 'jest'])

gulp.task('flowtype', () => gulp.src(['src/**/*.js'])
  .pipe(flowtype({abort: true})))

gulp.task('jest', () => gulp.src(['src/**/__tests__'])
  .pipe(jest()))

gulp.task('html', () => gulp.src(['src/component/**/*.js'])
  .pipe(jsxRenderer())
  .pipe(gulp.dest(config.output.path)))

gulp.task('webpack', (cb) => webpack(Object.assign(config, argv.production ? {
  plugins: [
    new webpack.DefinePlugin({'process.env': {
      NODE_ENV: JSON.stringify('production')
    }}),
    new webpack.optimize.UglifyJsPlugin()
  ]
} : {
  devtool: 'inline-source-map'
}), cb))

gulp.task('watch', ['default'], () => {
  gulp.watch(['src/**/__tests__'], ['jest'])
  gulp.watch(['src/**/*.js', '!src/**/__tests__'], ['flowtype', 'webpack'])
  gulp.watch(['src/component/**/*.js'], ['html'])
})
