import jwt from 'jsonwebtoken'
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


        
        const isUserExist = await User.findOne({
            $or:[{fullName},{email}]
        })
        if(isUserExist){
            throw new ApiError(409,"user having this name or email already exist")
        }


        const avatartLocalPath=req.files?.avatar[0]?.path;
        // const coverimageLocalPath=req.files?.coverimage[0]?.path;

        // console.log(req.files);
        // if we console log re.files it gives us a array
        //  avatar: [
    // {
    //     fieldname: 'avatar',
    //     originalname: '7990864.jpg',
    //     encoding: '7bit',
    //     mimetype: 'image/jpeg',
    //     destination: './public/temp',
    //     filename: '7990864.jpg',
    //     path: 'public\\temp\\7990864.jpg',
    //     size: 51506
    //   }
    // ]


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

    


    // fun to generate tokens
    const generateRefreshTokenAndRefreshToken=async(userId)=>{
        const user=await User.findById(userId)

        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken

        await user.save(
            {
                validateBeforeSave:false
            }
        )

        return {accessToken, refreshToken}

    }

    const loginUser=asyncHandler(async (req,res)=>{
        //req.body data
        // username or email
        // find the user
        // password check
        // access and refresh token
        // send cookie
        
        
        const {email,username,password}=req.body
        console.log("email:" ,email )
        
        
        //req.body data
        // const {email, username, password }=req.body
        // console.log(email,username, password )
        
        
        // username or email
        // if(!(username && email)){
        //     throw new ApiError(400,"username or email is required")
        // }
        
        if(!username){
                throw new ApiError(400,"username is required")

        }
        if(!email){
            throw new ApiError(400,"email is required")

    }
    
        
        // find the user
        const user=await User.findOne({
            $or:[{username},{email}]
        })
        
        if(!user){
            throw new ApiError(404,"user does not exist")                
        }
        
        
        // password check
        const isPasswordValid=await user.isPasswordCorrect(password)
        
        if(!isPasswordValid){
            throw new ApiError(404,"password is wrong")  
        }
        
        
        // access and refresh token
        const {accessToken, refreshToken} = 
        await generateRefreshTokenAndRefreshToken(user._id)


        const isUserLoggedIn=await User.findById(user._id)
        .select("-password -refreshToken")


        const options={
            httpOnly:true,
            secure:true
        }


        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {user:isUserLoggedIn,accessToken,refreshToken},
                " logged in successfully"
            )
        )
    })


    const logoutUser=asyncHandler(async (req, res)=>{
        await User.findByIdAndUpdate(
            req.user._id,{
                $set:{
                    refreshToken:undefined,
                    new:true
            }
        })

        const options={
            httpOnly:true,
            secure:true
        }


        return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out "))

    })










        export {
            resisterUser,
            loginUser,
            logoutUser,
        
        };