const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    title: {
        type: String,
        required:true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: String,
        required: true,
        default: 'Other' 
    },
    description: {
        type: String,
        trim: true,
        required:false
        
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);