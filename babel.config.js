module.exports = {
  env: {
    test: {
      presets: [
        ['@babel/env', { targets: { node: 'current' } }],
        '@babel/react',
      ],
      plugins: [
        '@babel/syntax-dynamic-import',
        '@babel/proposal-object-rest-spread',
        '@babel/proposal-class-properties',
        ['universal-import', { disableWarnings: true }],
      ],
    },
    devClient: {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              browsers: ['android >= 5', 'ios_saf > 9', 'and_chr >= 40'],
            },
            useBuiltIns: 'entry',
          },
        ],
        '@babel/react',
      ],
      plugins: [
        ['styled-components', { ssr: true }],
        'transform-inline-environment-variables',
        '@babel/syntax-dynamic-import',
        '@babel/proposal-object-rest-spread',
        '@babel/proposal-class-properties',
        ['universal-import', { disableWarnings: true }],
        // 'react-hot-loader/babel',
      ],
    },
    prodClient: {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              browsers: ['android >= 5', 'ios_saf > 9', 'and_chr >= 40'],
            },
            useBuiltIns: 'entry',
          },
        ],
        '@babel/react',
      ],
      plugins: [
        ['styled-components', { ssr: true }],
        'transform-inline-environment-variables',
        '@babel/syntax-dynamic-import',
        '@babel/proposal-object-rest-spread',
        '@babel/proposal-class-properties',
        ['universal-import', { disableWarnings: true }],
      ],
    },
    server: {
      presets: [
        ['@babel/env', { targets: { node: 'current' } }],
        '@babel/react',
      ],
      plugins: [
        ['styled-components', { ssr: true }],
        '@babel/syntax-dynamic-import',
        '@babel/proposal-object-rest-spread',
        '@babel/proposal-class-properties',
        ['universal-import', { disableWarnings: true }],
      ],
    },
  },
};
