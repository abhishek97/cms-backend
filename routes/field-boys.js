/**
 * Created by abhishek on 08/04/17.
 */
'use strict';

const express = require('express');
const router = express.Router();


const serializer = require('../serializer');
const FieldBoy = require('../models/fieldBoy');
const Ticket = require('../models/ticket');
const { middleware } = require('../util/auth')

router.use(middleware)

router.get('/', (req,res)=>{
    console.log(req.query);
    FieldBoy.findAll().then(result=>{
        res.json(serializer.serialize('fb' , JSON.parse(JSON.stringify(result)) ));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    })

});

router.get('/:id', (req,res)=>{
    FieldBoy.findById(req.params.id).then(result=>{
        res.json(serializer.serialize('fb' , JSON.parse(JSON.stringify(result)) ));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    })
})


module.exports = router;