const dotenv = require("dotenv");
dotenv.config();
const payPal =require('paypal-rest-sdk');
const express = require("express");
const Orders = require("../models/orders");
const Payment = require('../models/paymentModel');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const router = express.Router();

payPal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Ad4AiHuVybvdbIi_k6SzYr29X_LfeHj55Fql6NwDqurkg2AHrGMTKRvuGT5GlCkcV1dy61hGxopxuCch',
    'client_secret': 'ENY53ywh5kr5OYRyInnIAqTg9Ib-rCQ4ro6hOY_IJuLj6DF3lvO19Qeh9wGggMP5x5dulalkR-Br7k3e'
});

router.post('/paypal-payment',(req,res)=>{

// console.log(create_payment_json)
    payPal.payment.create(req.body.create_payment_json, function (error, payment) {
        if (error) {
            console.log(error,'error')
            res.send(error)

        } else {
            // console.log("Create Payment Response");
            // console.log(payment);
            for(let i =0; i<payment.links.length;i++){
                if(payment.links[i].rel == 'approval_url'){
                    res.json({
                        redirect:payment.links[i].href
                    })
                }

            }
        }

    });
// console.log(JSON.stringify(req.body.create_payment_json))
// res.send(JSON.stringify(req.body.create_payment_json))

})

//   router.post('/payment-details',(req,res)=>{

//       const paymentId="PAYID-MCDRUOQ9HL368823X533542T"
//     const execute_payment_json={
//         "payer_id": "WG8F4QXT7KRB8",
//         "transactions":[{
//           "amount":{
//             "currency":"USD",
//             "total":"4895.7"
//           }
//         }]
//       }




// console.log(JSON.stringify(execute_payment_json))
// payPal.payment.execute(paymentId,execute_payment_json,function (error,payment){
//     if(error){
//     res.send(error)
//     }
//     else{
//         res.send(payment)
//     }
// })


//   })



router.post('/paymentpaystack', async (req, res) => {
    const options = {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    };
    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${req.body.reference}`,
            options
        );
        const responseData = response.data;
        let orderId = "oid" + uuidv4();
        const PaymentData = {
            resultStatus: responseData.data.status,
            resultMsg: responseData.message,
            txnId: responseData.data.id,
            orderId: orderId,
            txnAmount: Math.round(responseData.data.amount) / 100,
            referenceId: responseData.data.reference,
            PaymentChannel: responseData.data.channel,
            txnDate: responseData.data.paid_at
        };
        await addPayment(PaymentData);

        res.status(200).json({
            success: true,
            orderId: orderId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
});

const addPayment = async (data) => {
    try {
        await Payment.create(data);
    } catch (error) {
        console.log("Payment Failed!");
    }
}



module.exports=router