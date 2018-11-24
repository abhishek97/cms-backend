const express = require('express');
const router = express.Router();


const serializer = require('../serializer');
const Customer = require('../models/customer');

router.get('/', (req,res)=>{
    console.log(req.query);
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


module.exports = router;