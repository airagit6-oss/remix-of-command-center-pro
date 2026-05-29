module.exports = {
  apps: [
    {
      name: 'remix-frontend',
      script: 'node',
      args: 'server/server.cjs',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
      },
    },
  ],
};
