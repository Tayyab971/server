import userModel from "../models/userModel.js";



export const getUser = async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        return res.json({
            success: false,
            message: "Missing details (userID)"
        })
    }
    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({
                success: false,
                message: "User not exits with this ID"
            })
        }
        res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        })


    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}