const mongoose = require('mongoose');

const NotiFiSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    fcm_token: {
        type: String
    }
    
})

module.exports = mongoose.model("Nfc_token", NotiFiSchema)
