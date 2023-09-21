module.exports = {
  '**/*.(ts|tsx)': () => 'npx tsc --noEmit',

  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `next lint --fix --dir src`,
    `npx eslint --fix ${filenames.join(' ')}`,
    `npx prettier --write ${filenames.join(' ')}`,
  ],

  '**/*.(md|json|css|mdx)': (filenames) => `npx prettier --write ${filenames.join(' ')}`,
};
