module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'module:react-native-dotenv',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@': './src',
          '@assets': './src/assets',
          '@api': './src/api',
          '@components': './src/components',
          '@context': './src/context',
          '@hooks': './src/hooks',
          '@navigator': './src/navigator',
          '@screens': './src/screens',
          '@styles': './src/styles',
          '@types': './src/types',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ], // 추가
};
