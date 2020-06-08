const db = require('../util/sequelize');
const Sequelize = require('sequelize');
const Customer = require('./customer');


const Call = db.define('calls', {
  id: { type: Sequelize.STRING, primaryKey: true },
  mobile: {
    type: Sequelize.STRING
  },
  json: Sequelize.TEXT,
},{
    freezeTableName: true,
});


Call.belongsTo(Customer, {foreignKey: 'customer_id', as : 'customer'})


module.exports = Call;
