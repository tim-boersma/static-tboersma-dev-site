import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',

      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['default', 'index']
        }
      ]
    }
  })