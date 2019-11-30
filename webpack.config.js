const Encore = require("@symfony/webpack-encore");

Encore
    .setOutputPath("public/build/")
    .setPublicPath("/build")
    .addEntry("app", "./assets/js/app.ts")
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .enableTypeScriptLoader()
    .enableSassLoader()
;

module.exports = Encore.getWebpackConfig();
