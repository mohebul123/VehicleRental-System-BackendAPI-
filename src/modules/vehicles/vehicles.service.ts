
import { pool } from "../../config/db";

   const vehiclesCreate = async(payload:Record<string,unknown>) =>{
    const {vehicle_name,type,registration_number,daily_rent_price,availability_status} = payload;
    const result = await pool.query(`INSERT INTO vehicles (vehicle_name,type,registration_number,daily_rent_price,availability_status)
    VALUES ($1,$2,$3,$4,$5) RETURNING *`,[vehicle_name,type,registration_number,daily_rent_price,availability_status]);
    delete result.rows[0].created_at;
    return result;
};

const getAllVehicles = async() =>{
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
};
const getVehiclesById = async(id:string) =>{
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`,[id]);
    if(result.rows.length === 0){
        throw new Error("Vehicle not found");
    }
    return result;
};

const updateVehiclesById = async(id:string,payload: Record<string,unknown>) =>{
    const {vehicle_name,type,registration_number,daily_rent_price,availability_status}= payload;
    const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,[vehicle_name,type,registration_number,daily_rent_price,availability_status,id]);
    if(result.rows.length === 0){
        throw new Error("Vehicle not found");
    }
    delete result.rows[0].created_at;
    return result;
};

const deleteVehiclesById = async (id: string) => {
  const vehicleCheck = await pool.query(`SELECT 1 FROM vehicles WHERE id = $1`, [id]);

  if (vehicleCheck.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const activeBooking = await pool.query( `SELECT 1 FROM bookings  WHERE vehicle_id = $1 AND status = 'active' LIMIT 1`,[id]
  );

  if (activeBooking.rows.length > 0) {
    throw new Error("Vehicle cannot be deleted, active booking exists");
  }
  await pool.query(
    `DELETE FROM bookings WHERE vehicle_id = $1  AND status IN ('returned', 'cancelled')`,[id]
  );
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING *`,[id]);

  if (result.rowCount === 0) {
    throw new Error("Unable to delete vehicle");
  }

  return result.rows[0];
};

export const vehiclesService = {
    vehiclesCreate,getAllVehicles,getVehiclesById,updateVehiclesById,deleteVehiclesById
}