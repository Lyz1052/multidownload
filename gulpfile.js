const gulp = require('gulp')
const babel = require('gulp-babel')
const concat = require('gulp-concat');
const browserify = require('browserify')
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const babelify = require('babelify');


const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('init',['libs'],()=>{
    console.log('Init success.')
})

gulp.task('build',['background','settings'])

gulp.task('watch',['build'],()=>{
    gulp.watch('src/js/background/*.js',{
        interval:2500
    },['build']).on('error', gutil.log)
})

gulp.task('background',()=>{
    //Readable Stream
    return browserify({
        entries: './src/js/background/background.js',
        debug: true
    }).transform(babelify, {presets: ["es2015"],sourceMaps:true}).bundle()
    .on('error', gutil.log)
    //Transform into VInyl File Object Stream
    .pipe(source('background.js'))
    .on('error', gutil.log)
    //Transform into VInyl File Object Buffer
    .pipe(buffer())
    .on('error', gutil.log)
    // .pipe(babel({presets: ['es2015']}))
    // .on('error', gutil.log)
    // .pipe(uglify())
    // .on('error', gutil.log)
    .pipe(gulp.dest('./build'))

    // .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(sourcemaps.write('./'))
    // .pipe(gulp.dest('./build'))
})

gulp.task('settings',function(){
    return browserify({
        entries: './src/js/settings/settings.js',
        debug: true
      }).transform(babelify, {presets: ["es2015"]}).bundle()
    .pipe(source('settings.js'))
    .pipe(buffer())
    .on('error', gutil.log)
    // .pipe(uglify())
    // .on('error', gutil.log)
    .pipe(gulp.dest('./build'))
})

gulp.task('libs',()=>{
    gulp.src(['src/js/lib/jquery.min.js'
            ,'src/js/lib/bootstrap.min.js'
            ,'src/js/lib/adminlte.min.js'
            ,'src/js/lib/jquery.jsonrpc.js'
            // ,'src/js/lib/template-web.js'
        ])
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest('./build'))
})