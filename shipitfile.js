require('dotenv').config();

module.exports = shipit => {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  const appName = 'flightless-nerd-cms';

  shipit.initConfig({
    default: {
      deployTo: process.env.SERVER_DEPLOY_PATH,
      repositoryUrl: process.env.GIT_REPO_URL,
      keepReleases: 5,
      // shared: {
      //   overwrite: true,
      //   dirs: [ 'node_modules' ]
      // }
    },
    production: {
      servers: `${process.env.SSH_USER}@${process.env.SERVER_IP}`
    }
  });

  const path = require('path');
  const ecosystemFilePath = path.join(
    shipit.config.deployTo,
    'shared',
    'ecosystem.config.js'
  );

  // Event Listeners
  shipit.on('updated', () => {
    shipit.start('npm-install', 'copy-config');
  });

  shipit.on('published', () => {
    shipit.start('pm2-server');
  });

  // Actions
  shipit.blTask('npm-install', async () => {
    shipit.remote(`cd ${shipit.releasePath} && npm install --production`)
  });
  
  shipit.blTask('copy-config', async () => {
    const fs = require('fs');
    
    const ecosystem = `
module.exports = {
  apps: [
    {
      name: ${appName},
      script: '${shipit.releasePath}/keystone.ts',
      watch: true,
      autorestart: true,
      restart_delay: 1000,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        POSTGRES_URL="${process.env.PRODUCTION_POSTGRES_URL}"
        DATABASE_URL="${process.env.PRODUCTION_DATABASE_URL}"
        SESSION_SECRET="${process.env.PRODUCTION_SESSION_SECRET}"
        FRONTEND_URL="${process.env.PRODUCTION_FRONTEND_URL}"
      }
    }
  ]
};`

    fs.writeFileSync('ecosystem.config.js', ecosystem, function(err) {
      if (err) throw err;
      console.log("Ecosystem file created successfully");
    });

    await shipit.copyToRemote('ecosystem.config.js', ecosystemFilePath);
  });

  shipit.blTask('pm2-server', async () => {
    shipit.remote(`pm2 delete -s ${appName} || :`);
    shipit.remote(`pm2 start ${ecosystemFilePath} --env production --watch true`);
  });

}