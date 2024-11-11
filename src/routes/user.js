const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { connection } = require("mongoose");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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

//get all data of user expect those in connection request /feed  and do limit =10
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 1;
    const skip = (page - 1) * limit;

    //only get fromUserId ,touserId' from db
    const connectionrequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //remove duplicates connection requests

    let connectionIds = new Set();
    connectionrequests.forEach((connectionrequest) => {
      connectionIds.add(connectionrequest.fromUserId.toString());
      connectionIds.add(connectionrequest.toUserId.toString());
    });
    //convert Set to array
    connectionIds = Array.from(connectionIds);

    const users = await User.find({ _id: { $nin: connectionIds } })
      .skip(skip)
      .limit(limit);
    res.json({ users });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
