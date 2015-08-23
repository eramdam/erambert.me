var browserSync = require('browser-sync').create();

var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var ejs = require('gulp-ejs');
var cssnext = require('gulp-cssnext');
var nano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');

var global = {
  isProduction: false,
  files: {
    css: {
      src: 'src/assets/css/index.css',
      watch: 'src/assets/css/**/*.css',
      dest: 'dist/assets/css'
    },
    graphics: {
      src: 'src/assets/img/**',
      dest: 'dist/assets/img/'
    },
    html: {
      src: [
        'src/**/*.html',
        '!src/includes/*.html'
      ],
      dest: 'dist/'
    },
    js: {
      src: [
      // // Libs
      // 'node_modules/angular/angular.min.js',

      // Our code
      'src/assets/js/*.js'
      ],
      dest: 'dist/assets/js'
    }
  }
};

function avoidErrors() {
  return global.isProduction ? util.noop() : plumber({errorHandler: notify.onError("Error: <%= error.message %>")});
}

function notifyErrors(err) {
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  })(err);

  // Keep gulp from hanging on this task
  this.emit('end');
}

/*
*
* `gulp js`
* ng-annotate + sourcemaps (dev) + uglify (prod) + concat
*
*/
gulp.task('js', function () {
  return gulp.src(global.files.js.src)
  .pipe(global.isProduction ? util.noop() : sourcemaps.init())
  .pipe(avoidErrors())
    .pipe(concat('app.js'))
    .pipe(global.isProduction ? uglify() : util.noop())
  .pipe(global.isProduction ? util.noop() : sourcemaps.write())
  .pipe(gulp.dest(global.files.js.dest));
});

/*
*
* `gulp css`
* cssnext (allows to write CSS3/4) + some PostCSS plugins to have a "stylus feel"
*
*/
gulp.task('css', function () {
  return gulp.src(global.files.css.src)
  .pipe(avoidErrors())
  .pipe(cssnext({
    sourcemap: global.isProduction ? false : true,
    plugins: [
      // allow to use of mixins (has to be set first)
      require('postcss-mixins'),
      // allow to use of extends
      require('postcss-extend'),
      // allow to nest css (like stylus/sass)
      require('postcss-nested'),
      // allow to use the :any-link pseudo-class
      require('postcss-pseudo-class-any-link'),
      // transform px values to rem
      require('postcss-pxtorem')
    ]
  }))
  .pipe(global.isProduction ? nano() : util.noop())
  .pipe(gulp.dest(global.files.css.dest))
  .pipe(browserSync.stream());
});

/*
*
* `gulp html`
* EJS. Simply.
*
*/

gulp.task('html', function () {
  return gulp.src(global.files.html.src)
  .pipe(avoidErrors())
  .pipe(ejs().on('error', util.log))
  .pipe(gulp.dest(global.files.html.dest));
});


/*
*
* `gulp graphics`
* use imagemin to compress graphics
*
*/

gulp.task('graphics', function () {
  return gulp.src(global.files.graphics.src)
  .pipe(avoidErrors())
  .pipe(imagemin({
    multipass: true,
    optimizationLevel: 1,
    progressive: true
  }))
  .pipe(gulp.dest(global.files.graphics.dest));
});

/*
*
* `gulp build`
* Compiles w/ production settings
*
*/

gulp.task('build', function (done) {
  global.isProduction = true;
  runSequence('clean',
              'graphics',
              ['js', 'html', 'css'],
              done);
});

/*
*
* `gulp build`
*  Remove the dist/ folder
*
*/

gulp.task('clean', function (done) {
  del('dist/', done);
});

/*
*
* `gulp`
* Compiles a first time in dev mode + launch a browser-sync instance + watch the ressources and reload/stream when needed
*
*/

gulp.task('default', function (done) {
  runSequence('clean', 'graphics', ['js', 'html', 'css'], function () {
    browserSync.init({
      server: {
        baseDir: 'dist/'
      },
      ghostMode: false
    });

    gulp.watch(global.files.graphics.src, ['graphics']);
    gulp.watch(global.files.css.watch, ['css']);
    gulp.watch(global.files.html.src, ['html']);
    gulp.watch(global.files.js.src, ['js']);
    gulp.watch(global.files.html.dest + '/**/*.{html,js}').on('change', browserSync.reload);
    done();
  });
});