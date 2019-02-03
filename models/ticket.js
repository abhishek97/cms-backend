const db = require('../util/sequelize');
const Sequelize = require('sequelize');

const Ticket = db.define('tickets', {
    id: {type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true},
    cid: Sequelize.STRING,
    body : Sequelize.STRING,
    time: Sequelize.TIME,
    agent_resolve_time: Sequelize.TIME,
    secret: Sequelize.STRING,
    customer_secret: Sequelize.STRING, 
    // 0 -> New; 
    // 1 -> Assigned To Agent; 
    // 2 -> Marked as Close by Agent; 
    // 3 -> Confirmed Closed via helpdesk
    status: Sequelize.INTEGER
});

module.exports = Ticket;
