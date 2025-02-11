import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    photoURL: { type: String, trim: true, default: "" },
    firebaseUID: { type: String, unique: true, sparse: true }, // Unique for Firebase users
    provider: { type: String, enum: ["email", "google"], required: true },
    emailVerified: { type: Boolean, default: false },
    phoneNumber: { type: String, trim: true, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isDonor: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ firebaseUID: 1 }, { unique: true, sparse: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
