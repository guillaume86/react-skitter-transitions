gulp = require 'gulp'
coffee = require 'gulp-coffee'
cjsx = require 'gulp-cjsx'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
browserify = require 'browserify'
transform = require 'vinyl-transform'
run = require 'gulp-run'

config =
  coffee: './src/*.coffee'
  cjsx: './src/*.cjsx'
  tests: './src/__tests__/*.cjsx'

handle_errors = (stream) ->
  stream.on('error', (e) ->
    gutil.log(e)
    gutil.beep()
    stream.end()
  )

gulp.task('coffee', ->
  gulp.src(config.coffee)
    .pipe(handle_errors(coffee(bare: true)))
    .pipe(gulp.dest('./lib/'))
)

gulp.task('cjsx', ->
  gulp.src(config.cjsx)
    .pipe(handle_errors(cjsx(bare: true)))
    .pipe(gulp.dest('./lib/'))
)

gulp.task('compile', ['coffee', 'cjsx'])

gulp.task('browserify', ['compile'], ->
  browserified = transform((filename) ->
    b = browserify(filename,
      standalone: 'ReactSkitterTransitions'
      detectGlobals: false
    )
    b.bundle()
  )
  
  return gulp.src(['./lib/index.js'])
    .pipe(browserified)
    .pipe(rename('react-skitter-transitions.js'))
    .pipe(gulp.dest('./dist'))
)

gulp.task('examples', ['browserify'], ->
  return gulp.src(['./dist/*.js'])
    .pipe(gulp.dest('./examples'))
)

# examples <- browserify <- compile
gulp.task('build', ['examples'])

gulp.task('test', (done) ->
  run('npm run test').exec(done)
)

gulp.task('watch', ['build'], ->
  gulp.watch([config.coffee, config.cjsx], ['build'])
  gulp.watch(['./lib/*.js', config.tests], ['test'])
)

gulp.task('default', ['build'])
