import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { promisify } from 'util';
import User from "../models/User.js";

export const verifyToken = promisify(jwt.verify);

const notAuthenticated = (data={}) => ({
    authenticated:false,
    message:'Unauthenticated',
    ...data
})

const AuthUser = async (req) => {
    const accessToken = req.cookies ? req.cookies[process.env.TOKEN_NAME] : null;

    if(!accessToken){
        return notAuthenticated({
            message:'User is not authorized to access this resource',
        });
    }

    try{
        const decoded = await verifyToken(
            accessToken,
            process.env.JWT_TOKEN_SECRET
        );

        const user = await User.findById(decoded.id);
        if(!user){
            return notAuthenticated()
        }

        return {
            authenticated:true,
            user
        }

    }catch(err){
        return notAuthenticated({
            message:'Invalid token'
        })
    }
}

export default AuthUser;