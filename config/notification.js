// // const fs = require("fs");
// // const path = require('path');
// // var FCM = require('fcm-node');
// const fcm_token = require('../model/Notification')
// const fetch = require('node-fetch')



// const notiFun1 = async(userId, message) => {
//   console.log("=========call function==================")
//   var notification = {
//     'title': 'notification title',
//     'text': message
//   }

//   var push_tokens = await fcm_token.findOne({userId: userId})

//   const noti_user = [];
//   noti_user.push(push_tokens.fcm_token)
//   console.log(noti_user)

//   var notification_body = {
//     'notification': notification,
//     'registration_ids': push_tokens
//   }

//   fetch('https://fcm.googleapis.com/fcm/send', {
//     'method': 'POST',
//     'headers': {
//       'Authorization': 'key='+'AAAARHKNJ2M:APA91bFPvIqYmYvQ84mls3ITG_eIt_-EBtE8QfW2zapP7VIKtdQY1hhJ5ExKo2QLZ_eIyM8xTaL-IN9B9KMIpveBMX8MsAZCKUlTAlbXVub0Jvfk959aoVVL_6wvnRDcNBIwoKtDL3s2',
//       'Content-Type': 'application/json'
//     },
//     'body': JSON.stringify(notification_body)
//   }).then(()=> {
//     console.log("============Notification send====================")
//   }).catch((err)=>{
//     console.log("catch Error==============", err)
//   })

// }

// module.exports = {notiFun1}


const fs = require("fs");
const path = require('path');
var FCM = require('fcm-node');
const fcm_token = require('../model/Notification');
const User = require("../model/User");


const sendPushNotification = async(me, userId,message) => {
      try {
    
        console.log('User Id:- '+userId);
        console.log('message:- '+message);  

        const user = await User.findById(me)
    
        fs.readFile(path.join(__dirname,'./FireBAseConfig.json'), "utf8", async(err, jsonString) => {
        console.log("callll===================================================================")
  
        if (err) {
            console.log("Error reading file from disk:", err);
            return err;
          }
          try {
    
            //firebase push notification send
            const data = JSON.parse(jsonString);
            var serverKey = data.SERVER_KEY;
            var fcm = new FCM(serverKey);

            console.log("server key=================", serverKey)
    
            var push_tokens = await fcm_token.find({userId: userId})
            
            var reg_ids = ["daJKlEY98LKDfUs38Q2Eav:APA91bGg3x24-BHwgbbzON8mlCr9jtldhCeeYiduNhQbuPjy7ZqHz9UjeP2b43iunjQIyZtDrLqatM01bgavmACkk4cUuOg0BFa3PLGt6wExqe7GHhdHRo1xHc00ZcrHUD33GWWiX3fl"];
            push_tokens.forEach(token => {
              reg_ids.push(token.fcm_token)
            })
            
            console.log(reg_ids)
    
            if(reg_ids.length > 0){
    
              var pushMessage = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                registration_ids:reg_ids,
                content_available: true,
                mutable_content: true,
                notification: {
                    title: user.username,
                    body: message,
                    icon : 'myicon',//Default Icon
                    sound : 'mySound',//Default sound
                    // badge: badgeCount, example:1 or 2 or 3 or etc....
                },
                // data: {
                //   notification_type: 5,
                //   conversation_id:inputs.user_id,
                // }
              };
            
              fcm.send(pushMessage, function(err, response){
                  if (err) {
                      console.log("Something has gone wrong!",err);
                  } else {
                      console.log("Push notification sent.", response);
                  }
              });
            }
    
            console.log("end============================")
            
          } catch (err) {
            console.log("Error parsing JSON string:", err);
          }
        });
    
      } catch (error) {
        console.log(error);
      }
    
    }
  
    module.exports = {sendPushNotification};
