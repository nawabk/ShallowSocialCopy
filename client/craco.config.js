const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#4a148c',
              '@layout-header-background': '#4a148c',
              '@layout-body-background': '#fff',
              '@avatar-size-base': '40px',
              '@avatar-size-lg': '50px',
              '@avatar-size-sm': '24px',
              '@avatar-font-size-base': '18px',
              '@avatar-font-size-lg': '30px',
              '@avatar-font-size-sm': '14px'
            },
            javascriptEnabled: true
          }
        }
      }
    }
  ]
};
