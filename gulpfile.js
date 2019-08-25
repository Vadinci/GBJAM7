let gulp = require('gulp');

gulp.task('build', function (done) {
    let concat = require('gulp-concat');
    let uglify = require('gulp-uglify-es').default;

    let src = [
        '!game.js',
        'engine/**/*.js',
        'game/**/*.js'
    ];

    gulp.src(src)
        .pipe(gulp.src('game.js'))
        .pipe(concat('game.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/'));

    gulp.src([
            'lib/**/*.js'
        ])
        .pipe(gulp.dest('build/lib/'));

    gulp.src([
            'index.html',
            'style.css',
            'assets.yaml'
        ])
        .pipe(gulp.dest('build/'));

    gulp.src([
            'assets/**/*'
        ])
        .pipe(gulp.dest('build/assets/'));

    done();
});