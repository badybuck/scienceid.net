module.exports = () => {
	$.gulp.task('sass', () => {
		var processors = [
			// $.pcmq,
			// $.postcssCustomProperties,
			$.autoprefixer(),
			$.nested(),
			$.cssnano(),
			// $.postcssMerge(),
			// $.cmq(),
			// $.flexGapPolyfill(),
			// $.postcssPresetEnv(),
		];
		return $.gulp.src($.sourse + '/sass/custom.scss')
			.pipe($.sassGlob())
			.pipe($.sass().on("error", $.notify.onError()))
			.pipe($.gcmq())
			.pipe($.postcss(processors))
			// .pipe($.rename({ suffix: '', prefix: '' }))
				.pipe($.gulp.dest($.public + '/css'))
			.pipe($.browserSync.stream());
	});

}