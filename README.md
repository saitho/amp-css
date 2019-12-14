# AMP-CSS

[![Build Status](https://travis-ci.com/saitho/amp-css.svg?branch=master)](https://travis-ci.com/saitho/amp-css)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=amp-css&metric=alert_status)](https://sonarcloud.io/dashboard?id=amp-css)
[![npm version](https://img.shields.io/npm/v/amp-css.svg)](https://www.npmjs.com/package/amp-css)
[![npm license](https://img.shields.io/npm/l/amp-css.svg)](https://www.npmjs.com/package/amp-css)
[![Known Vulnerabilities](https://snyk.io/test/github/saitho/amp-css/badge.svg)](https://snyk.io/test/github/saitho/amp-css)
[![Dependency Status](https://david-dm.org/saitho/amp-css/status.svg)](https://david-dm.org/saitho/amp-css)

AMP (Accelerated Mobile Pages) is a project by Google and the Digital News Initiative
aiming to improve the speed of websites by utilizing a special JavaScript framework.

This comes with restrictions to the size and contents of CSS.
This package provides a binary to compile SCSS files only if the resulting CSS is valid for AMP.
Also it provides a way to insert CSS into a (static) HTML page.

## Installing

```shell script
npm install --save-dev amp-css
```

or if you're using Yarn:

```shell script
yarn add --dev amp-css
```

## Command overview

### Compile SCSS to CSS

The following example will compile the file `path/to/my/scss/style.scss` into the CSS file `path/to/my/css/style.css`
if there is no invalid CSS inside and the file size does not exceed AMP's size limit.

```shell script
amp-css process path/to/my/scss/style.scss path/to/my/css/style.css
```

Alternatively you can also set an output directory. The following line does exactly the same as the line above:

```shell script
amp-css process --output-dir path/to/my/css path/to/my/scss/style.scss
```

### Inserting CSS into a HTML file

AMP requires websites to embed the stylings using inline CSS.
There is a command that will look for the "Custom AMP CSS" area in a HTML file
and overwrite its contents with the content of a given CSS file.

```shell script
amp-css assign -s mycss.css index.html
```

## Using in build scripts

We recommend defining scripts inside your projects package.json:

```json
"scripts": {
    "build": "npm run-script build-css && npm run-script assign-css",
    "build-css": "amp-css process -s assets/scss/styles.scss assets/css/styles.css",
    "assign-css": "amp-css assign -s assets/css/styles.css index.html"
}
```

In the example above calling `npm run-script build` (or `yarn build`) will compile the CSS file and insert it into the _index.html_ file.

## Processing multiple files

There currently is no support for compiling multiple SCSS files or inserting multiple CSS files.
I currently don't see a use case for that.

If your stylings consists of multiple stylings, `@import` them all in one SCSS file which you then compile.