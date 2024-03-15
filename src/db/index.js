

import DB_NAME from '../constants.js'
import mongoose from "mongoose"


// import express from "express"


const connectDB=async ()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGODB connected!! DB hosted:${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("mongodb connection failed" ,error)
        process.exit(1)
    }
}

export default connectDB