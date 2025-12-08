import express, { json, Request, Response } from "express"
import initDB from "./config/db";
import { userRoutes } from "./modules/users/users.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";

const app = express();
// parser
app.use(json());

initDB();

app.get("/", (req, res) => {
  res.send("Vehicle Rental System API is running");
});

app.use('/api/v1/auth/',authRoutes);
app.use('/api/v1/users/',userRoutes);
app.use('/api/v1/vehicles/',vehiclesRoutes);
app.use('/api/v1/bookings/',bookingsRoutes);


app.use((req,res)=>{
    res.status(404).json({
        success: false,
        message: "Route Not Found!!",
        path: req.path
    })
})

export default app;