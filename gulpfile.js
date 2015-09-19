var gulp = require('gulp'),
	fs = require('fs'),
	autoprefixer = require('gulp-autoprefixer'),
	browserify = require('gulp-browserify'),
	jade = require('gulp-jade'),
	glob = require('glob'),
	cssGlobbing = require('gulp-css-globbing'),
	sass = require('gulp-sass'),
	connect = require('gulp-connect'),
	svgmin = require('gulp-svgmin'),
	argv = require('yargs')
		.default({
			server: true,
			watch: true,
			env: 'development'
		}).argv;

// Set build dir
var dest = 'www/';

// Bundle JavaScript
gulp.task('scripts', function() {
	// Single entry point to browserify
	gulp.src('src/js/main.js')
		.pipe(browserify({
			debug: argv.env === 'development',
			insertGlobals: false,
			transform: [
				'require-globify'
			]
		}))
		.pipe(gulp.dest(dest+'js'))
		.pipe(connect.reload());
});

// Copy theme images
gulp.task('images', function() {
	gulp.src('src/img/**')
		.pipe(gulp.dest(dest+'img'))
		.pipe(connect.reload());
});

// Copy content assets
gulp.task('content', function() {
	gulp.src('src/content/**')
		.pipe(gulp.dest(dest+'content'))
		.pipe(connect.reload());
});

// Compile templates to html
gulp.task('pages', function () {
	// Inject content as vars named after the JSON files
	var contentFiles = glob.sync('content/*.json');
	var jadeVars = {
		pkg: {
			name: '<%= pkg.name %>'
		}
	};
	contentFiles.forEach(function (file, i) {
		var content = JSON.parse(fs.readFileSync(file));
		if (content) {
			var key = file.split('/').pop().replace('.json', '');
			jadeVars[key] = content;
		} else {
			console.warn('Content file', file, 'is not valid JSON; skipping');
		}
	});
	gulp.src('src/pages/**/*.jade')
		.pipe(jade({
			pretty: true,
			data: jadeVars
		}))
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(gulp.dest(dest))
		.pipe(connect.reload());
});

// Compile styles to css
gulp.task('styles', function () {
	gulp.src('src/styles/main.scss')
		.pipe(cssGlobbing({
			extensions: ['.css', '.scss']
		}))
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(sass({
			outputStyle: argv.env === 'development' ? 'expanded' : 'compressed'
		}))
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(gulp.dest(dest+'css'))
		.pipe(connect.reload());

});

// Server
gulp.task('connect', function() {
	connect.server({
		root: 'www',
		livereload: true,
		port: 8000
	});
});

// Watch task
gulp.task('watch', function () {
	gulp.watch('content/**', ['pages']);
	gulp.watch('src/**/*.jade', ['pages']);
	gulp.watch('src/**/*.scss', ['styles']);
	gulp.watch('src/**/*.js', ['scripts']);
	gulp.watch('src/img/**', ['images']);
	gulp.watch('src/fonts/**', ['fonts']);
	gulp.watch('src/content/**', ['content']);
});

// Default wrapper task
var defaultTask = [
	'pages',
	'styles',
	'scripts',
	'images',
	'content'
];
if (argv.server) defaultTask.push('connect');
if (argv.watch) defaultTask.push('watch');

gulp.task('default', defaultTask);
