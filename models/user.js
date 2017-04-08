/**
 * Created by abhishek on 08/04/17.
 */
'use strict';

const db = require('../util/sequelize');
const Sequelize = require('sequelize');

const User = db.define('users', {
    id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
    username: Sequelize.STRING,
    password : Sequelize.STRING,
    role: Sequelize.BIGINT,
});

module.exports = User;
