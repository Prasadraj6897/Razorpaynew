const express = require('express')
const cors = require('cors')
const Razorpay = require('razorpay')
const {products} = require('./data')

const crypto = require('crypto')

const app = express()
app.use(cors())

//to catch data
app.use(express.json())

//Razorpay instance
var instance = new Razorpay({
    key_id: 'rzp_test_oBVq8Hma43gE1u',
    key_secret: 'DdeXlTvB1iVL9plJ4SgCxlgk'
  })

app.get('/products', (req, res) =>{
    res.status(200).json(products)
})

app.get('/order/:productId', (req, res) =>{
    const {productId} = req.params;
    console.log(productId)
    const product = products.find(prod => prod.id == productId)

    const amount = product.price * 100 * 80
    const currency = product.currency
    const receipt = "id from mogoDb"
    const notes = {desc: product.description}

    instance.orders.create({amount, currency, receipt, notes}, (error, order) =>{
        if(error)
        {
            res.status(500).json(error)
        }
        if(order){
            res.status(200).json(order)
        }
    })

   
    app.post(`/verify/razorpay-signature`, (req, res) =>{

        console.log(JSON.stringify(req.body))
        const hash = crypto.createHmac('SHA256', "123456789").update(JSON.stringify(req.body)).digest('HEX')
        
        console.log(hash)
        if(hash == req.headers["x-razorpay-signature"])
        {
                //SAVE payment information in database
        }
        else{
            //decline payment
        }   
        res.status(200)
    } )

    
}) 	

app.listen(8000, () =>{
    console.log('server running on port 8000')
})