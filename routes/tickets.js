const express = require('express');
const v4 = require('uuid/v4')
const router = express.Router();

const serializer = require('../serializer');
const Ticket = require('../models/ticket');
const Customer = require('../models/customer');
const FieldBoy = require('../models/fieldBoy');

const sms = require('../services/sms')

const moment = require('moment');

router.get('/',(req,res)=>{
   // console.log(req.query , req.params);
    Ticket.findAll({
        where : {
            $or : [
                    { time : { $gte : req.query.filter.after } },
                    { status : { $ne : 3 } }
                ]
        },
        include : [{model : FieldBoy , as : 'fb'} ,{model : Customer, as : 'customer'}]
    }).then(result=>{
        result = JSON.parse(JSON.stringify(result));
        res.json(serializer.serialize('ticket',result));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
});

router.get('/:id', (req,res)=>{
    Ticket.findOne({
        where : { 'id' : req.params.id },
        include : [{model : Customer,as : 'customer'}, {
          model: FieldBoy,
          as: 'fb'
        }]
    }).then(result=>{
        result = JSON.parse(JSON.stringify(result));
        res.json(serializer.serialize('ticket',result));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
});

router.post('/',(req,res)=>{
    // console.log(req.body);
    const ticket = serializer.deserialize('ticket', req.body  ) ;

    ticket.cid = ticket.customer;
    ticket.uuid = v4()
    // ticket.fieldBoyId = ticket.fieldBoyId || 0 ;

    Ticket.create(ticket).then(savedTicket=>{
        savedTicket = JSON.parse(JSON.stringify(savedTicket));
        res.json(serializer.serialize('ticket',savedTicket));
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    });
});

router.patch('/:id', async (req,res)=>{
  try {
    const ticket = serializer.deserialize('ticket', req.body);

    delete ticket.time;
    delete ticket.uuid;

    ticket.fieldBoyId = ticket.fb
    const oldTicket = await Ticket.findById(ticket.id)
    ticket.secret = v4()
    // update ticket info
    await Ticket.update(ticket, {
      where: {
        id: ticket.id
      }
    })

    if (!ticket.fb) {
      // no fb is assigned in this request
      return res.sendStatus(204)
    }


    // shoot sms 
    const dbTicket = await Ticket.findById(ticket.id, {
      include: [{
        model: Customer, as: 'customer'
      }, {
        model: FieldBoy, as: 'fb'
      }]
    })

    let sendSmsToCustomer = Promise.resolve()
    let sendSmsToFieldBoy = Promise.resolve()

    if (oldTicket.status == 0) {
      // not already assigned; shoot an sms to customer
      sendSmsToCustomer = sms.sendToCustomer(dbTicket.customer.Mobile, {
        ticket: dbTicket,
        customer: dbTicket.customer
      })
    }

    // shoot an sms to fieldBoy everytime
    if (dbTicket.fb.mobile) {
      sendSmsToFieldBoy = sms.sendToFieldBoy(dbTicket.fb.mobile, {
        ticket: dbTicket,
        customer: dbTicket.customer,
        link: `http://localhost:8081/tickets/resolve/${dbTicket.id}/${dbTicket.secret}`
      })
    }

    await Promise.all([
      sendSmsToFieldBoy,
      sendSmsToCustomer
    ])

    res.sendStatus(204)
  } catch (e) {
    console.error(e)
  }
    
})

router.get('/resolve/:id/:secret', async (req, res) => {
  // tro to find such a ticket
  const ticket = await Ticket.findOne({
    where: {
      id: req.params.id,
      secret: req.params.secret,
      status: 0
    }
  }).catch(console.error)

  if (!ticket) {
    return res.send('<h1>Ticket is already resolved OR has been re-assigned OR Incorrect Link')
  }

  ticket.set("status", 2) // mark as resolved
  ticket.set("agent_resolve_time", moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))
  await ticket.save()

  res.send('<h1>Great Work!, Ticket has been resolved')
})

module.exports = router;