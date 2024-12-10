const mongoose = require('mongoose');

const stockRecordSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    distribuidorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Distribuidor',
        required: true
    },
    type: {
        type: String,
        enum: ['entrada', 'saida'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StockRecord', stockRecordSchema);