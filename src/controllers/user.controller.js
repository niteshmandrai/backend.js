import {asyncHandler} from '../../src/utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'



// const resisterUser=asyncHandler(async (req,res)=>{
    // res.status(200).json({
        //     message:"ok",
        
        // })
        
        // get user details from frtend
        // validate 
        // check already exist user
        // chech for img avatrat
        // upload them to cloudinary, avatrat
        // create user Object
        // remove password refresg token
        // check for user creation 
        // return response
        
    const resisterUser = asyncHandler( async (req, res) => {
    const {fullName,email,username,password}=req.body
    console.log("email:" ,email );
    
    
    // if(!email){
    //     throw new ApiError(400,"email is required")
    // }

        if(
            [fullName, email, username, password]
            .some((field)=>field?.trim()===""))
            {
                throw new ApiError(400,"all fields are required")
            }


        
        const existUser=await User.findOne({
            $or:[{fullName},{email}]
        })
        if(existUser){
            throw new ApiError(409,"user having this name or email already exist")
        }


        const avatartLocalPath=req.files?.avatar[0]?.path;
        // const coverimageLocalPath=req.files?.coverimage[0]?.path;


        let coverimageLocalPath
        if(req.files && Array.isArray(req.files.coverImage) && 
        req.files.coverImage.length > 0){
            coverimageLocalPath =req.files.coverImage[0].path
        }

        if(!avatartLocalPath){
            throw new ApiError(400,"avatar is required ")


        }
        const avatarForCloud=await uploadOnCloudinary(avatartLocalPath)
        const coverimageForCloud=await uploadOnCloudinary(coverimageLocalPath) 

        if(!avatarForCloud){
            throw new ApiError(400,"avatar has not recognised")
        }



        const user=await User.create({
            fullName,
            avatar:avatarForCloud.url || "",
            coverImage:coverimageForCloud?.url,
            email,
            password,
            username:username.toLowerCase()
        })


        const createdUser = await User.findById(user._id)
        .select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500,"internal server error")
        }


        return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "user created successfully "))

    
})
        export {resisterUser};