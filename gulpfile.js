const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const browserify = require('browserify');
const changed  = require('gulp-changed');
const source = require('vinyl-source-stream');
const del =require('del');
const browserSync = require('browser-sync').create();

//删除dist下的所有文件
gulp.task('delete',function(cb){
    return del(['dist/*','!dist/images'],cb);
})

gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    //暂时不压缩
    gulp.src('index.html')
        .pipe(changed('dist', {hasChanged: changed.compareSha1Digest}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('convertJS', function(){
    return gulp.src('app/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream:true}));
})

// 合并并压缩css
gulp.task('convertCSS', function(){
    return gulp.src('app/css/*.css')
        .pipe(concat('app.css'))
        .pipe(cssnano())
        .pipe(rename(function(path){
            path.basename += '.min';
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream:true}));
})

// 监视文件变化，自动执行任务
gulp.task('watch', function(){
    gulp.watch('app/css/*.css', ['convertCSS']);
    gulp.watch('app/js/*.js', ['convertJS', 'browserify']);
})

// browserify
gulp.task("browserify", function () {
    var b = browserify({
        entries: "dist/js/app.js"
    });

    return b.bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist/js"));
});
gulp.task('serve', ['delete'], function() {
    gulp.start('convertJS','convertCSS','browserify','html');
    browserSync.init({
        port: 2017,
        server: {
            baseDir: ['dist']
        }
    });
    gulp.watch('app/js/*.js', ['convertJS','browserify']);         //监控文件变化，自动更新
    gulp.watch('app/css/*.css', ['convertCSS']);
    gulp.watch('*.html', ['html']);
});

//gulp.task('default', ['convertJS', 'convertCSS', 'browserify', 'watch']);
gulp.task('default',['serve']);