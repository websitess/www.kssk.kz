var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    prefixer    = require('gulp-autoprefixer'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    sassGlob    = require('gulp-sass-glob'),
    sourcemaps  = require('gulp-sourcemaps'),
    rigger      = require('gulp-rigger'),
    cssmin      = require('gulp-clean-css'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    rimraf      = require('rimraf'),
    browserSync = require('browser-sync'),
    wait        = require('gulp-wait'),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        jqLib: 'build/js',
        jsLibs: 'build/js',
        js: 'build/js/',
        cssLibs: 'build/css',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { 
        html: 'src/*.html',
        jqLib: 'bower_components/jquery/dist/jquery.js',
        jsLibs: 'src/js/libs.js',
        js: 'src/js/main.js',
        cssLibs: 'src/scss/libs.scss',
        style: 'src/scss/style.scss',
        img: 'src/img/**/*.*', 
        fonts: 'src/fonts/**/*.*'
    },
    watch: { 
        html: 'src/**/*.html',
        jsLibs: 'src/js/libs.js',
        js: 'src/js/main.js',
        cssLibs: 'src/scss/libs.scss',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html)) 
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(gulp.dest(path.build.js)) 
        .pipe(reload({stream: true})); 
});

gulp.task('jqLib:build', function () {
    gulp.src(path.src.jqLib) 
        .pipe(uglify()) 
        .pipe(gulp.dest(path.build.js)) 
});

gulp.task('jsLibs:build', function () {
    gulp.src(path.src.jsLibs) 
        .pipe(rigger()) 
        .pipe(uglify()) 
        .pipe(gulp.dest(path.build.js)) 
        .pipe(reload({stream: true})); 
});

gulp.task('cssLibs:build', function () {
    gulp.src(path.src.cssLibs) 
        .pipe(sourcemaps.init()) 
        .pipe(sassGlob())
        .pipe(wait(1000))
        .pipe(sass()) 
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css)) 
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) 
        .pipe(sourcemaps.init()) 
        .pipe(sassGlob())
        .pipe(wait(1000))
        .pipe(sass()) 
        .pipe(prefixer({
            browsers: [
                'last 15 versions',
                'last 6 iOS versions',
                'last 6 Android versions',
                'last 6 Safari versions',
                'last 2 ie versions'  
            ],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) 
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) 
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'jqLib:build',
    'jsLibs:build',
    'cssLibs:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
     watch([path.watch.cssLibs], function(event, cb) {
        gulp.start('cssLibs:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.jsLibs], function(event, cb) {
        gulp.start('jsLibs:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);
