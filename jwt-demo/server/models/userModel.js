const mongoose = require('mongoose'),
    userSchema = require('../schema/userSchema.js');

module.exports = mongoose.model('user', userSchema);