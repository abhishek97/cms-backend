const db = require('../util/sequelize');
const Sequelize = require('sequelize');

const Ticket = db.define('tickets', {
    id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
    cid: Sequelize.STRING,
    body : Sequelize.STRING,
    time: Sequelize.BIGINT,
    status: Sequelize.INTEGER
});

module.exports = Ticket;
