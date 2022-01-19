// const autoPrefixer = require('gulp-autoprefixer');

let project_folder = "dist";
let source_folder = "app";

let fs = require('fs');

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/images/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: [source_folder + "/*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/script.js",
		img: source_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
		fonts: source_folder + "/fonts/*.ttf",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
	},
	clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	// fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass')(require('sass')),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),
	clean_css = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default,
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin');
// webp = require('gulp-webp'),
// webphtml = require('gulp-webp-html'),
// webpcss = require('gulp-webpcss'),
// svgSprite = require('gulp-svg-sprite'),
ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter');

function browserSync() {
	browsersync.init({
		server: {
			baseDir: source_folder + "/"
		},
		// port: 3000,
		// notify:false
	})
}

function html() {
	return src(path.src.html)
		// .pipe(fileinclude())
		// .pipe(webphtml())
		// .pipe(dest(path.src.html))
		.pipe(browsersync.stream())
}

function css() {
	return src(path.src.css)
		.pipe(
			scss({ outputStyle: 'expanded' })//.on('error', scss.logError)
		)
		.pipe(group_media())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 8 versions'],
				cascade: true
			})
		)
		.pipe(dest(source_folder + "/css/"))
		// .pipe(webpcss())
		// .pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename(
				{ suffix: '.min' }
			)
		)
		// .pipe(dest(path.build.css))
		.pipe(dest(source_folder + "/css/"))
		.pipe(browsersync.stream())
}

function style() {
	return src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/slick-carousel/slick/slick.css'
	])
		// .pipe(concat('libs.min.css'))
		.pipe(concat('_libs.scss'))
		.pipe(clean_css())
		.pipe(dest(source_folder + "/scss/"))
}

function script() {
	return src([
		'node_modules/slick-carousel/slick/slick.js'
		// 'node_modules/jquery/dist/jquery.js'
	])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(dest(source_folder + "/js/"))
		.pipe(browsersync.stream())
}

function js() {
	return src([
		'app/js/libs.min.js',
		'app/js/main.js'
		])
		.pipe(concat('main.min.js'))
		// .pipe(fileinclude())
		// .pipe(dest(path.src.js))
		.pipe(uglify())
		// .pipe(rename({ suffix: '.min' }))
		.pipe(dest(source_folder + "/js/"))
		.pipe(browsersync.stream())
}

function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(source_folder + "/fonts/"));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(source_folder + "/fonts/"));
};

gulp.task('otf2ttf', function () {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/fonts/'))
})

// gulp.task('svgSprite', function () {
// 	return gulp.src([source_folder + '/iconsprite/*.svg'])
// 		.pipe(svgSprite({
// 			mode: {
// 				stack: {
// 					sprite: "../icons/icons.svg",
// 					example: true
// 				}
// 			}
// 		}))
// 		.pipe(dest(path.build.img))
// })

// function fontsStyle(params) {

// 	let file_content = fs.readFileSync(source_folder + '/scss/_fonts.scss');
// 	if (file_content == '') {
// 		fs.writeFile(source_folder + '/scss/_fonts.scss', '', cb);
// 		return fs.readdir(source_folder + "/fonts/", function (err, items) {
// 			if (items) {
// 				let c_fontname;
// 				for (var i = 0; i < items.length; i++) {
// 					let fontname = items[i].split('.');
// 					fontname = fontname[0];
// 					if (c_fontname != fontname) {
// 						fs.appendFile(source_folder + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
// 					}
// 					c_fontname = fontname;
// 				}
// 			}
// 		})
// 	}
// }

function cb() {}

function make() {
	return src([
		source_folder + '/css/style.min.css',
		// source_folder + '/css/style.css',
		source_folder + '/fonts/*.{woff,woff2}',
		source_folder + '/js/main.min.js',
		// source_folder + '/js/libs.min.js',
		source_folder + '/*.html'
	], { base: source_folder })
		.pipe(dest(project_folder))
}

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	// gulp.watch([path.watch.js], js);
	gulp.watch(['app/js/**/*.js', '!app/js/main.min.js'], js);
	gulp.watch([path.watch.img], images);
}

// function images() {
// 	return src(path.src.img)
// 		.pipe(webp({
// 			quality: 70
// 		}))
// 		.pipe(dest(path.build.img))
// 		.pipe(src(path.src.img))
// 		.pipe(imagemin({
// 			progressive: true,
// 			svgoPlugins: [{ removeViewBox: false }],
// 			interlaced: true,
// 			optimiztionLevel: 3 // 0 to 7
// 		}))
// 		.pipe(dest(path.build.img))
// 		.pipe(browsersync.stream())
// }
function images() {
	return src(path.src.img)
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 75, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

function clean() {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(html, css, style, script, js, images, fonts), make);
let watch = gulp.parallel(build, browserSync, watchFiles);

// exports.fontsStyle = fontsStyle;
exports.script = script;
exports.style = style;
exports.fonts = fonts;
exports.images = images;
exports.build = build;
exports.js = js;
exports.css = css;
exports.html = html;
exports.watch = watch;
exports.default = watch;