import { User } from "../models/users.js";
import { sendMail } from "../utils/sendMaill.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";
import fs from "fs";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";

// Register User
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const avatar = req.files.avatar.tempFilePath;

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const otp = Math.floor(Math.random() * 1000000);

  const mycloud = await cloudinary.v2.uploader.upload(avatar, {
    folder: "todoApp",
  });

  fs.rmSync("./tmp", { recursive: true });

  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
    otp,
    otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
  });

  await sendMail(email, "Verify your account", `Your OTP is ${otp}`);

  sendToken(
    res,
    user,
    201,
    "OTP sent to your email, please verify your account"
  );
});

// Verify User
export const verify = catchAsyncError(async (req, res, next) => {
  const otp = Number(req.body.otp);

  const user = await User.findById(req.user._id);

  if (user.otp !== otp || user.otp_expiry < Date.now()) {
    return next(new ErrorHandler("Invalid OTP or has been Expired", 400));
  }

  user.verified = true;
  user.otp = null;
  user.otp_expiry = null;

  await user.save();

  sendToken(res, user, 200, "Account Verified");
});

// User Login
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email & Password both", 400));
  }

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  sendToken(res, user, 200, "Login Successful");
});

// Logout User
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({ success: true, message: "Logged out Successfully" });
});

// Add Task
export const addTask = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;

  const user = await User.findById(req.user._id);

  user.tasks.push({
    title,
    description,
    completed: false,
    createdAt: new Date(Date.now()),
  });

  await user.save();

  res.status(200).json({ success: true, message: "Task Added Successfully" });
});

// Delete Task
export const removeTask = catchAsyncError(async (req, res, next) => {
  const { taskId } = req.params;

  const user = await User.findById(req.user._id);

  const task = user.tasks.find(
    (task) => task._id.toString() === taskId.toString()
  );

  if (!task) {
    return next(new ErrorHandler("Invalid Task Id", 400));
  }

  user.tasks = user.tasks.filter(
    (task) => task._id.toString() !== taskId.toString()
  );

  await user.save();

  res.status(200).json({ success: true, message: "Task Removed Successfully" });
});

// Update Task
export const updateTask = catchAsyncError(async (req, res, next) => {
  const { taskId } = req.params;

  const user = await User.findById(req.user._id);

  const task = user.tasks.find(
    (task) => task._id.toString() === taskId.toString()
  );

  if (!task) {
    return next(new ErrorHandler("Invalid Task Id", 400));
  }

  task.completed = !task.completed;

  await user.save();

  res.status(200).json({ success: true, message: "Task Updated successfully" });
});

// Get User Profile
export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  sendToken(res, user, 201, `Welcome ${user.name} `);
});

// Update User Profile
export const updateProfile = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name } = req.body;

  const avatar = req.files.avatar.tempFilePath;

  if (name) {
    user.name = name;
  }

  if (avatar) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    const mycloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "todoApp",
    });

    fs.rmSync("./tmp", { recursive: true });

    user.avatar = {
      public_id: mycloud.public_id,
      secure_url: mycloud.secure_url,
    };
  }

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Profile Updated Successfully" });
});

// Update Password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid old password", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  if (oldPassword === newPassword) {
    return next(new ErrorHandler("Please make new password", 400));
  }

  user.password = newPassword;

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password Updated Successfully" });
});

// Forget Password
export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Plesae enter email", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("Invalid Email", 400));
  }

  const otp = Math.floor(Math.random() * 1000000);

  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  const message = `Your OTP for reseting the password ${otp}. If you did not request for this, please ignore for this email.`;

  await sendMail(email, "Request for Resetting Password", message);

  res.status(200).json({ success: true, message: `OTP sent to ${email}` });
});

// Reset Password
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { otp, newPassword, confirmPassword } = req.body;

  if (!otp || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Plesae enter all fields", 400));
  }

  const user = await User.findOne({
    resetPasswordOtp: otp,
    resetPasswordOtpExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Otp is invalid or has been expired", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = newPassword;
  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpiry = null;

  await user.save();

  res
    .status(200)
    .json({ success: true, message: `Password Changed Successfully` });
});
