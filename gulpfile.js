var gulp = require('gulp');
var install = require('gulp-install');
var uglify = require('gulp-uglify');
var pump = require('pump');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var del = require('del');
var gulpUtil = require('gulp-util');
var browserSync = require('browser-sync');
var filter = require('gulp-filter');
var $ = require('gulp-load-plugins')();


/* ==== Path assignments ==== */
var paths = {
  fonts: {
    src: 'webapp/fonts/**',
    dest: 'dist/fonts'
  },
  images: {
    src: 'webapp/images/**',
    dest: 'dist/images'
  },
  css: {
    src: 'webapp/styles/css/*.css',
    dest: 'dist/css'
  },
  customCss: {
    src: 'webapp/styles/scss/*.scss'
  },
  js: {
    src: 'webapp/js/*.js',
    dest: 'dist/js'
  },
  html: {
    src: 'webapp/*.html',
    dest: 'dist/'
  },
  dist: {
    dest: 'dist'
  },
};


/* ==== Clean Directory Tasks ==== */
gulp.task('cleanDist', () => {
  del.sync([paths.dist.dest]);
})


/* ==== Copy Tasks ==== */
gulp.task('copyFonts', ['cleanDist'], () => {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
});
gulp.task('copyImages',  ['copyFonts'], () => {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
});
gulp.task('copyJs',  ['copyImages'], () => {
  return gulp.src(paths.js.src)
    .pipe(gulp.dest(paths.js.dest));
});
gulp.task('copyCss',  ['copyJs'], () => {
  return gulp.src(paths.css.src)
    .pipe(gulp.dest(paths.css.dest));
});
gulp.task('copyCustomCss',  ['minifyCss'], () => {
  return gulp.src('.tmp/customCss/min-css/*.css')
    .pipe(gulp.dest(paths.css.dest));
});


/* ==== Compilation Tasks ==== */
gulp.task('htmlInclude', ['copyCss'], () => {
  return gulp.src(paths.html.src)
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
gulp.task('compileScss', ['htmlInclude'], () => {
  return gulp.src(paths.customCss.src)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      precision: 10,
      sourceComments: true,
      outputStyle: 'expanded'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/customCss/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


/* ==== File Minification Tasks ==== */
gulp.task('minifyCss', ['compileScss'], function() {
    return gulp.src('.tmp/customCss/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('.tmp/customCss/min-css/'));
});


/* ==== Watch task ==== */
gulp.task('watch', ['copyCustomCss'], function() {
    gulp.watch('webapp/**/*.scss', ['copyCustomCss']);
    gulp.watch('webapp/**/*.html', ['copyCustomCss']);
});


/* ==== Default Task - Start calling the dependencies when you type - npm run gulp ==== */
gulp.task('default', ['watch']);


/*
gulp.task('js', () => {
  return gulp.src(paths.js.src)
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
gulp.task('minify-js', ['minify-css'], function (cb) {
  pump([
        gulp.src('./dist/js'),
        uglify(),
        rename({
            suffix: '.min'
        }),
        gulp.dest('dist/scripts')
    ],
    cb
  );
});*/

/*
gulp.src(['./package.json'])
  .pipe(install());
*/


/*Serve to browser Task*/
/*gulp.task('serve', () => {
  browserSync({
    browser: 'chrome',
    notify: true,
    port: 9000,
    server: {
      baseDir: ['dist'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  }); 
});*/
