const mongoose = require("mongoose");

const oauthAccountSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["google", "github"],
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

oauthAccountSchema.index(
  { provider: 1, providerAccountId: 1 },
  { unique: true }
);

module.exports = mongoose.model("OAuthAccount", oauthAccountSchema);
