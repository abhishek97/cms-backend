const express = require('express');
const router = express.Router();

const serializer = require('../serializer');
const Ticket = require('../models/ticket');
const Customer = require('../models/customer');
const FieldBoy = require('../models/fieldBoy');

router.get('/',(req,res)=>{
    Ticket.findAll({include : [{model : FieldBoy , as : 'fb'} ,{model : Customer, as : 'customer'}] } ).then(result=>{
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
});

router.post('/',(req,res)=>{
    console.log(req.body);
    const ticket = serializer.deserialize('ticketq', req.body  ) ;

    ticket.cid = ticket.customer;
    ticket.fieldBoyId = ticket.fieldBoyId || 0 ;

    Ticket.create(ticket).then(savedTicket=>{
        savedTicket = JSON.parse(JSON.stringify(savedTicket));
        console.log(savedTicket);
        res.json(serializer.serialize('ticket',savedTicket));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
});

router.patch('/:id', (req,res)=>{
    const ticket = serializer.deserialize('ticket',req.body);
    console.log(ticket);
    delete ticket.time;
    if(ticket.fb)
    {
        Ticket.findById(ticket.id).then(dbTicket=>{
            dbTicket.setFb(ticket.fb);
        })
    }

    Ticket.update(ticket,{
        where : {
            id : ticket.id
        }
    }).then(savedTicket=>{
        res.sendStatus(204);
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    })
})

module.exports = router;