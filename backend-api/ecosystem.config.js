module.exports = {
  apps: [
    {
      script: './app.js',
      name: 'Markets Act Service',
      watch: './src',
      env: {
        NODE_ENV: 'dev',
      },
      env_production: {
        NODE_ENV: 'staging',
      },
      env_testing: {
        NODE_ENV: 'testing',
        PORT: 7001,
      },
    },
  ],
};
