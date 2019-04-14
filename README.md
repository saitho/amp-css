# AMP-CSS

## Example

Scripts section in package.json
```json
"scripts": {
    "build": "npm run-script build-css && npm run-script assign-css",
    "build-css": "amp-css process -s --include-path assets/scss assets/scss/styles.scss > assets/css/styles.css",
    "assign-css": "amp-css assign -s assets/css/styles.css index.html"
}
```