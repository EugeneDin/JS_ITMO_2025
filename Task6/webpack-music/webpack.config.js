// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/script.js',           // точка входа
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
}
