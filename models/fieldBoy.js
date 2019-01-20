/**
 * Created by abhishek on 08/04/17.
 */
'use strict';

const db = require('../util/sequelize');
const Sequelize = require('sequelize');
const Ticket = require('./ticket');

const FieldBoy = db.define('fieldBoy', {
    id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
    name: Sequelize.STRING,
    pass : Sequelize.STRING,
    mobile: Sequelize.STRING,
},{
    freezeTableName: true
});

FieldBoy.hasMany(Ticket, {foreignKey : 'fieldBoyId'  , as : 'ticket'});
Ticket.belongsTo(FieldBoy , {foreignKey : 'fieldBoyId' , as : 'fb'} );
Ticket.belongsTo(FieldBoy , {foreignKey : 'helperBoyId' , as : 'helper'} );


module.exports = FieldBoy;
