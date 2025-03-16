import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, min: 0, default: 0 },
    condition: {
      type: String,
      enum: ["new", "excellent", "good", "fair", "old"],
      required: true,
    },
    bookStatus: {
      type: String,
      trim: true,
      enum: ["available", "pending", "claimed"],
      default: "available",
    },
    categories: {
      type: [String],
      default: [],
      set: (categories: string[]) => categories.map((c) => c.trim()), // Trim each category
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (val: number[]) {
            return val.length === 2 && val.every((num) => typeof num === "number");
          },
          message: "Coordinates must be an array of two numbers [latitude, longitude].",
        },
        // index: "2dsphere", // Geospatial index for efficient queries
      },
      dataOrigin: { type: String, trim: true, default: "" },
      placeId: { type: String, trim: true, default: "" },
      googleMapUrl: { type: String, trim: true, default: "" },
      boundingBox: { type: mongoose.Schema.Types.Mixed, default: null },
      address: { type: String, trim: true, default: "" },
      address2: { type: String, trim: true, default: "" },
      addressResponse: { type: mongoose.Schema.Types.Mixed, default: null },
      pincode: { type: String, trim: true, default: "" },
    },
    seller: { type: String, required: true },
    images: [{ type: String, required: true }], // Array of image URLs
    isSold: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index location for geospatial queries
BookSchema.index({ "location.coordinates": "2dsphere" }, { sparse: true });

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
