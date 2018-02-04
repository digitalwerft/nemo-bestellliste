let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js/app.js')
//  .js('resources/assets/js/app.js', 'public/fundraiser/js/app.js')
//    .sass('resources/assets/sass/app.scss', 'public/fundraiser/css/app.css')
  .sass('resources/assets/sass/app.scss', 'public/css/app.css')
    .sourceMaps();

mix.browserSync({
  proxy: 'nemo.local'
});
