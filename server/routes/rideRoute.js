import express from 'express'
import { createRide, getAllRides, getRide } from '../controllers/rideCntrl.js'
const router = express.Router()

router.post("/create", createRide)
router.get("/allrides", getAllRides)
router.get("/:id", getRide)

export {router as rideRoute}