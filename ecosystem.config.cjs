/**
 * PM2 ECOSYSTEM CONFIG — ZERO-DOWNTIME ENABLED
 *
 * Cluster mode + graceful reload for zero-downtime deploys.
 * Use `pm2 reload command-center-api` (NOT restart/delete) during deploys
 * to keep at least one worker handling traffic at all times.
 *
 * Graceful shutdown contract:
 *  - SIGINT received  -> stop accepting new connections, drain in-flight
 *  - kill_timeout      -> hard-kill if drain exceeds this
 *  - listen_timeout    -> max time PM2 waits for `ready` from new worker
 *  - wait_ready        -> requires server to call `process.send('ready')`
 */
module.exports = {
  apps: [
    {
      name: 'command-center-api',
      script: 'dist-server/index.js',
      cwd: '/root/apps/remix-of-command-center-pro',

      // Cluster mode is required for zero-downtime `pm2 reload`
      instances: 'max',
      exec_mode: 'cluster',

      node_args: '--max-old-space-size=512',

      env_production: {
        NODE_ENV: 'production',
        SERVER_PORT: 4000,
      },

      // Restart governance
      watch: false,
      max_memory_restart: '512M',
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: '10s',
      exp_backoff_restart_delay: 200,

      // Zero-downtime reload contract
      wait_ready: true,             // wait for `process.send('ready')`
      listen_timeout: 15000,        // 15s for new worker to be ready
      kill_timeout: 10000,          // 10s drain window for in-flight requests
      shutdown_with_message: true,
      treekill: false,

      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/root/apps/logs/api-error.log',
      out_file: '/root/apps/logs/api-out.log',
      merge_logs: true,

      // Source map support for clearer stack traces
      source_map_support: true,
    },
  ],
};
