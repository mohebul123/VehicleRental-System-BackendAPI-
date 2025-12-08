import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { pool} from "../../config/db";
   const getAllUsers= async() =>{
    const result =await pool.query(`SELECT * FROM users`);
    return result;
};
    const updateUsersById =async(id: string, payload: any) => {
    const queryResult = await pool.query("SELECT * FROM users WHERE id=$1",[id] );
    if (!queryResult.rows || queryResult.rows.length === 0) {
        throw new Error("User not found!");
    }
    const existing = queryResult.rows[0];
    const updatedUser = {
        name: payload.name ?? existing.name,
        email: payload.email ?? existing.email,
        phone: payload.phone ?? existing.phone,
        role: payload.role ?? existing.role,
    };
    const result = await pool.query(
        `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *;`, [updatedUser.name, updatedUser.email, updatedUser.phone, updatedUser.role,id]
    );
    return result.rows[0];
};
const deleteUsersById =  async (id: string) => {
    const userCheck = await pool.query(
        "SELECT * FROM users WHERE id=$1",[id]);
    if (userCheck.rows.length === 0) {
        throw new Error("User Not found!!");
    }
    const activeBooking = await pool.query(
        `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,[id]);
    if (activeBooking.rows.length > 0) {
        throw new Error("User cannot be deleted because active bookings exist!");
    }
    const deleted = await pool.query(
        "DELETE FROM users WHERE id=$1 RETURNING *",[id]);
    return deleted;
};
export const usersService = {
    getAllUsers,updateUsersById,deleteUsersById
}