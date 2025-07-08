const less = require('less');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const NpmImportPlugin = require('less-plugin-npm-import');
const { getConfig } = require('./utils/projectHelper');
const { theme } = require('ant-design-vue/lib');
const convertLegacyToken = require('ant-design-vue/lib/theme/convertLegacyToken');

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v3Token = convertLegacyToken.default(mapToken);

function transformLess(lessContent, lessFilePath, config = {}) {
    const { cwd = process.cwd() } = config;
    const { compile: { lessConfig } = {} } = getConfig();
    const resolvedLessFile = path.resolve(cwd, lessFilePath);

    // Do less compile
    const lessOpts = {
        paths: [path.dirname(resolvedLessFile)],
        filename: resolvedLessFile,
        plugins: [new NpmImportPlugin({ prefix: '~' })],
        javascriptEnabled: true,
        ...lessConfig,
        modifyVars: v3Token
    };
    return less
        .render(lessContent, lessOpts)
        .then((result) =>
            postcss([autoprefixer]).process(result.css, { from: undefined }),
        )
        .then((r) => r.css);
}

module.exports = transformLess;
