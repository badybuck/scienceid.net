module.exports = function () {

	// Your "watch" task
	$.gulp.task('watch', function () {
		$.gulp.watch([$.sourse + '/sass/**/*.css', $.sourse + '/pug/blocks/**/*.scss', $.sourse + '/sass/**/*.scss', $.sourse + '/sass/**/*.sass'], { usePolling: true }, $.gulp.series('sass'));
		$.gulp.watch($.sourse + '/pug/**/*.pug', { usePolling: true },  $.gulp.series('pug')); 

		$.gulp.watch([$.sourse + '/js/custom.js'], { usePolling: true }, $.gulp.series('scripts:common')); 
	});

}