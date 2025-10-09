const { Listing } = require("../models/listing.model");
const cloudinary = require("../utils/cloudinary");

// Get all rooms with filters
const getRooms = async (req, res) => {
  try {
    const { minPrice, maxPrice, amenities, preferences, location } = req.query;
    let query = {};

    // Build filter query
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (amenities) {
      query.amenities = { $all: amenities.split(',') };
    }

    if (preferences) {
      const prefObj = JSON.parse(preferences);
      Object.keys(prefObj).forEach(key => {
        query[`preferences.${key}`] = prefObj[key];
      });
    }

    if (location) {
      // Assuming location is sent as "lat,lng"
      const [lat, lng] = location.split(',').map(Number);
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: 10000 // 10km radius
        }
      };
    }

    const rooms = await Listing.find(query).populate("owner", "fullname email phone profilePicture");
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get room details
const getRoomDetails = async (req, res) => {
  try {
    const room = await Listing.findById(req.params.id).populate("owner", "fullname email phone profilePicture");
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new room
const createRoom = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      price,
      availableRooms,
      roomType,
      amenities,
      preferences,
      location
    } = req.body;

    if (!title || !description || !address || !price || !roomType) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    // Handle image upload
    let images = [];
    if (req.files && req.files.images) {
      const uploadedImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const image of uploadedImages) {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: "rooms",
          width: 1200,
          crop: "scale"
        });
        images.push(result.secure_url);
      }
    }

    const room = await Listing.create({
      owner: req.user._id,
      title,
      description,
      address,
      price,
      images,
      availableRooms,
      roomType,
      amenities,
      preferences,
      location
    });

    res.status(201).json({ success: true, message: "Room created successfully", data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update room
const updateRoom = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      price,
      availableRooms,
      roomType,
      amenities,
      preferences,
      location
    } = req.body;

    const room = await Listing.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // Check if user is owner
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this room" });
    }

    // Handle new images
    let images = room.images;
    if (req.files && req.files.images) {
      const uploadedImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const image of uploadedImages) {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: "rooms",
          width: 1200,
          crop: "scale"
        });
        images.push(result.secure_url);
      }
    }

    const updatedRoom = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        address,
        price,
        images,
        availableRooms,
        roomType,
        amenities,
        preferences,
        location
      },
      { new: true }
    ).populate("owner", "fullname email phone profilePicture");

    res.status(200).json({ success: true, message: "Room updated successfully", data: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete room
const deleteRoom = async (req, res) => {
  try {
    const room = await Listing.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // Check if user is owner
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this room" });
    }

    await room.deleteOne();
    res.status(200).json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRooms,
  getRoomDetails,
  createRoom,
  updateRoom,
  deleteRoom
};

// Update listing
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id }, // ensure only owner can update
      { $set: req.body },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Listing updated", data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete listing
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all listings (alias for getRooms)
const getAllListings = async (req, res) => {
  return getRooms(req, res);
};

// Get listing by ID (alias for getRoomDetails)
const getListingById = async (req, res) => {
  return getRoomDetails(req, res);
};

// Create listing (alias for createRoom)
const createListing = async (req, res) => {
  return createRoom(req, res);
};

module.exports = {
  getRooms,
  getRoomDetails,
  createRoom,
  updateRoom,
  deleteRoom,
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing
};
