const fs = require('fs');
const path = require('path');
const uglifyJS = require('uglify-js');
const cleanCSS = require('clean-css');
const htmlMinifier = require('html-minifier');

// Configurações de build
const BUILD_DIR = path.join(__dirname, 'dist');
const SRC_DIR = __dirname;

// Criar diretório de build se não existir
if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR);
}

// Minificar CSS
const cssContent = fs.readFileSync(path.join(SRC_DIR, 'styles.css'), 'utf8');
const minifiedCSS = new cleanCSS().minify(cssContent).styles;
fs.writeFileSync(path.join(BUILD_DIR, 'styles.min.css'), minifiedCSS);

// Minificar JS
const jsContent = fs.readFileSync(path.join(SRC_DIR, 'script.js'), 'utf8');
const minifiedJS = uglifyJS.minify(jsContent).code;
fs.writeFileSync(path.join(BUILD_DIR, 'script.min.js'), minifiedJS);

// Minificar HTML
const htmlContent = fs.readFileSync(path.join(SRC_DIR, 'index.html'), 'utf8');
const minifiedHTML = htmlMinifier.minify(htmlContent, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true
});
// Copiar imagens e outros arquivos estáticos
fs.copyFileSync(path.join(SRC_DIR, 'foto.png'), path.join(BUILD_DIR, 'foto.png'));

console.log('Build completed successfully!');
