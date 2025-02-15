import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    emailVerified: { type: Boolean, default: false },
    displayName: { type: String, trim: true, default: "" },
    photoURL: { type: String, trim: true, default: "" },
    phoneNumber: { type: String, trim: true, default: "" },
    disabled: { type: Boolean, default: false },
    metadata: {
      creationTime: { type: Date },
      lastSignInTime: { type: Date },
      lastRefreshTime: { type: Date },
    },
    providerData: { type: Array, default: [] },
    passwordHash: { type: String, default: "" },
    passwordSalt: { type: String, default: "" },
    tokensValidAfterTime: { type: Date },
    tenantId: { type: String, trim: true, default: "" },
    lastMetadataFetch: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ uid: 1 }, { unique: true, sparse: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
