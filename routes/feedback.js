const express = require('express');
const router = express.Router();


const serializer = require('../serializer');
const Feedback = require('../models/feedback');
const Ticket = require('../models/ticket')
const FB = require('../models/fieldBoy')

const policy = require('../policies/feedback')

router.post('/', policy.POST, async (req, res) => {
  await Feedback.create({
    body: req.body.body,
    rating: req.body.rating,
    ticket_id: req.body.ticketId
  })

  //TODO: remove secret to disallow multiple feedbacks

  res.sendStatus(200)
})

module.exports = router