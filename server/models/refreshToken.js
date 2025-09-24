const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String, // store a hashed version of the refresh token (never plaintext!)
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

// Optional: auto-delete expired tokens with a TTL index
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)