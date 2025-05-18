import express from 'express';
import userAuth from '../middlewere/userAuth.js';
import { getUser } from '../controller/userController.js';


const userRouter = express.Router();
userRouter.get('/user', userAuth, getUser)







export default userRouter;

