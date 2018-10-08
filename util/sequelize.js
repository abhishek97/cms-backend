const Sequelize = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(process.env.DB_NAME || 'alphanet', config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false
    },
    logging: false
});

module.exports = sequelize;
