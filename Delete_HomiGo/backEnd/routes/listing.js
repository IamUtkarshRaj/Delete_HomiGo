const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isloggedin");
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
} = require("../controller/listing.controller");

// Public routes
router.get("/", getAllListings);
router.get("/:id", getListingById);

// Protected routes
router.post("/", isLoggedIn, createListing);
router.put("/:id", isLoggedIn, updateListing);
router.delete("/:id", isLoggedIn, deleteListing);

module.exports = router;
