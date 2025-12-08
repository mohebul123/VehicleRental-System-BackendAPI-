import pg, { Pool } from "pg"
import config from "./config"

export const pool = new Pool({
    connectionString: `${config.connection_string}`,
    ssl: {
    rejectUnauthorized: false
  }

})

const initDB=async() =>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE CHECK (email = LOWER(email)),
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

        `)

    await pool.query(`
         CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(150) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('car','bike','van','SUV')),
  registration_number VARCHAR(100) NOT NULL UNIQUE,
  daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
  availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available','booked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

        `)

    await pool.query(`
       CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active','cancelled','returned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
        `)

}

export default initDB;