const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { connection } = require("mongoose");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

//all request
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionrequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      connectionStatus: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]);

    if (connectionrequests.length === 0) {
      throw new Error("No connection request found");
    }
    const interestedUserData = connectionrequests.map((connectionrequest) => {
      return connectionrequest.fromUserId;
    });
    //show who has send the request
    res.json({ userData: interestedUserData });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }],
      connectionStatus: "accepted",
    })
      .populate("fromUserId", ["firstName", "lastName", "photoUrl"])
      .populate("toUserId", ["firstName", "lastName", "photoUrl"]);

    if (connections.length === 0) {
      throw new Error("No connection found");
    }
    const connectionData = connections.map((connection) => {
      if (connection.fromUserId._id.toString() === loggedUser._id.toString()) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });
    res.json({ userData: connectionData });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;
