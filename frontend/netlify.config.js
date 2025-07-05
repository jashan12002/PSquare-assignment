module.exports = {
  headers: () => {
    return [
      {
        source: '/:path*.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/javascript',
          },
        ],
      },
      {
        source: '/:path*.jsx',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/javascript',
          },
        ],
      },
      {
        source: '/:path*.mjs',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/javascript',
          },
        ],
      },
    ];
  },
}; 