const express = require('express');
const router = express.Router();

const serializer = require('../serializer');
const Ticket = require('../models/ticket');
const Customer = require('../models/customer');

router.get('/',(req,res)=>{
    Ticket.findAll({include : [{model : Customer, as : 'customer'}] } ).then(result=>{
        result = JSON.parse(JSON.stringify(result));
        res.json(serializer.serialize('ticket',result));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
})

router.get('/:id', (req,res)=>{
    Ticket.findOne({
        where : { 'id' : req.params.id },
        include : [{model : Customer,as : 'customer'}]
    }).then(result=>{
        result = JSON.parse(JSON.stringify(result));
        res.json(serializer.serialize('ticket',result));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
})

router.post('/',(req,res)=>{
    const ticket = serializer.deserialize('ticket', req.body ) ;
    ticket.cid = ticket.customer;
    Ticket.create(ticket).then(savedTicket=>{
        savedTicket = JSON.parse(JSON.stringify(savedTicket));
        res.json(serializer.serialize('ticket',savedTicket));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
})

module.exports = router;