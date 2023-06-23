const Notification = require("../model/Notification");
const User = require("../model/User");

exports.setNotiToken = async(req, res) =>{
    try {
        const {token, userId} = req.body;

        const user = await User.findById(userId);
        if(!user){
            return res.status(500).json({
                success: false,
                message: "User Not Found"
            })
        }

        const isToken = await Notification.findOne({userId: userId})

        if(isToken !== null){
            return res.status(200).json({
                success: true,
                message: "already have token"
            })
        }

        const noti = await Notification.create({
            userId: userId,
            fcm_token: token
        })

        return res.status(200).json({
            success: true,
            noti: noti
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}