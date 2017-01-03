const gulp = require('gulp');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');

const paths = {
  js: './src/**/*.js',
  dist: './dist/'
};

// eslint
gulp.task('lint', () => {
  return gulp.src(paths.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// transpile & minify js
gulp.task('js', () => {
  return gulp.src(paths.js)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist));
});

// watching
gulp.task('watch', () => {
  gulp.watch(paths.js, ['js', 'lint']);
});

// gulp default
gulp.task('default', ['js', 'watch']);

