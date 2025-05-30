import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js"
import AuthRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"
import "dotenv/config"

const app = express()
const port = process.env.port || 4000
console.log("server port", port)
connectDB()
const allowedOrigins = ["http://localhost:5173", "https://mern-auth-lyart-one.vercel.app/"]
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))

//Api Endpoints
app.get("/", (req, res) => {
    res.send("Mern Auth Server up and running")
})

app.use("/api/auth", AuthRouter)
app.use("/api/user", userRouter)
app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
})

