const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const Ticket = require('./models/ticket');
const User = require('./models/user');
const morgan = require('morgan')

const uuidV4 = require('uuid/v4');

global.authTokens = []
let authTokens = global.authTokens

const Customer = require('./models/customer');
const CustomerRouter = require('./routes/customers');
const TicketRouter = require('./routes/tickets');
const FieldBoyRouter = require('./routes/field-boys');
const fbApiRouter = require('./routes/fbApi');
const FeedbackRouter = require('./routes/feedback')
const ExotelRouter = require('./routes/exotel')

app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type : 'application/json'}) );
app.use(bodyParser.json({type : 'application/vnd.api+json'}) );

app.use(morgan('tiny'))
app.get('/', (req,res) => {
    res.sendStatus(200)
});

app.post('/login', (req,res)=>{
  const user = req.body;
   User.findOne({
       where : {
           $and : [ {username : user.username} , {password : user.password } ]
       }
   }).then(result=>{
       if(!result)
       {
           res.status(200).send('Invalid Username/Password');
           return result;
       }
       const apiKey =  uuidV4();
       authTokens.push(apiKey);
       res.json({
           username : user.username,
           apiKey : apiKey
       })
   }).catch(err=>{
       console.error(err);
       res.sendStatus(500);
   })
});

app.use('/customers', CustomerRouter);
app.use('/tickets', TicketRouter);
app.use('/fbs', FieldBoyRouter);
app.use('/fbApi', fbApiRouter );
app.use('/feedbacks', FeedbackRouter)
app.use('/exotel', ExotelRouter)



app.listen('8081', function(){
    console.log('Listening of 8081');
})