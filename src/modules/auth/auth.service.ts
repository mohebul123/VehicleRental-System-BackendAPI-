import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import config from "../../config/config";

   const userCreate = async(payload:Record<string,unknown>) =>{
    const {name,email,password,phone,role} = payload;
    if((password as string).length < 6){
        throw new Error("Password must be at least 6 characters or more");
    }
    const hashedPass = await bcrypt.hash(password as string, 10);
    const result = await pool.query(`INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role`,[name,email,hashedPass,phone,role]);
    return result;
};

const loginUser = async(email:string,password:string) =>{
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
    // delete result.rows[0].password;
    if(result.rowCount === 0){
        return false;
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password,user.password);
    if(!match){
        throw new Error("Passowrd Not Matched")
    }
    const secret = config.secret as string;
    const userPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    }
    const token = jwt.sign(userPayload,secret,{expiresIn: "7d"});
    delete result.rows[0].password;
    return {token,user};
};

export const authService = {
    userCreate,loginUser
}