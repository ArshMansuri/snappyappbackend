const mongoose = require('mongoose')

const MsgSchema = mongoose.Schema({
    message:{
        text: {
            type: String, 
            required: true
        }
    },
    users: Array,
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    }
},

{
    timestamps: true
}

)

module.exports = mongoose.model("Msg", MsgSchema)