import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', '**/node_modules/**', 'dist', '**/dist/**', '*.css', '**/*.css/**', '*.jpg', '**/*.jpg/**', '*.jpeg', '**/*.jpeg/**', '*.png', '**/*.png/**', '*.gif', '**/*.gif/**', '*.d.ts', '**/*.d.ts/**'],
  formatters: true,
  vue: true,
  typescript: true,
})
