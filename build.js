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

// Adicione ao final do seu build.js
console.log('Copiando arquivos estáticos...');

// Lista de arquivos para copiar
const staticFiles = [
  'foto.png',
  'favicon.ico'
];

// Cria diretório para imagens se necessário
fs.mkdirSync(path.join(BUILD_DIR, 'img'), { recursive: true });

// Copia cada arquivo
staticFiles.forEach(file => {
  try {
    const src = path.join(SRC_DIR, file);
    const dest = path.join(BUILD_DIR, file);
    
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✓ Arquivo copiado: ${file}`);
    } else {
      console.warn(`⚠ Arquivo não encontrado: ${file}`);
    }
  } catch (err) {
    console.error(`× Erro ao copiar ${file}:`, err);
  }
});
