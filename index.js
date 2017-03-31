const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const Ticket = require('./models/ticket');
const Customer = require('./models/customer');
const CustomerRouter = require('./routes/customers');
const TicketRouter = require('./routes/tickets');

app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type : 'application/vnd.api+json'}) );
app.get('/', (req,res)=>{
    Customer.findAll({ include : [{model : Ticket}] }).then(result=>{
        res.send(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).send(err);
    })
});

app.use('/customers', CustomerRouter);
app.use('/tickets', TicketRouter);

app.listen('8081', function(){
    console.log('Listening of 8081');
})