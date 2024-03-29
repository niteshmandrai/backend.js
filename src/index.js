import dotenv from "dotenv"
import connectDB from "./db/index.js"


import {app} from './app.js'

dotenv.config({
    path:'./.env'
})


const port = process.env.PORT ;
if(!port == process.env.PORT){
    port=4001;
}

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`server is running at:${port}`);
    })
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