module.exports = {
  extends: 'standard',
  plugins: [
    'standard',
    'jsx-a11y',
    'react'
  ],
  env: {
    mocha: true
  },
  parserOptions: {
    ecmaVersion: 2017
  },
  rules: {
    // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],
    'react/jsx-no-undef': 'error',
    'react/jsx-pascal-case': ['error', {
      allowAllCaps: true,
      ignore: []
    }],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-is-mounted': 'error',
    'react/react-in-jsx-scope': 'error',
    'react/require-render-return': 'error',

    // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/img-has-alt': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/no-access-key': 'error'
  }
}
