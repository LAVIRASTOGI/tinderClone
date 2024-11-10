const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    //lavi -- xyz
    //lavi from - xyz is to
    const toUserId = req?.params?.toUserId;
    if (!toUserId) {
      throw new Error("toUserId is required");
    }
    const fromUserId = req?.user?._id;

    const status = req?.params?.status;
    if (!["interested", "ignored"].includes(status)) {
      throw new Error("Invalid status");
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error("Connection request already exists");
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      connectionStatus: status,
    });

    await connectionRequest.save();
    res.json({ message: "Connection  Request sent succesfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

//accept or reject request
requestRouter.post("/review/:status/:reviewId", userAuth, async (req, res) => {
  //xyz -- logged test-review id // to userid
  try {
    const logedInuser = req.user;
    const reviewId = req.params.reviewId;

    const status = req?.params?.status;
    if (!["accepted", "rejected"].includes(status)) {
      throw new Error("Invalid status");
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: reviewId,
      toUserId: logedInuser._id,
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    if (!connectionRequest) {
      throw new Error("Connection request not found");
    }

    connectionRequest.connectionStatus = status;
    await connectionRequest.save();
    res.json({
      message: "Connection  Request updated succesfully",
      data: connectionRequest,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = requestRouter;
