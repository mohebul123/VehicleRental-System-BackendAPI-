import { pool } from "../../config/db";
const formatDate = (date: Date) => date.toISOString().split("T")[0];
const autoReturn = async (booking: any) => {
  const today = new Date();
  const end = new Date(booking.rent_end_date);
  if (today > end && booking.status === "active") {
    await pool.query("UPDATE bookings SET status='returned' WHERE id=$1", [ booking.id, ]);

    await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1",
      [booking.vehicle_id]
    );
    booking.status = "returned";
  }
  return booking;
};
const createBookings= async (payload: any) => {
  const { customer_id,vehicle_id,rent_start_date,rent_end_date}=payload;
  const vehicleResult =await pool.query("SELECT * FROM vehicles WHERE id=$1", [vehicle_id,]);
  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  if (
    vehicleResult.rows[0].availability_status === "unavailable" ||
    vehicleResult.rows[0].availability_status === "booked"
  ) {
    throw new Error("Vehicle is already booked");
  }
  const dailyPrice = vehicleResult.rows[0].daily_rent_price;
  const start= new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days =Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (days <=0) {
    throw new Error("Invalid rent dates");
  }
  const totalPrice = days * dailyPrice;
  const bookingResult = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1,$2,$3,$4,$5,'active')
    RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice] );
  const booking = bookingResult.rows[0];
  await pool.query(
  "UPDATE vehicles SET availability_status='booked' WHERE id=$1", [vehicle_id] );
  return {
    id: booking.id,
    customer_id:booking.customer_id,
    vehicle_id:booking.vehicle_id,
    rent_start_date:formatDate(new Date(booking.rent_start_date)),
    rent_end_date:formatDate(new Date(booking.rent_end_date)),
    total_price: Number(booking.total_price),
    status: booking.status,
    vehicle: {
      vehicle_name: vehicleResult.rows[0].vehicle_name,
      daily_rent_price: Number(vehicleResult.rows[0].daily_rent_price),
    },
  };
};
const getAllBookings =async (user: any) =>{
  if (user.role==="admin") {
    const bookings = await pool.query(
    "SELECT * FROM bookings ORDER BY id DESC");
    const final = [];
    for (let b of bookings.rows) {
      await autoReturn(b);
      const customer = await pool.query(
      "SELECT name, email FROM users WHERE id=$1",
      [b.customer_id]
      );
      const vehicle = await pool.query(
        "SELECT vehicle_name, registration_number FROM vehicles WHERE id=$1", [b.vehicle_id] );
      final.push({
        id: b.id,
        customer_id:b.customer_id,
        vehicle_id:b.vehicle_id,
        rent_start_date: formatDate(new Date(b.rent_start_date)),
        rent_end_date:formatDate(new Date(b.rent_end_date)),
        total_price: Number(b.total_price),
        status:b.status,
        customer: customer.rows[0],
        vehicle:vehicle.rows[0],
      });}
    return final;
  }
  const bookings=await pool.query(
    "SELECT * FROM bookings WHERE customer_id=$1 ORDER BY id DESC", [user.id]);
  const final = [];
  for (let b of bookings.rows) {
    await autoReturn(b);
    const vehicle = await pool.query(
      "SELECT vehicle_name, registration_number, type FROM vehicles WHERE id=$1",[b.vehicle_id]);
    final.push({
      id: b.id,
      vehicle_id:b.vehicle_id,
      rent_start_date:formatDate(new Date(b.rent_start_date)),
      rent_end_date:formatDate(new Date(b.rent_end_date)),
      total_price: Number(b.total_price),
      status:b.status,
      vehicle:vehicle.rows[0],
    });
  }
  return final;
};
const updateBookingsById =async (
  bookingId:string,
  payload:any,
  user:any
)=>{
  const{status} =payload;
  const result = await pool.query("SELECT * FROM bookings WHERE id=$1", [ bookingId]);
  if (result.rows.length === 0) {
    throw new Error("Booking not found"); }
  const booking= result.rows[0];
  if (user.role ==="customer") {
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel their bookings");
    }
    if (booking.customer_id !== user.id) {
      throw new Error("You cannot cancel someone else's booking");
    }
    const today = new Date();
    const start = new Date(booking.rent_start_date);
    if (today >= start) {
      throw new Error("You cannot cancel after the rent start date");
    }
    const updated = await pool.query(
      "UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *", [bookingId]);
    return {
      id: updated.rows[0].id,
      customer_id: updated.rows[0].customer_id,
      vehicle_id: updated.rows[0].vehicle_id,
      rent_start_date: formatDate(new Date(updated.rows[0].rent_start_date)),
      rent_end_date: formatDate(new Date(updated.rows[0].rent_end_date)),
      total_price: Number(updated.rows[0].total_price),
      status:updated.rows[0].status,
    };
  }
  if (user.role=== "admin") {
    if (status !=="returned") {
      throw new Error("Admin can only mark bookings as returned"); }
    const updated = await pool.query(
      "UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *",
      [bookingId]
    );
    await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1", [booking.vehicle_id]);
    return {
      id: updated.rows[0].id,
      customer_id:updated.rows[0].customer_id,
      vehicle_id:updated.rows[0].vehicle_id,
      rent_start_date:formatDate(new Date(updated.rows[0].rent_start_date)),
      rent_end_date:formatDate(new Date(updated.rows[0].rent_end_date)),
      total_price: Number(updated.rows[0].total_price),
      status: updated.rows[0].status,
      vehicle: {
        availability_status:"available",
      },
    };
  }
};
export const bookingsService = {
  createBookings,getAllBookings,updateBookingsById,
};
