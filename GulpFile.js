const gulp = require("gulp");
const {src,dest,watch, parallel, series } =require('gulp');
const htmlMin= require('gulp-htmlmin')

//html task

function htmlTask(){
    return src('component/*.html')

    .pipe(htmlMin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('dist'))
}
exports.html=htmlTask;



//css task


var cleanCss = require('gulp-clean-css');
var concat =require('gulp-concat')

function cssTask() {
    return src("component/css/*.css")
        //concate all css files in style.min.css
        .pipe(concat('style.min.css'))
        //minify file 
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css'))
}
exports.css = cssTask



//minify images and copy it to dist folder
const imagemin = require('gulp-imagemin');
function imgTask() {
    return gulp.src('component/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}

exports.default = imgTask



//js Task
var concat =require('gulp-concat')
const terser = require('gulp-terser');

function jsTask() {
    return src('component/js/*.js',{sourcemaps:true}) 
    
        .pipe(concat('all.min.js'))
        .pipe(terser())
        //create source map file in the same directory
        .pipe(dest('dist/assets/js',{sourcemaps:'.'}))
}
exports.js = jsTask


// sass task
var concat =require('gulp-concat')
const sass = require('gulp-sass')(require('sass'));
function sassTask() {
    return src(["component/sass/*.scss", "component/css/*.css"],{sourcemaps:true})
        .pipe(sass()) 
        .pipe(concat('style.sass.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css',{sourcemaps:'.'}))
}

exports.sass =sassTask 



var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}

//watch Task
function watchTask() {
    watch('component/*.html',series(htmlTask, reloadTask))
    watch('component/js/*.js',series(jsTask, reloadTask))
    watch(["component/css/*.css","component/sass/*.scss "], parallel(sassTask,reloadTask));
    
}
exports.default = series(parallel(imgTask, jsTask ,sassTask,htmlTask), serve,watchTask)


