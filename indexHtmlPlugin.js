const HtmlWebpackPlugin = require('html-webpack-plugin');
function MyPlugin(options) {
    this.options = options;
}
MyPlugin.prototype.apply = function (compiler) {
    const env = this.options.env;
    const res = this.options.version;
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
        // Static Plugin interface |compilation |HOOK NAME | register listener
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
            'MyPlugin', // <-- Set a meaningful name here for stacktraces
            (data, cb) => {
                // Manipulate the content
                if (env && env == 'production') {
                    let regExp = new RegExp('https://rainbow-doc.insuremo.com', 'g');
                    data.html = data.html.replace(regExp, '')
                        .replace('vendor.min.css', 'vendor.min.css?v=' + res)
                        .replace('core.min.css', 'core.min.css?v=' + res)
                        .replace('ajax.min.js', 'ajax.min.js?v=' + res)
                        .replace('vendor.min.js', 'vendor.min.js?v=' + res)
                        .replace('foundation.min.js', 'foundation.min.js?v=' + res);
                }
                // Tell webpack to move on
                cb(null, data);
            }
        );
    });
};

module.exports = MyPlugin;