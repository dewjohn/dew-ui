import { globals as browserGlobals } from 'globals'
import { globals as nodeGlobals } from 'globals/node'
import pluginJs from '@eslint/js'
import { configs, parser } from '@typescript-eslint/eslint-plugin'
import pluginVue from 'eslint-plugin-vue'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
    languageOptions: {
      globals: {
        ...browserGlobals,
        ...nodeGlobals
      },
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true // 启用 JSX 支持
      }
    },
    extends: [
      pluginJs.configs.recommended,
      ...configs.recommended,
      ...pluginVue.configs['flat/essential']
    ],
    rules: {
      // 禁用 vue/multi-word-component-names 规则
      'vue/multi-word-component-names': 'off',
      // 禁用 @typescript-eslint/no-explicit-any 规则
      '@typescript-eslint/no-explicit-any': 'off',
      // 忽略名为 'h' 的参数
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^h$' }
      ]
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parser, // 使用 TypeScript 解析器
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true // 启用 JSX 支持
        }
      }
    },
    rules: {
      // 确保 Vue 文件中的规则与上面一致
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^h$' }
      ]
    }
  }
]
