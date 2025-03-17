import mongoose from "mongoose";

const Favorites = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

// Favorites.index({ userId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Favorites || mongoose.model("Favorites", Favorites);
