const MsgModel = require('../model/Msg');
const User = require('../model/User');

exports.sendMsg = async(req, res) =>{

    try {
        const {msg, to} = req.body;
        const from = req.user._id.toString();


        const data = await MsgModel.create({
            message: {text: msg},
            users: [from, to.toString()],
            sender: from
        })
    
        if(data){
            return res.status(200).json({
                success: true,
                message: "Msg Send Successfully"
            })
        } else {
            return res.status(422).json({
                success: false,
                message: "Msg Can not send "
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.resMsg = async(req, res) =>{
    try {

        const to = req.params.to.toString();
        const from = req.user._id.toString();
        const skip = req.query.skip;
        
        const isTo = await User.findById(to);
        if(!isTo){
            return res.status(404).json({
                success: false,
                message: "User Not Fount"
            })
        }

        const tempMsges = await MsgModel.find({
            users: {
                $all: [from, to]
            }
        }).sort({updatedAt: 1})

        var msges = [];
        for(i=(tempMsges.length - 1 - skip); i>=(tempMsges.length - 20 - skip ); i--){
            if(tempMsges[i] !== undefined && tempMsges[i] !== null){
                msges.push(tempMsges[i])
            }
        }

        return res.status(200).json({
            success: true,
            msges: msges
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getMsgUserDetail = async(req, res) =>{
    try {

        const {to} = req.params;
        const user = await User.findById(to);

        const lastMsg = await MsgModel.find({
            users: {
                $all: [req.user._id.toString(), user._id.toString()]
            }
        }).sort({updatedAt: -1}).limit(1)


        const TempUser = {
            userName: user.username,
            avatar: user.avatar.url,
            lastMsg: lastMsg[0].message.text,
            sender: lastMsg[0].sender,
            seen: lastMsg[0].seen
        }

        return res.status(200).json({
            success: true,
            lastMsg: TempUser
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// exports.setLastMsgSeen = async(req, res) =>{
//     try {
//         const {to} = req.params;
//         const user = await User.findById(to);

//         const lastMsg = await MsgModel.findOne({
//             users: {
//                 $all: [req.user._id.toString(), user._id.toString()]
//             }
//         }).sort({updatedAt: -1})

//         lastMsg.seen = true;
//         await lastMsg.save();

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }