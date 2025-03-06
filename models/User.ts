import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    emailVerified: { type: Boolean, default: false },
    displayName: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    photoURL: { type: String, trim: true, default: "" },
    photoURLCustom: { type: String, trim: true, default: "" },
    phoneNumber: { type: String, trim: true, default: "" },
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
