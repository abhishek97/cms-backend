/**
 * Created by abhishek on 13/04/17.
 */
'use strict';

const express = require('express');
const router = express.Router();
const uuidV4 = require('uuid/v4');

const serializer = require('../serializer');
const  FB = require('../models/fieldBoy');
const Ticket = require('../models/ticket');
const Customer = require('../models/customer');
const FieldBoy = FB;
const { middleware } = require('../util/auth')

router.post('/login', (req,res)=>{
    const user = req.body;
    FB.findOne({
        where : {
            $and : [ {name : user.username} , {pass : user.password } ]
        }
    }).then(result=>{
        if(!result)
        {
            res.status(200).send('Invalid Username/Password');
            return result;
        }
        const apiKey =  uuidV4();
        res.json({
            username : user.username,
            apiKey : apiKey,
            userId : result.id
        })
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    })
});

router.get('/resolve/:id', (req,res)=>{
   Ticket.update({
       status : 1
   },{
       where : {
           id : req.params.id
       }
   }).then(result=>{
       res.json({status : 'OK'});
   }).catch(err=>{
       console.error(err);
       res.sendStatus(500);
   })
});

//auth
router.use(middleware)


router.get('/tickets', (req,res)=>{
    Ticket.findAll({
        where : {
           $and : [ { fieldBoyId : req.query.id } , {status : 0} ]
        },
        include : [{model : FieldBoy , as : 'fb'} ,{model : Customer, as : 'customer'}] } ).then(result=>{
        result = JSON.parse(JSON.stringify(result));
        res.json(result);
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
});


module.exports = router;