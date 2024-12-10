const mongoose = require('mongoose');

const distribuidorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    previouslyShipped: {
        hasProducts: {
            type: Boolean,
            required: true
        },
        howMany: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        }
    },
    neededPerMonth: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Distribuidor', distribuidorSchema);