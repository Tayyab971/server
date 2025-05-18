import express from "express"
import { isAuthenticated, Login, LogOut, RegisterUser, resetPassword, sendResetPasswordOTP, sendVerifyOTP, verifyEmail } from "../controller/authContoller.js"
import userAuth from "../middlewere/userAuth.js"

const AuthRouter = express.Router()
AuthRouter.post("/register", RegisterUser)
AuthRouter.post("/login", Login)
AuthRouter.post("/logout", LogOut)
AuthRouter.post("/send-verify-otp", userAuth, sendVerifyOTP)
AuthRouter.post("/verify-account", userAuth, verifyEmail)
AuthRouter.post("/send-reset-otp", sendResetPasswordOTP)
AuthRouter.post("/reset-password", resetPassword)
AuthRouter.get("/is-authenticated", userAuth, isAuthenticated)
export default AuthRouter