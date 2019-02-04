echo 'Deploying to ssh.alphanetbroadband.com'

COMMAND="cd cms-backend; git pull origin master; yarn; pm2 start ecosystem.config.js --env production --update-env"

ssh root@ssh.alphanetbroadband.com $COMMAND