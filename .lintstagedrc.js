module.exports = {
  '**/*.(ts|tsx)': () => 'npx tsc --noEmit',

  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `pnpm lint`,
    `npx prettier --write ${filenames.join(' ')}`,
  ],

  '**/*.(md|json|css|mdx)': (filenames) => `npx prettier --write ${filenames.join(' ')}`,
};
