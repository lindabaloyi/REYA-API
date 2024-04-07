import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js"; // Assuming this imports your Prisma client


// FUNCTION TO CREATE A RIDE
export const createRide = asyncHandler(async (req, res) => {
  const {
    driver, // Add driver field if required by your backend logic
    departure, // Optional - Can be removed if not used
    depTime,
    depDate,
    departStreet,
    departRegion,
    departCity,
    departProvince,
    departLong,
    departLat,
    arrivalStreet,
    arrivalRegion,
    arrivalCity,
    arrivalProvince,
    arrivalLong,
    arrivalLat,
    routes, // Optional - Add if routes are required
    stopover, // Optional - Add if stopover information is needed
    midSeat,
    availSeats,
    passengers, // Change to an array if you want pre-populated passengers
    passengerIds,
    pricePerSeat,
    stopoverPrice,
    publish,
    profPic,
    rideInfo,
    userEmail, // Assuming userEmail is used for owner relationship
  } = req.body.data;

  console.log(req.body.data); // Optional for debugging

  try {
    const ride = await prisma.ride.create({
      data: {
        driver,
        departure, // Optional - Remove if not used in your schema
        depTime,
        depDate,
        departStreet,
        departRegion,
        departCity,
        departProvince,
        departLong,
        departLat,
        arrivalStreet,
        arrivalRegion,
        arrivalCity,
        arrivalProvince,
        arrivalLong,
        arrivalLat,
        routes, // Optional - Add if routes are required
        stopover, // Optional - Add if stopover information is needed
        midSeat,
        availSeats,
        passengers, // Change to an array if you want pre-populated passengers
        passengerIds,
        pricePerSeat,
        stopoverPrice,
        publish,
        profPic,
        rideInfo,
        owner: { connect: { email: userEmail } }, // Connect owner using userEmail
      },
    });

    res.send({ message: "Ride created successfully", ride });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("A ride with address already there");
    }
    throw new Error(err.message);
  }
});


// FUNCTION TO GET ALL THE RIDES
export const getAllRides = asyncHandler(async(req, res) => {
  const rides = await prisma.ride.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(rides);
});


// FUNCTION TO GET A SINGLE RIDE
export const getRide = asyncHandler(async(req, res) => {
  const { id } = req.params;

  try {
    const ride = await prisma.ride.findUnique({
      where: { id }
    });
    res.send(ride);
  } catch(err) {
    throw new Error(err.message);
  }
});
