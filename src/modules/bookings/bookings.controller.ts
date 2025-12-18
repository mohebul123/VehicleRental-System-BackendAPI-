import { Request, Response} from "express";
import { bookingsService } from "./bookings.service";
const createBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsService.createBookings(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllBookings = async (req: any, res: Response) => {
  try {
    const bookings = await bookingsService.getAllBookings(req.user);
    res.status(200).json({
      success: true,
      message:
        req.user.role === "admin" ? "Bookings retrieved successfully" : "Your bookings retrieved successfully",
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBookingsById = async (req: any, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await bookingsService.updateBookingsById(bookingId, req.body, req.user);
    res.status(200).json({
      success: true,
      message:
        req.body.status === "cancelled" ? "Booking cancelled successfully" : "Booking marked as returned. Vehicle is now available",
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const bookingsController = {
    createBookings, getAllBookings,updateBookingsById
}