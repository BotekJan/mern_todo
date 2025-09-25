const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    jti: { type: String, required: true }, // hash of the token
    device: { type: String },                    // optional: device name or user-agent
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
});



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    refreshTokens: [refreshTokenSchema]

});

module.exports = mongoose.model('User', userSchema)