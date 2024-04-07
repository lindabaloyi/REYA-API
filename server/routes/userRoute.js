import express from 'express'
import { bookRide, cancelBooking, createUser, getAllBookings } from "../controllers/userCntrl.js";
const router = express.Router();

router.post("/register", createUser) ;
router.post("/bookride/:id", bookRide) ;
router.post("/allBookings", getAllBookings);
router.post("/removeBooking/:id", cancelBooking)

export {router as userRoute} 