const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema =  new Schema({
    name: {
        type: String,
        required: true,
        min: 2
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    date: {
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User',userSchema);