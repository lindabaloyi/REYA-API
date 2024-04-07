import asyncHandler from "express-async-handler";
import express from "express"; // This import is not used in the snippet provided.
import { prisma } from "../config/prismaConfig.js";

//FUNCTION TO CREATE A USER
export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");

  let {email} = req.body;
  const userExist = await prisma.user.findUnique({ where: { email: email } });
  if (!userExist) {
    const user = await prisma.user.create({ data: req.body});
    res.send({
      message: "User registered succesfully",
      user: user,
    });
  } else res.status(201).send({ message: "User already registered" });
});

//FUNCTION TO BOOK A RIDE
export const bookRide = asyncHandler(async(req, res)=>{
  const {email, date} = req.body
  const {id} = req.params

  try {

    const alreadyBooked = await prisma.user.findUnique({
      where: {email},
      select: {bookedRides: true}
    });

    if(alreadyBooked.bookedRides.some((visit)=>visit.id === id)) {
      return res.status(400).json({message:"This ride is already booked by you"})
    }
    else {
      // Update the user's booked rides
      await prisma.user.update({
        where: {email: email},
        data: {
          bookedRides: { push: { id: id } }
        }
      });

      // Update the ride to reflect booking
      await prisma.ride.update({
        where: { id: id },
        data: {
          passengers: { increment: 1 }, // Increment the passengers count
          passengerIds: { push: email }, // Add the user's email to the passengerIds array
        }
      });

      return res.status(200).json({ message: "Ride successfully booked" });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

//FUNCTION TO GET ALL BOOKINGS OF A USER
export const getAllBookings = asyncHandler(async(req, res) => {
  const {email} = req.body
  try {
    const bookings = await prisma.user.findUnique({
      where: {email},
      select: {bookedRides: true}
    })
    res.status(200).send(bookings)
  }catch(err){
    throw new Error(err.message);
  }
})

//FUNCTION TO CANCEL A BOOKING
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    // Find the user and select their booked rides
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedRides: true }
    });

    // Check if the user has booked the ride
    const isBooked = user.bookedRides.some((ride) => ride.id === id);
    if (!isBooked) {
      return res.status(400).json({ message: "This ride is not booked by the user" });
    }

    // Update the user's booked rides list to remove the ride
    await prisma.user.update({
      where: { email: email },
      data: {
        bookedRides: {
          set: user.bookedRides.filter((ride) => ride.id !== id)
        }
      }
    });

    // Update the ride to reflect the cancellation
    await prisma.ride.update({
      where: { id: id },
      data: {
        passengers: { decrement: 1 }, // Decrement the passengers count
        passengerIds: {
          set: prisma.raw`ARRAY_REMOVE(passengerIds, ${email})`
        } // Remove the user's email from the passengerIds array
      }
    });

    return res.status(200).json({ message: "Booking successfully cancelled" });
  } catch (error) {
    throw new Error(error.message);
  }
});
    