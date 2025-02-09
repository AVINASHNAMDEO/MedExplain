import { ApiError } from "../uttils/ApiError.js";
import { ApiResponse } from "../uttils/ApiResponse.js";
import { asyncHandler} from "../uttils/asyncHandler.js";
import { User } from "../models/User.models.js";
import jwt from "jsonwebtoken"; // JWT for authentication
import bcrypt from "bcrypt"
import dotenv from "dotenv";

dotenv.config({
  path : './.env'
});


//Register User

  //1.  get user details from frontend
const registerUser = asyncHandler(async(req,res)=>{
    const {username , email , password} = req.body ;
    console.log(email);


    // 2. validation - not empty
    if([username,email,password].some((field)=>
        field?.trim() === "")
        ){
            throw new ApiError(400,"All fields are required")
           }


//3.  check if user already exist : username,email
           const existedUser = await User.findOne({
            $or: [{ username }, { email }],
          });
          
          if (existedUser) {
            console.log(existedUser);
            throw new ApiError(409, "This user already exists!");  
          }


 // 4. create user object - create entry in db
          const user = await User.create({
            username : username.toLowerCase(),
             email,
            password
            
        })


//5.  remove password and refresh token field from response
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken" 
        )
//6.  check for user creation
        if(!createdUser){
            throw new ApiError(500 , "something went wrong while registering a user")
        }
        
//7.  return response
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User Registered Successfully")
        )
        
})


const loginUser = asyncHandler(async (req, res) => {
  try {
    // 1️⃣ Get user details from frontend
    const { username, email, password } = req.body;

    console.log("📥 Received Data:", { username, email, password });

    // 2️⃣ Validate inputs
    if (!username && !email) {
      throw new ApiError(400, "Username or Email is required");
    }
    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    // 3️⃣ Find user in DB (make sure to select password explicitly)
    const user = await User.findOne({
      $or: [{ username }, { email }],
    }).select("+password"); // Ensure password is included

    console.log("🔍 User Found in DB:", user);

    // 4️⃣ If user is not found
    if (!user) {
      console.error("❌ User does not exist");
      throw new ApiError(404, "User does not exist");
    }

    // 5️⃣ Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("🔑 Password Validation Result:", isPasswordValid);

    if (!isPasswordValid) {
      console.error("❌ Invalid password");
      throw new ApiError(401, "Invalid user credentials");
    }

    // 6️⃣ Remove password from response
    const loggedInUser = await User.findById(user._id).select("-password");

    console.log("✅ User Logged In:", loggedInUser);

    // 7️⃣ Set secure HTTP-only cookie
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("options", options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("🚨 Error in loginUser:", error.message);
    throw error;
  }
});
















// const loginUser = asyncHandler(async (req, res) => {
//   // 1️⃣ Get user details from frontend
//   const { username, email, password } = req.body;

//   // 2️⃣ Validate inputs
//   if (!username && !email) {
//     throw new ApiError(400, "Username or Email is required");
//   }
//   if (!password) {
//     throw new ApiError(400, "Password is required");
//   }

//   // 3️⃣ Find user in DB (ensure password is selected)
//   const user = await User.findOne({
//     $or: [{ username }, { email }],
//   }).select("+password"); // Ensure password is included

//   // 4️⃣ If user is not found
//   if (!user) {
//     throw new ApiError(404, "User does not exist");
//   }

//   // 5️⃣ Check the password
//   const isPasswordValid = await user.comparePassword(password);
//   if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid user credentials");
//   }

//   // 6️⃣ Remove password from response
//   const loggedInUser = await User.findById(user._id).select("-password");

//   // 7️⃣ Set secure HTTP-only cookie
//   const options = {
//     httpOnly: true,
//     secure: true,
//   };

//   return res
//     .status(200)
//     .cookie("options", options)
//     .json(
//       new ApiResponse(
//         200,
//         { user: loggedInUser },
//         "User logged in successfully"
//       )
//     );
// });



//  // Load environment variables

// // const loginUser = asyncHandler(async (req, res) => {
// //   // 1. Get user details from frontend
// //   const { username, email, password } = req.body;

// //   // 2. Validate username or email
// //   if (!username && !email) {
// //     throw new ApiError(400, "Username or Email is required");
// //   }

// //   // 3. Find the user from DB
// //   const user = await User.findOne({
// //     $or: [{ username }, { email }],
// //   });

// //   // 4. If user does not exist
// //   if (!user) {
// //     throw new ApiError(404, "User does not exist");
// //   }

// //   // 5. Check if password is valid
// //   const isPasswordValid = await user.comparePassword(password);
// //   if (!isPasswordValid) {
// //     throw new ApiError(401, "Invalid user credentials");
// //   }

// //   // 6. Generate JWT Token
// //   const token = jwt.sign(
// //     { userId: user._id },
// //     process.env.JWT_SECRET, // Store this in .env file
// //     { expiresIn: "7d" }
// //   );

// //   // 7. Fetch user details without password
// //   const loggedInUser = await User.findById(user._id).select("-password");

// //   // 8. Set cookie options
// //   const options = {
// //     httpOnly: true,
// //     secure: process.env.NODE_ENV === "production",
// //     sameSite: "Strict",
// //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// //   };

// //   // 9. Send Response with Token
// //   return res
// //     .status(200)
// //     .cookie("token", token, options) // Set JWT in Cookie
// //     .json(
// //       new ApiResponse(200, { user: loggedInUser, token }, "User logged in successfully")
// //     );
// // });

// // // ✅ **Logout User**
// // const logOut = asyncHandler(async (req, res) => {
// //   res.cookie("token", "", { expires: new Date(0) });
// //   return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
// // });

export { registerUser,loginUser};






























// //Login User

// const loginUser = asyncHandler(async(req,res)=>{
//   //1.  get user details from frontend

//   const {username,email,password} = req.body ;

//   //2.validate username or password
//   if(!username || !email){
//     throw new ApiError(400 , "Username or Email is required")
//   }
// // find the user from db
//   const user = await User.findOne({
//     $or : [{username} , {email}]
//   })
//   //User is not exist
//   if(!user){
//     throw new ApiError(404 , "User does not exist")
//   }
//   //check the password 
//   const isPasswordValid = await user.comparePassword(password) ;
//   if(!isPasswordValid){
//     throw new ApiError(401 , "Invailid user credential");
//   }

//   const loggedInuser = await User.findById(user._id).select(-password)

//   const option = {
//     httpOnly : true ,
//     secure : true
//   }

//   return res.status(200).cookie("options", option).json(new ApiResponse(200 , {
//     user : loggedInuser
//   },
//   "User logged in successfully"
// ))

// })

// // logout user 

// // const logOut = asyncHandler(async(req,res)=>{

// // })
 
// export {
//   registerUser,
//   loginUser
// }