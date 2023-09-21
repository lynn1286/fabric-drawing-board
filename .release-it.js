module.exports = {
  git: {
    commitMessage: 'chore(release): :bookmark: v${version}',
  },
  hooks: {
    'after:bump': 'echo 更新版本成功',
  },
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      header: '# 📋 更新历史 \n\n',
      preset: {
        name: 'conventionalcommits',
        types: [
          { type: 'feat', section: '✨ Features | 新功能' },
          { type: 'fix', section: '🐛 Bug Fixes | Bug 修复' },
          { type: 'perf', section: '⚡ Performance Improvements | 性能优化' },
          { type: 'revert', section: '⏪ Reverts | 回退' },
          { type: 'chore', section: '📦 Chores | 其他更新' },
          { type: 'docs', section: '📝 Documentation | 文档' },
          { type: 'style', section: '💄 Styles | 风格' },
          { type: 'refactor', section: '♻ Code Refactoring | 代码重构' },
          { type: 'test', section: '✅ Tests | 测试' },
          { type: 'build', section: '👷‍ Build System | 构建' },
          { type: 'ci', section: '🔧 Continuous Integration | CI 配置' },
        ],
        commitUrlFormat: '',
      },
    },
  },
};
