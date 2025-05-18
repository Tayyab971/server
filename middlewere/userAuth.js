import jwt from "jsonwebtoken"

const userAuth = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        res.json({
            success: false,
            message: "Not Authorized.Please login first"
        })
    }

    try {
        const decodedtoken = jwt.verify(token, process.env.JWT_SECRET)
        console.log("decodedToken", decodedtoken)
        if (decodedtoken.id) {
            console.log("This is the body", req.body)
            req.body ? req.body.userId = decodedtoken.id : req.body = { userId: decodedtoken.id }


        } else {
            return res.json({
                success: false,
                message: "Not Authorized.Please login first"
            })
        }
        next()

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

export default userAuth