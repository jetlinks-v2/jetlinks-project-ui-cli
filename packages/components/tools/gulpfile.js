/* eslint-disable no-console */
const { getProjectPath, getConfig } = require('./utils/projectHelper');
const runCmd = require('./runCmd');
const getBabelCommonConfig = require('./getBabelCommonConfig');
const merge2 = require('merge2');
const through2 = require('through2');
const webpack = require('webpack');
const babel = require('gulp-babel');
const argv = require('minimist')(process.argv.slice(2));

const path = require('path');
const ts = require('gulp-typescript');
const gulp = require('gulp');
const rimraf = require('rimraf');
const stripCode = require('gulp-strip-code');
const getTSCommonConfig = require('./getTSCommonConfig');
const replaceLib = require('./replaceLib');

const { glob } = require('glob');
const fs = require("fs");
const tsDefaultReporter = ts.reporter.defaultReporter();
const cwd = process.cwd();
const libDir = getProjectPath('lib');
const esDir = getProjectPath('es');
const localeDir = getProjectPath('src/locale');

const localeDts = `import type { Locale } from '../lib/locale-provider';
declare const localeValues: Locale;
export default localeValues;`;

const tsConfig = getTSCommonConfig();

function dist(done) {
    rimraf.sync(path.join(cwd, 'dist'));

    console.log('build dist ...');
    process.env.RUN_ENV = 'PRODUCTION';
    const webpackConfig = require(getProjectPath('webpack.build.conf.js'));
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            console.error('webpack-error', err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }

        const info = stats.toJson();
        const { dist: { finalize } = {}, bail } = getConfig();

        if (stats.hasErrors()) {
            (info.errors || []).forEach((error) => {
                console.error(error);
            });
            // https://github.com/ant-design/ant-design/pull/31662
            if (bail) {
                process.exit(1);
            }
        }
        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }

        const buildInfo = stats.toString({
            colors: true,
            children: true,
            chunks: false,
            modules: false,
            chunkModules: false,
            hash: false,
            version: false,
        });
        console.log(buildInfo);
        // Additional process of dist finalize
        if (finalize) {
            console.log('[Dist] Finalization...');
            finalize();
        }
        done(0);
    });
}

const tsFiles = [
    '**/*.ts',
    '**/*.tsx',
    '!node_modules/**/*.*',
    'typings/**/*.d.ts',
];

function compileTs(stream) {
    return stream
        .pipe(ts(tsConfig))
        .js.pipe(
            through2.obj(function (file, encoding, next) {
                // console.log(file.path, file.base);
                file.path = file.path.replace(/\.[jt]sx$/, '.js');
                this.push(file);
                next();
            }),
        )
        .pipe(gulp.dest(process.cwd()));
}

gulp.task('tsc', () =>
    compileTs(
        gulp.src(tsFiles, {
            base: cwd,
        }),
    ),
);

function babelify(js, modules) {
    const babelConfig = getBabelCommonConfig(modules);
    babelConfig.babelrc = false;
    delete babelConfig.cacheDirectory;
    if (modules === false) {
        babelConfig.plugins.push(replaceLib);
    }
    const stream = js.pipe(babel(babelConfig)).pipe(
        through2.obj(function z(file, encoding, next) {
            this.push(file.clone());
            if (modules !== false) {
                const content = file.contents.toString(encoding);
                file.contents = Buffer.from(
                    content
                        .replace(/lodash-es/g, 'lodash')
                        .replace(
                            /@ant-design\/icons-vue/g,
                            '@ant-design/icons-vue/lib/icons',
                        ),
                );
                this.push(file);
            }
            next();
        }),
    );
    return stream.pipe(gulp.dest(modules === false ? esDir : libDir));
}

function compile(modules) {
    const {
        compile: {
            transformTSFile,
            transformFile,
            transformVue,
        } = {},
    } = getConfig();
    rimraf.sync(modules !== false ? libDir : esDir);

  const assets = gulp
    .src(['src/**/*.@(png|svg)'])
    .pipe(gulp.dest(modules === false ? esDir : libDir));
  let error = 0;

    // =============================== FILE ===============================
    let transformFileStream;
    if (transformFile) {
        transformFileStream = gulp
            .src(['src/**/*.tsx'])
            .pipe(
                through2.obj(function (file, encoding, next) {
                    let nextFile = transformFile(file, modules) || file;
                    nextFile = Array.isArray(nextFile) ? nextFile : [nextFile];
                    nextFile.forEach((f) => this.push(f));
                    next();
                }),
            )
            .pipe(gulp.dest(modules === false ? esDir : libDir));
    }

    // ================================ TS ================================
    const source = [
        'src/**/*.js',
        'src/**/*.jsx',
        'src/**/*.tsx',
        'src/**/*.ts',
        'typings/**/*.d.ts',
    ];

    const vueSource = ['src/**/*.vue'];

    // Strip content if needed
    let sourceStream = gulp.src(source);
    let sourceVueStream = gulp.src(vueSource);
    if (modules === false) {
        sourceStream = sourceStream.pipe(
            stripCode({
                start_comment: '@remove-on-es-build-begin',
                end_comment: '@remove-on-es-build-end',
            }),
        );
    }

    if (transformTSFile) {
        sourceStream = sourceStream.pipe(
            through2.obj(function (file, encoding, next) {
                let nextFile = transformTSFile(file) || file;
                console.log(file.path);
                nextFile = Array.isArray(nextFile) ? nextFile : [nextFile];
                nextFile.forEach((f) => this.push(f));
                next();
            }),
        );
    }

    if (transformVue) {
        sourceVueStream = sourceVueStream
            .pipe(
                through2.obj(function (file, encoding, next) {
                    let nextFile = transformVue(file) || file;
                    nextFile = Array.isArray(nextFile) ? nextFile : [nextFile];
                    nextFile.forEach((f) => this.push(f));
                    next();
                }),
            )
            .pipe(
                ts(tsConfig, {
                    error(e) {
                        tsDefaultReporter.error(e);
                        error = 1;
                    },
                    finish: tsDefaultReporter.finish,
                }),
            )
            .pipe(gulp.dest(modules === false ? esDir : libDir));
    }

    const tsResult = sourceStream.pipe(
        ts(tsConfig, {
            error(e) {
                tsDefaultReporter.error(e);
                error = 1;
            },
            finish: tsDefaultReporter.finish,
        }),
    );

    function check() {
        console.log('error', error);
        if (error && !argv['ignore-error']) {
            process.exit(1);
        }
    }

    tsResult.on('finish', check);
    tsResult.on('end', check);
    const tsFilesStream = babelify(tsResult.js, modules);
    const tsd = tsResult.dts.pipe(
        gulp.dest(modules === false ? esDir : libDir),
    );
    return merge2(
        [
            tsFilesStream,
            tsd,
            assets,
            sourceVueStream,
            transformFileStream,
        ].filter((s) => s),
    );
}

function generateLocale() {
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir);
  }

  const localeFiles = glob.sync('src/locale/*.ts?(x)');
  localeFiles.forEach(item => {
    const match = item.match(/src\/locale\/(.*)\.tsx?/);
    if (match) {
      const locale = match[1];
      fs.writeFileSync(
        path.join(localeDir, `${locale}.js`),
        `module.exports = require('../lib/locale/${locale}');`,
      );
      fs.writeFileSync(path.join(localeDir, `${locale}.d.ts`), localeDts);
    }
  });
}


function publish(tagString, done) {
    let args = ['publish', '--with-antd-tools'];
    if (tagString) {
        args = args.concat(['--tag', tagString]);
    }
    const publishNpm = process.env.PUBLISH_NPM_CLI || 'npm';
    runCmd(publishNpm, args, (code) => {
        done(code);
    });
}

let startTime = new Date();
gulp.task('compile-with-es', (done) => {
    console.log('start compile at ', startTime);
    console.log('[Parallel] Compile to es...');
    compile(false).on('finish', done);
});

gulp.task('compile-with-lib', (done) => {
    console.log('[Parallel] Compile to js...');
    compile().on('finish', () => {
      generateLocale();
      done();
    });
});

gulp.task('compile-finalize', (done) => {
    // Additional process of compile finalize
    const { compile: { finalize } = {} } = getConfig();
    if (finalize) {
        console.log('[Compile] Finalization...');
        finalize();
    }
    done();
});

gulp.task(
    'compile',
    gulp.series(
        gulp.parallel('compile-with-lib','compile-with-es'),
        'compile-finalize',
        (done) => {
            console.log('end compile at ', new Date());
            console.log('compile time ', (new Date() - startTime) / 1000, 's');
            done();
        },
    ),
);

gulp.task(
    'dist',
    gulp.series((done) => {
        dist(done);
    }),
);
