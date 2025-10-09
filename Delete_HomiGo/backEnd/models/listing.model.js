const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    availableRooms: {
      type: Number,
      default: 1,
    },
    roomType: {
      type: String,
      enum: ["single", "shared", "apartment"],
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    preferences: {
      gender: {
        type: String,
        enum: ["male", "female", "any"],
        default: "any"
      },
      smoking: {
        type: Boolean,
        default: false
      },
      pets: {
        type: Boolean,
        default: false
      },
      foodPreferences: {
        type: String,
        enum: ["veg", "non-veg", "any"],
        default: "any"
      }
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

module.exports = { Listing };
