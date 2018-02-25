
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
// Use gulp Watch!!! to actually watch new files

/////////////////
// Source Paths
///////////////

var src = {
  sass: 'app/scss/main.scss',
  html: 'app/**/*.html',
  js: 'app/**/*.js',
  dist: 'dist'
}

///////////////
// Watch Paths
/////////////

var watchObj = {
  sass: 'app/**/*.scss',
  html: 'app/**/*.html',
  babel: 'app/**/*.js'
}



/////////////////
// HTML Task
///////////////

gulp.task('html', function(){
  return gulp.src(src.html)
  .pipe(gulp.dest(src.dist))
  .pipe(browserSync.stream())
});

///////////////////////
// Sass Compiler Task
/////////////////////

gulp.task('sass', function () {
 return gulp.src(src.sass)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(src.dist + '/css'))
  .pipe(browserSync.stream())
});

//////////////////
// Babel Compiler
////////////////

gulp.task('babel', () =>
  gulp.src(src.js)
  .pipe(sourcemaps.init())
  .pipe(babel({
      presets: ['env']
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(src.dist))
  .pipe(browserSync.stream())
);

///////////////
// Watch Tasks
/////////////

gulp.task('watch', function () {
  browserSync.init({
      server: {
          baseDir: src.dist
      }
  });

  gulp.watch(watchObj.sass, ['sass']);
  gulp.watch(watchObj.html,  ['html']).on('change', browserSync.reload);
  gulp.watch(watchObj.babel,  ['babel']).on('change', browserSync.reload);

  watch(watchObj.sass , batch(function (events, done) {
    gulp.start('sass', done);
    console.log('Sass batch');
  }));

  watch(watchObj.html, batch(function (events, done) {
    gulp.start('html', done);
    console.log('html batch');
  }));

  watch(watchObj.babel, batch(function (events, done) {
    gulp.start('babel', done);
    console.log('babel batch');
  }));

  // for(prop in watchObj) {
  //   watch(watchObj[prop] , batch(function (events, done) {
  //     gulp.start('' + prop, done);
  //     console.log(prop +' batch');
  //   }));
  // }

});

//////////////
// Clean Task
////////////

gulp.task('clean',function(){
  return gulp.src(src.dist)
  .pipe(clean({force: true}));
});

///////////////
// Build: dist
/////////////

gulp.task('build:dist',['html','sass','babel']);


////////////////////
// Launch the Tasks
//////////////////

gulp.task('default',['html','sass','babel','watch']);