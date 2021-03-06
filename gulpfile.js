const del = require('del');
const gulp = require('gulp');

const bom = require('gulp-bom');


const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const jsImport = require('gulp-js-import-moo');
// const postcss = require('gulp-postcss');
// const atImport = require('postcss-import');
const header = require('gulp-header');
const dateFormat = require('dateformat');


// const pkg = require('./package.json');
const pkg = require('./project-package.json');


const stripDebug = require('gulp-strip-debug');
const usemin = require('gulp-usemin');

// const sass = require('gulp-sass');
// const autoprefixer = require('gulp-autoprefixer');
// const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
// const clean = require('gulp-clean');
// const cache = require('gulp-cache');
const pug = require('gulp-pug');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const browsersync = require('browser-sync').create();
// const reload = browsersync.reload;
const stylus = require('gulp-stylus');
const colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

const getTime = (formats) => {
    const now = new Date();
    return dateFormat(now, formats);
};

const now = getTime("yyyy-mm-dd HH:MM:ss");

const banner = `/**
 * Copyright (c) 2007 - ${getTime("yyyy")} XINHUANET.com All Rights Reserved.
 * ${pkg.name} v${pkg.version}
 * ${now}
 */

`;
const bannerCSS_charset_utf_8 = `@charset "utf-8";
${banner}`;

gulp.task('usemin', function () {
    gulp
        .src([
            // './index.html',
        ])
        .pipe(usemin(
            {
                // js: [],
                // css: [],
                // css: [rev],
                // html: [function () { return htmlmin({ collapseWhitespace: true }); }],
                // js: [uglify, rev],
                // inlinejs: [uglify],
                // inlinecss: [cleanCss, 'concat']
            }
        ))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean-dist-bundle', function (cb) {
    del([
        'dist/bundle/',
        // ????????????????????????????????????????????? `mobile` ???????????????????????????
        // 'dist/mobile/**/*',
        // ????????????????????????????????????????????????????????????????????????
        // '!dist/mobile/deploy.json'
    ], cb);
});

const MAIN_dist = pkg.dev_url;

gulp.task('browsersync', function () {
    var files = [
        MAIN_dist + '*.htm',
        MAIN_dist + '*.html',
        MAIN_dist + 'js/*.js',
        MAIN_dist + 'js/inc/*.js',
        MAIN_dist + 'js/mod/*.js',
        MAIN_dist + 'bundle/*.css',
        MAIN_dist + 'bundle/*.js',
        MAIN_dist + 'bundle/*.png',
        MAIN_dist + 'bundle/*.jpg',
        MAIN_dist + 'bundle/*.gif',
        MAIN_dist + 'pug/*.pug',
        MAIN_dist + 'pug/inc/*.pug',
        MAIN_dist + 'styl/*.styl',
    ];

    browsersync
        .init(files, {
            server: {
                baseDir: './',
                // https: true,
            },
            notify: true,
            // open: false,
            browser: ["google chrome"],
            startPath: MAIN_dist,
        });
});

// pug
gulp.task('pug', function () {
    gulp
        .src(MAIN_dist + 'pug/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(MAIN_dist));
});

gulp.task('js', () => {
    gulp
        .src([
            MAIN_dist + 'js/index.js',
            MAIN_dist + 'js/pages.js',
        ])
        .pipe(jsImport({
            // hideConsole: 1
        }))
        .pipe(gulp.dest('import'))
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) //????????????
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(bom())
        .pipe(gulp.dest(MAIN_dist + 'bundle'));
});

gulp.task('styl', function () {
    gulp
        .src([
            MAIN_dist + 'styl/index.styl',
            MAIN_dist + 'styl/pages.styl',
        ])
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(stylus())
        .pipe(bom())
        .pipe(gulp.dest(MAIN_dist + 'bundle'));
});

gulp.task('autowatch', function () {
    gulp.watch(MAIN_dist + 'pug/*.pug', ['pug']);
    gulp.watch(MAIN_dist + 'pug/inc/*.pug', ['pug']);

    gulp.watch(MAIN_dist + 'js/*.js', ['js']);
    gulp.watch(MAIN_dist + 'js/inc/*.js', ['js']);
    gulp.watch(MAIN_dist + 'js/mod/*.js', ['js']);

    gulp.watch(MAIN_dist + 'styl/*.styl', ['styl']);
    gulp.watch(MAIN_dist + 'styl/inc/*.styl', ['styl']);

});

// gulp
gulp.task('default', [
    'autowatch',
    'browsersync',
    // 'TIPS2',
]);

// --------------- build
gulp.task('built-js', function () {
    gulp
        .src([
            MAIN_dist + 'bundle/index.js',
            // MAIN_dist + 'bundle/xa-labs-analytics.min.js',
        ])
        .pipe(concat('index.min.js')) //?????????????????????
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) //????????????
        .pipe(stripDebug()) // ?????? console
        .pipe(uglify())
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) //????????????
        .pipe(header(banner))
        .pipe(bom())
        .pipe(gulp.dest(MAIN_dist + 'bundle'));
});


gulp.task('built-js-pages', function () {
    gulp
        .src([
            MAIN_dist + 'bundle/pages.js',
            // MAIN_dist + 'bundle/xa-labs-analytics.min.js',
        ])
        .pipe(concat('pages.min.js')) //?????????????????????
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) //????????????
        .pipe(stripDebug()) // ?????? console
        .pipe(uglify())
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) //????????????
        .pipe(header(banner))
        .pipe(bom())
        .pipe(gulp.dest(MAIN_dist + 'bundle'));
});


gulp.task('built LAreaData1.js', function () {
    gulp
        .src([
            MAIN_dist + 'bundle/LAreaData1.js',
            // MAIN_dist + 'bundle/xa-labs-analytics.min.js',
        ])
        .pipe(concat('LAreaData1.min.js')) //?????????????????????
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) //????????????
        .pipe(stripDebug()) // ?????? console
        .pipe(uglify())
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) //????????????
        .pipe(header(banner))
        .pipe(bom())
        .pipe(gulp.dest(MAIN_dist + 'bundle'));
});

// gulp.task('built-all', function () {
//     gulp
//         .src([
//             MAIN_dist + 'bundle/browser.min.js',
//             MAIN_dist + 'bundle/jq.js',
//             MAIN_dist + 'bundle/jplayer/jquery.jplayer.min.js',
//             // MAIN_dist + 'bundle/qrcode.min.js',
//             MAIN_dist + 'bundle/index.min.js',
//             MAIN_dist + 'bundle/xa-labs-analytics.min.js',
//         ])
//         .pipe(concat('index.all.min.js')) //?????????????????????
//         .pipe(plumber({
//             errorHandler: notify.onError('Error: <%= error.message %>')
//         })) //????????????
//         .pipe(header(banner))
//         .pipe(gulp.dest(MAIN_dist + 'bundle'));
// });

gulp.task('built-css', function () {
    gulp
        .src([
            MAIN_dist + 'bundle/index.css',
        ])
        .pipe(rename('index.min.css'))
        .pipe(cleancss({
            advanced: true, //?????????Boolean ?????????true [????????????????????????????????????????????????]
            compatibility: 'ie8', //??????ie8????????????????????? ?????????String ?????????''or'*' [????????????????????? 'ie7'???IE7???????????????'ie8'???IE8???????????????'*'???IE9+????????????]
            keepBreaks: true, //?????????Boolean ?????????false [??????????????????]
            keepSpecialComments: '*'
            //???????????????????????? ?????????autoprefixer?????????????????????????????????????????????????????????????????????????????????????????????
        }))
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) //????????????
        .pipe(header(bannerCSS_charset_utf_8))
        .pipe(bom())
        .pipe(gulp.dest(MAIN_dist + 'bundle'));
});

gulp.task('built-css-pages', function () {
    gulp
        .src([
            MAIN_dist + 'bundle/pages.css',
        ])
        .pipe(rename('pages.min.css'))
        .pipe(cleancss({
            advanced: true, //?????????Boolean ?????????true [????????????????????????????????????????????????]
            compatibility: 'ie8', //??????ie8????????????????????? ?????????String ?????????''or'*' [????????????????????? 'ie7'???IE7???????????????'ie8'???IE8???????????????'*'???IE9+????????????]
            keepBreaks: true, //?????????Boolean ?????????false [??????????????????]
            keepSpecialComments: '*'
            //???????????????????????? ?????????autoprefixer?????????????????????????????????????????????????????????????????????????????????????????????
        }))
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        })) //????????????
        .pipe(header(bannerCSS_charset_utf_8))
        .pipe(gulp.dest(MAIN_dist + 'bundle'));
});

gulp.task('addBom', function () {
    gulp.src(MAIN_dist + 'index.html')
        .pipe(bom())
        .pipe(rename('index.htm'))
        .pipe(gulp.dest(MAIN_dist));
});

gulp.task('TIPS:', function (params) {
    /**
    colors.setTheme({
        silly: 'rainbow',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        debug: 'blue',
        error: 'red'
    });
    */
    console.log('[' + `${now}`.input + ']' + `\nGulp Finish build ==//==>`.green + ` ${pkg.name}`.grey + ` Build v${pkg.version}`.error);
});

// gulp.task('TIPS2', function (params) {
//     /**
//     colors.setTheme({
//         silly: 'rainbow',
//         input: 'grey',
//         verbose: 'cyan',
//         prompt: 'grey',
//         info: 'green',
//         data: 'grey',
//         help: 'cyan',
//         warn: 'yellow',
//         debug: 'blue',
//         error: 'red'
//     });
//     */
//     console.log('[' + `${now}`.input + ']' + `\nGulp is Run ==//==>`.green + `: 
//               http://localhost:3000/${pkg.dev_url}`.red);
// });

// build all in the packjson.json ==> npm run build
gulp.task('build', [
    // 'built LAreaData1.js',
    'built-css',
    'built-js',
    'addBom',
    // 'built-css-pages',
    // 'built-js-pages',
    // `usemin: long-pic`,
    // `clean-dist: qndj`
    'TIPS:',
]);