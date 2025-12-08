import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../config/config";
import { pool } from "../config/db";
export const auth = (...roles:string[]) =>{ 
    return async (req:Request,res:Response,next:NextFunction) =>{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            throw new Error("Your are not authorized")
        }

        

        const decoded = jwt.verify(token,config.secret as string) as JwtPayload;
        console.log("Requested User now:",decoded);
        const user = await pool.query(`
            SELECT * FROM users WHERE email=$1
            `,[decoded.email])
            if (user.rows.length === 0){
                throw new Error("user not found")
            }
            req.user = decoded;
            if(roles.length&& !roles.includes(decoded.role)){
                throw new Error("You are not authorized ")
            }
        next();
    }
}