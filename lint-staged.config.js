const micromatch = require('micromatch');

module.exports = {
  '*.html': (files) => {
    // from `files` filter those _NOT_ matching `given options`
    const match = micromatch.not(files, [
      'build/*.html',
      'source/includes/**/*.html',
      'node_modules/*',
    ]);
    return match.map((file) => `htmlhint ${file}`);
  },
  '*.{css,scss}': () => 'stylelint',
  '*.js': () => ['eslint', 'git add'],
};
