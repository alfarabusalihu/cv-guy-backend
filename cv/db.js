const mongo=require("mongoose")

mongo.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(console.log("Database connected yay"))
.catch(err=>console.log(err))