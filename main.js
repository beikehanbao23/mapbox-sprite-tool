var spritezero = require('@mapbox/spritezero');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
 
[1, 2, 4].forEach(function(pxRatio) {
    var svgs = glob.sync(path.resolve(path.join(__dirname, 'input/*.svg')))
        .map(function(f) {
            return {
                svg: fs.readFileSync(f),
                id: path.basename(f).replace('.svg', '')
            };
        });
    var _ext = "";
    if(pxRatio > 1) _ext = "@" + pxRatio + "x";
    var pngPath = path.resolve(path.join(__dirname, 'output/sprite' + _ext + '.png'));
    var jsonPath = path.resolve(path.join(__dirname, 'output/sprite' + _ext + '.json'));
 
    // Pass `true` in the layout parameter to generate a data layout
    // suitable for exporting to a JSON sprite manifest file.
    spritezero.generateLayout({ imgs: svgs, pixelRatio: pxRatio, format: true }, function(err, dataLayout) {
        if (err) return;
        fs.writeFileSync(jsonPath, JSON.stringify(dataLayout));
    });
 
    // Pass `false` in the layout parameter to generate an image layout
    // suitable for exporting to a PNG sprite image file.
    spritezero.generateLayout({ imgs: svgs, pixelRatio: pxRatio, format: false }, function(err, imageLayout) {
        spritezero.generateImage(imageLayout, function(err, image) {
            if (err) return;
            fs.writeFileSync(pngPath, image);
        });
    });
 
});
