import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-Handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import { cookie } from "express-validator";
import jwt from "jsonwebtoken";

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(
      409,
      "User with this email or username already exists",
      [],
    );
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });
  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/user/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully and verification email has been sent on your email",
      ),
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invaid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id,
  );

const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );
  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out"));
});

const getCurrentUser = asyncHandler (async (req,res)=>{
  return res 
  .status(200)
  .json(
    new ApiResponse(200, req.user , "Current user fetched successfully"))

});

const verifyEmail = asyncHandler (async (req,res)=>{
  const {VerificationToken} = req.params
  if (!VerificationToken) {
    throw new ApiError(400, 'Email verification token is missing')
  }

  let hashedToken = crypto
  .createHash("sha256")
  .update(VerificationToken)
  .digest("hex")
  await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: {$gt: Date.now()}
  })
  if (!user) {
    throw new ApiError (400, "token is invalid or expired")
  }
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = true
  await user.save({validateBeforeSave: false});

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {
        isEmailVerified: true,
      },"email is verified"

    )
  )
});

const resendEmailVerification = asyncHandler (async (req,res)=>{
const user = await User.findById(req.user?._id);
if(!user){
  throw new ApiError(404, "user does not exist")
}
  if(user.isEmailVerified){
    throw new ApiError(409, "email is already verified")
  }
  await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });
  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/user/verify-email/${unHashedToken}`,
    ),
  });
  return res
  .status(200)
  .json(
    new ApiResponse(200, {}, "mail has been sent your email id")
  )
})

const refreshAccessToken = asyncHandler (async (req,res)=>{
 const incoming_RT = req.cookies.refreshToken || req.body.refreshToken
 if(!incoming_RT){
  throw new ApiError(401, "unauthroized access")
 }

 try{
  const decodedToken = jwt.verify(incoming_RT,
    process.env.REFRESH_TOKEN_SECRET)

   const user = await user.findById(decodedToken?._id);
   if(!user){
    throw new ApiError(401,"invaild refresh token");
   }
   if(incoming_RT != user?.refreshToken){
    throw new ApiError(401, "refresh token is expired")
   }
   const option = {
    httpsOnly: true,
    secure: true
   }
   const {accessToken, refreshToken : newRefreshToken} = await
    generateAccessandRefreshToken(user.id)

    user.refreshToken = newRefreshToken;
    await user.save()
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, {accessToken, refreshToken: newRefreshToken},
          "Access token refreshed")
        )
 }catch(error){
 throw new ApiError(401, "invaild refresh token");
 }

})

// const verifyEmail = asyncHandler (async (req,res)=>



export {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
};
