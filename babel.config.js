module.exports = {
  presets: [ 
    ['@babel/preset-react', { runtime: 'automatic' }],
    ['next/babel']
  ],
  plugins: [
    [
      '@emotion',
      {
        sourceMap: true,
        autoLabel: 'dev-only',
        labelFormat: '[filename]--[local]'
      }
    ]
  ]
};
