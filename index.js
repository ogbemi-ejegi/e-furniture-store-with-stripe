const express =  require('express');
const exphbs = require('express-handlebars');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set static folder
app.use(express.static(`${__dirname}/public`));

//index route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
})

//single page route
app.get('/single', (req, res) => {
    res.render('single', {
        stripePublishableKey: keys.stripePublishableKey
    });
})

//product page route
app.get('/product', (req, res) => {
    res.render('product');
})

//Contact page route
app.get('/contact', (req, res) => {
    res.render('contact');
})

//Charge Route
app.post('/charge', (req, res) => {
    const amount = 2500;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then(customer => stripe.charges.create({
        amount,
        description: 'Web development ebook',
        currency: 'usd',
        customer: customer.id
    })).then(charge => res.render('success'))
    .catch((error) => {
        console.log(error)
    });
})

PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`App started at port ${PORT}`);
})