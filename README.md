# AMP-CSS

## Example

Scripts section in package.json
```json
"scripts": {
    "build": "npm run-script build-css && npm run-script assign-css",
    "build-css": "amp-css process -s assets/scss/styles.scss assets/css/styles.css",
    "assign-css": "amp-css assign -s assets/css/styles.css index.html"
}
```

## Examples

### Compile valid CSS

amp-css process test/files/valid-css.scss mycss.css

### Compile invalid CSS

amp-css process test/files/invalid-css.scss mycss.css

### Compile SCSS file into a directory

amp-css process --output-dir output-dir tests/files/valid-css.scss

### Assign CSS file to a html file

amp-css assign -s mycss.css index.html