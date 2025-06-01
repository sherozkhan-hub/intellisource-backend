import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';


const varifyToken = async(req,res,next)=>{

    const token = req.cookies.access_token;

    if(!token){
        return next(errorHandler(401,"unauthorized"))
    }

    jwt.verify(token, process.env.jwt_secret , (err , user)=>{
        if(err){
            return next(errorHandler(401 , "unauthorized"));
        }
        req.user = user;
        next();
    })
}

export default varifyToken;