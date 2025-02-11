import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, min: 0, default: 0 },
    condition: { type: String, enum: ["new", "excellent", "good", "fair", "old"], required: true },
    categories: {
      type: [String],
      default: [],
      set: (categories: string[]) => categories.map((c) => c.trim()), // Trim each category
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // GeoJSON format
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (val: number[]) {
            return val.length === 2 && val.every((num) => typeof num === "number");
          },
          message: "Coordinates must be an array of two numbers [longitude, latitude].",
        },
      },
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    images: [{ type: String, required: true }], // Array of image URLs
    isSold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index location for geospatial queries
BookSchema.index({ location: "2dsphere" }, { sparse: true });

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
