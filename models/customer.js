const db = require('../util/sequelize');
const Sequelize = require('sequelize');
const Ticket = require('./ticket');

const Customer = db.define('alphanet_customer', {
    CID: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
    Name: Sequelize.STRING,
    Address : Sequelize.STRING,
    Mobile : Sequelize.STRING,
    Email : Sequelize.STRING,
    expiry : Sequelize.DATE,
},{
    freezeTableName: true,
});

Customer.hasMany(Ticket, {foreignKey : 'cid' });
Ticket.belongsTo(Customer , {foreignKey : 'CID' , as : 'customer' } );

module.exports = Customer;
