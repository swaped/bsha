var gulp 		= require('gulp');
var sass 		= require('gulp-sass');
var browserSync	= require('browser-sync').create();

/** Templating tasks **/
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var twig = require('gulp-twig');

/** Compile, runtime tasks **/
var useref		= require('gulp-useref');
var uglify 		= require('gulp-uglify');
var gulpIf 		= require('gulp-if');
var del			= require('del');
var sourcemaps 	= require('gulp-sourcemaps');
var merge		= require('merge-stream');
var runSequence = require('run-sequence');

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'site'
		},
	})
});

gulp.task('sass', function(){
  return gulp.src('site/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('site/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', ['templates', 'sass', 'static', 'browserSync'], function() {
	gulp.watch('site/scss/**/*.scss', ['sass']);
	gulp.watch('site/*.html', browserSync.reload);
	gulp.watch('site/js/**/*.js', browserSync.reload);
});

gulp.task('useref', function() {
	return gulp.src('site/*.html')
		.pipe(useref())
		.pipe(sourcemaps.init())
			.pipe(gulpIf('*.js', uglify()))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('site/dist'))
})

gulp.task('clean:dist', function(){
	return del.sync('site/dist')
})

gulp.task('static', function(){
	var images = gulp.src('site/images/**/*')
		.pipe(gulp.dest('site/dist/images'));

	var css = gulp.src('site/css/**/*')
		.pipe(gulp.dest('site/dist/css'));

	var js = gulp.src('site/js/**/*')
		.pipe(gulp.dest('site/dist/js'));

	return merge(images, css);
})

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'static']
  )
})

// Compile Twig templates to HTML
gulp.task('templates', function() {
    return gulp.src('site/index.html') // run the Twig template parser on all .html files in the "site" directory
        .pipe(twig())
        .pipe(gulp.dest('site/dist')); // output the rendered HTML files to the "dist" directory
});