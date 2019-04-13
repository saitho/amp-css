function validateAmp(source) {
    var ampBoilerplate = '<!DOCTYPE html>' +
        '<html amp>' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">' +
        '<link rel="canonical" href="index.html">' +
        '<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>' +
        '<script async src="https://cdn.ampproject.org/v0.js"></script>' +
        '<style amp-custom type="text/css">#CUSTOM_CSS#</style>' +
        '</head>' +
        '<body></body>' +
        '</html>';
    var amphtmlValidator = require('amphtml-validator');
    amphtmlValidator.getInstance().then(function (validator) {
        var result = validator.validateString(ampBoilerplate.replace('#CUSTOM_CSS#', source));

        if (result.status !== 'PASS') {
            var msg = "";
            for (var ii = 0; ii < result.errors.length; ii++) {
                var error = result.errors[ii];
                msg += 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
                if (error.specUrl !== null) {
                    msg += ' (see ' + error.specUrl + ')\n';
                }
            }
            console.error('[AMP] AMP validation failed!');
            console.error(msg);
            throw Error(msg);
        }
    });
}

function removeImportant(source) {
    return source.replace(/!important/g, '');
}

function compileSassToCss(options) {
    return new Promise((resolve, reject) => {
        var sassOptions = {
            file: options['inputFile'],
            includePaths: options.hasOwnProperty('includePaths') ? options.includePaths : [],
            importer: require('node-sass-tilde-importer')
        };

        var sass = require('node-sass');
        sass.render(sassOptions, function(err, result) {
            resolve(result.css.toString());
        });
    });
}

module.exports = {
    process: function(options) {
        if (!options.hasOwnProperty('inputFile')) {
            throw Error('Missing option "inputFile".');
        }
        if (!options.hasOwnProperty('outputFile')) {
            throw Error('Missing option "outputFile".');
        }
        options.sanitize = options.hasOwnProperty('sanitize') ? options.sanitize : false;

        compileSassToCss(options)
            .then((css) => {
                const byteSize = Buffer.from(css).byteLength;
                if (byteSize > 50000) {
                    throw Error('[AMP] CSS file size extends 50kb!');
                }

                if (options.sanitize) {
                    css = removeImportant(css);
                }

                validateAmp(css);
                console.log(css);
            }).catch((error) => console.error(error));
    }
};