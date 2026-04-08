import express from 'express'
import { createBooking, getAllBooking, getBooking } from '../controllers/bookingController.js'
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js'

const router=express.Router()

router.post("/" ,verifyToken, createBooking);
router.get("/:id" ,verifyUser, getBooking);
router.get("/" ,verifyAdmin, getAllBooking);



export default router
