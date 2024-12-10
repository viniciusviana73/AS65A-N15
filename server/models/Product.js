const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    isDonate: {
        type: Boolean,
        required: true,
        default: false
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    distribuidorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Distribuidor',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);