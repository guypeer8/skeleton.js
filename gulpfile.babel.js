
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import babel from 'gulp-babel';

gulp.task('default', () => {
	return gulp.src('skeleton.js')
			.pipe(babel())
			.pipe(uglify())
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest('.'));
});