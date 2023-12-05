const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    resultStatus: {
        type: String,
        required: true
    },
    resultMsg: {
        type: String,
        required: true
    },
    txnId: {
        type: String,
        required: true,
        unique: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    txnAmount: {
        type: String,
        required: true
    },
    PaymentChannel: {
        type: String,
        required: true
    },
    referenceId: {
        type: String,
        required: true,
        unique: true
    },
    txnDate: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Payment", paymentSchema);