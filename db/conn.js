const mongoose = require('mongoose')


exports.connectDataBase = async() =>{
    // try {
    //     await mongoose.set('strictQuery', true);
    //     await console.log(process.env.DataBase)
        mongoose.connect(process.env.DataBase,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(()=>{
            console.log("data base connected")
        }).catch((err) =>{
            console.log("data base not connect " + err)
        })
    // } catch (error) {
    //     console.log(error.message)
    //     process.exit(1)
    // }
}
