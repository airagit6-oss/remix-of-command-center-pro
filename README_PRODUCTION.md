Production deployment quick-start

1) Prepare VPS
  - Create a non-root deploy user or use existing SSH key-based access.
  - Install Node 18+, Nginx, Git, and PM2 on VPS.

2) Place secrets on VPS (do NOT commit to git):
  - Create `/root/apps/remix-of-command-center-pro/.env.production` from `.env.production.example` and fill values.

3) Initial clone on VPS (one-time):
  ssh user@your-vps
  mkdir -p /root/apps
  cd /root/apps
  git clone REPO_URL remix-of-command-center-pro

4) Deploy with the included script (run locally with SSH access):
  export SSH_USER=root
  export SSH_HOST=your.vps.ip.or.hostname
  export APP_DIR=/root/apps/remix-of-command-center-pro
  ./scripts/deploy_prod.sh

5) Verify
  - Application health: `curl -I https://your.domain/healthz`
  - PM2 status: `pm2 status` on the VPS
  - Nginx logs: `/var/log/nginx/error.log`

Notes
  - This repo now contains a minimal Node static server at `server/server.cjs` and a PM2 `ecosystem.config.js`.
  - `docker/prod.Dockerfile` is provided for containerized builds if you prefer Docker images.
  - `docker/nginx.conf.template` is a starting nginx config — replace domain and SSL paths.
  - Never paste credentials into PRs or public commits. Use server-side env files or secrets manager.
