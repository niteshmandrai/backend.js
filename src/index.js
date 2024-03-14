import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path:'./env'
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT ||8000),()=>{
        console.log(`server is listning:${process.env.PORT}`);
    }
})
.catch((err)=>{
    console.log("ERROR",err)
})

// import mongoose from "mongoose"
// import express from "express"

// const app=express()

// (async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("error",error);
//             throw(error);
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listning on port: ${process.env.PORT}`)
//         })
//     }
//     catch(error){
//         console.error("error",error)
//         throw(error)
//     }
// })()