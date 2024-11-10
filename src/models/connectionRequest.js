const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    connectionStatus: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected", "ignored", "interested"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.index({ toUserId: 1, fromUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  console.log("came here", this.fromUserId, this.toUserId);
  // compare both are same
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("fromUserId and toUserId cannot be same");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
