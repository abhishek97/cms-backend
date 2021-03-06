const express = require('express');
const router = express.Router();


const serializer = require('../serializer');
const Customer = require('../models/customer');
const Ticket = require('../models/ticket')
const FB = require('../models/fieldBoy')
const { middleware } = require('../util/auth')

//auth
router.use(middleware)

router.get('/', (req,res)=>{

  if (req.query.filter.CID.length < 2 || !req.query['filter']['CID']) {
    return res.send(serializer.serialize('customer', [] ));
  }
    Customer.findAll({
        where : {
            CID : {
                $like : '%' + req.query.filter.CID + '%'
            }
        }}).then(result=>{
       res.send(serializer.serialize('customer',JSON.parse(JSON.stringify(result))) );
      //res.json(result);
    }).catch(err=>{
        console.error(err);
        res.sendStatus(500);
    })
    
});


router.get('/:id', (req, res) => {
  Customer.findById(req.params.id, {
    include: {
      model: Ticket,
      include: [{
        model: Customer,
        as: 'customer'
      }, {
        model: FB,
        as: 'fb'
      }]
    }
  }).then(result => {
    res.send(serializer.serialize('customer', result.get({plain: true})) );
    //res.json(result);
  }).catch(err => {
    console.error(err);
    res.sendStatus(500);
  })
})

module.exports = router;