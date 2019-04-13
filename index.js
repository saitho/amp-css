module.exports = {
    process: function(options) {
        if (!options.hasOwnProperty('inputFile')) {
            throw Error('Missing option "inputFile".');
        }
        if (!options.hasOwnProperty('outputFile')) {
            throw Error('Missing option "outputFile".');
        }

        var sassOptions = {
            file: options['inputFile'],
            outFile: options['outputFile'],
            includePaths: options.hasOwnProperty('includePaths') ? options.hasOwnProperty('includePaths') : [],
            importer: function(url) {
                var sassTildeImporter = require('node-sass-tilde-importer');
                return sassTildeImporter(url);
            }
        };

        var sass = require('node-sass');
        sass.render(sassOptions, function(err, result) {
            console.log(result);
        });
    }
};