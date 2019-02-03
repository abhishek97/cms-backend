const db = require('../util/sequelize');
const Sequelize = require('sequelize');
const Ticket = require('./ticket');

const Feedback = db.define('feedbacks', {
    id: {type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true},
    body : Sequelize.TEXT,
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
});

Feedback.belongsTo(Ticket, {foreignKey: 'ticket_id'})

module.exports = Feedback;
