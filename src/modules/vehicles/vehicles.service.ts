
import { pool } from "../../config/db";

   const vehiclesCreate = async(payload:Record<string,unknown>) =>{
    const {vehicle_name,type,registration_number,daily_rent_price,availability_status} = payload;
    const result = await pool.query(`INSERT INTO vehicles (vehicle_name,type,registration_number,daily_rent_price,availability_status)
    VALUES ($1,$2,$3,$4,$5) RETURNING *`,[vehicle_name,type,registration_number,daily_rent_price,availability_status]);
    return result;
};

const getAllVehicles = async() =>{
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
};
const getVehiclesById = async(id:string) =>{
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`,[id]);
    return result;
};

const updateVehiclesById = async(id:string,payload: Record<string,unknown>) =>{
    const {vehicle_name,type,daily_rent_price,availability_status}= payload;
    const result = await pool.query(`UPDATE vehicles SET daily_rent_price=$1, availability_status=$2 WHERE id=$3 RETURNING *`,[daily_rent_price,availability_status,id]);
    if(result.rows.length === 0){
        throw new Error("Vehicle not found");
    }
    delete result.rows[0].created_at;
        return result;
};

const deleteVehiclesById = async(id:string) =>{
    const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`,[id]);
    if(result.rowCount === 0){
        throw new Error("User Not found!!")
    }
    return result;
};

export const vehiclesService = {
    vehiclesCreate,getAllVehicles,getVehiclesById,updateVehiclesById,deleteVehiclesById
}