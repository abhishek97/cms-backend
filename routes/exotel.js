const express = require('express');
const uuidV4 = require('uuid/v4');

const router = express.Router();
const config = require('../config')
const Customer = require('../models/customer')
const Calls = require('../models/call')
const Ticket = require('../models/ticket')


const policy = (req, res, next) =>  req.query.secret === config.exotel.secret ? next() : res.sendStatus(401)


const callForSid = async sid => {
  if (!sid) 
    return null
  const call = await Calls.findById(sid, {
    include: {
      model: Customer,
      as: 'customer'
    }
  })

  call.payload = JSON.parse(call.json)

  return call
}

router.get('/number', policy, async (req, res) => {
  const { digits, From, CallSid } = req.query

  const customer = await Customer.findOne({
    where: {
      Mobile: digits.replace('"', '')
    }
  })

  if (!customer) 
    return res.sendStatus(404)

  Calls.create({
    id: CallSid,
    mobile: From,
    json: JSON.stringify(req.query),
    customer_id: customer.CID
  })

  return res.sendStatus(200)
})


router.get('/checkForExistingTicket', policy, async (req, res) => {
  const { CallSid } = req.query
  const call = await callForSid(CallSid)

  if (!call)
    return res.sendStatus(500)

  const pendingTicket = await Ticket.findOne({
    where: {
      CID: call.customer.CID,
      status: {
        $ne: 3
      }
    }
  })

  const status = pendingTicket ? 404 : 200
  res.sendStatus(status)
})


router.get('/createTicket', policy, async (req, res) => {
  const { CallSid } = req.query

  const call = await Calls.findById(CallSid, {
    include: {
      model: Customer,
      as: 'customer'
    }
  })

  const payload = JSON.parse(call.json)

  await Ticket.create({
    cid: call.customer.CID,
    time: new Date(),
    status: 0,
    body: `Registered via IVRS. Received a call from: ${payload.CallFrom}`,
    customer_secret: uuidV4(),
  })

  res.sendStatus(200)
})

module.exports = router