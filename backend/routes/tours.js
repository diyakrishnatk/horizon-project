import express from "express";
import {
  createTour,
  deleteTour,
  getAllTour,
  getFeaturedTour,
  getSingleTour,
  getTourBySearch,
  getTourCount,
  updateTour,
} from "../controllers/tourController.js";

import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// Create new tour
router.post("/", verifyAdmin, createTour);

// Update tour
router.put("/:id", verifyAdmin, updateTour);

// Delete tour
router.delete("/:id", verifyAdmin, deleteTour);

// IMPORTANT: Put search routes BEFORE /:id
router.get("/search/getTourBySearch", getTourBySearch);
router.get("/search/getFeaturedTours", getFeaturedTour);
router.get("/search/getTourCount", getTourCount);

// Get all tours
router.get("/", getAllTour);

// Get single tour
router.get("/:id", getSingleTour);

export default router;