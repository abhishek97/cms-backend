module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : 'api.alphanetbroadband.com',
      script    : 'index.js',
      env: {
        DB_USER: 'alphanet',
        DB_PASS: 'UKeDJVNF295lTc1n',
        DB_HOST: '139.59.6.227',
        SMS_URI: 'http://198.24.149.4/API/pushsms.aspx',
        SMS_SENDERID: 'ALPHNT',
        FRONTEND: 'http://localhost:4200',
        DB_NAME: 'alphanet_dev'

      },
      env_production : {
        NODE_ENV: 'production',
        SMS_LOGINID: 'mohitdel94',
        SMS_PASS: 'kirk@metal',
        DB_NAME: 'alphanet',
        FRONTEND: 'https://cms.alphanetbroadband.com'
      }
    }
  ]
};
