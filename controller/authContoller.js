import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import transporter from "../config/nodemailer.js"


export const RegisterUser = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: "Missing Details"
        })
    }


    try {
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({ name, email, password: hashedPassword })
        await user.save()


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000

        })
        const mailOptions = {
            from: "tayyab.ejaz@mqvantage.com",
            to: email,
            subject: "Welcome to Our App",
            text: `Hello ${name},\n\nThank you for registering with us. We are excited to have you on board!\n\nBest regards,\nThe Team`

        }

        await transporter.sendMail(mailOptions)

        return res.json({
            success: true
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }

}
export const Login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Email and password are required!"
        })
    }
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Email Provided"
            })
        }


        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Password"
            })
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000

        })

        return res.json({
            success: true
        })


    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }





}
export const LogOut = async (req, res) => {

    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

//send OTP to user email
export const sendVerifyOTP = async (req, res) => {
    const { userId } = req.body
    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        if (user.isVerified) {
            return res.json({
                success: false,
                message: "Account already verified"
            })
        }


        const otp = String(Math.floor(10000 + Math.random() * 900000))

        user.verifyOTP = otp;
        user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save()

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP for account verification is ${otp}. It is valid for 24 hours.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({
            success: true,
            message: "Verification OTP sent to Email"
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }

}


//verify OTP
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body
    if (!userId || !otp) {
        return res.json({
            success: false,
            message: "Missing details"
        })
    }
    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        if (user.verifyOTP !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            })
        }

        if (user.verifyOTPExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired. Please try again"
            })
        }

        user.isVerified = true
        user.verifyOTP = ""
        user.verifyOTPExpireAt = 0
        await user.save()
        return res.json({
            success: true,
            message: "Account verified successfully"
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }

}
//check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        res.json({
            success: true,
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}



//send password rest otp

export const sendResetPasswordOTP = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.json({
            success: false,
            message: "Email is required"
        })
    }

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "User not found in database"
            })
        }


        const otp = String(Math.floor(10000 + Math.random() * 900000))
        user.resetOTP = otp
        user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000
        await user.save()

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting your password is ${otp}. It is valid for 15 minutes.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({
            success: true,
            message: "Password reset OTP sent to email"
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}


export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) {
        return res.json({
            success: false,
            message: "Missing details Email, OTP and new password are required"
        })
    }
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        if (user.resetOTP !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            })
        }
        if (user.resetOTPExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired. Please try again"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetOTP = ""
        user.resetOTPExpireAt = 0
        await user.save()
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: user.email,
            subject: "Password Reset Successful",
            text: `Your password has been reset successfully.`
        }
        await transporter.sendMail(mailOptions)
        return res.json({
            success: true,
            message: "Password reset successfully"
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}