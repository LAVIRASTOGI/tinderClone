const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
//require database
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

//convert JSon object to the js object and add in req again
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/request", requestRouter);

// // // code starts matching route from up to down in order
// // // // always this route will run (overrides other route)
// // // if we write down  then this will work fine
// // // app.use("/", (req, res) => {
// // //   res.send("Hello World from server main");
// // // });
// // app.use("/hello/2", (req, res) => {
// //   res.send("Hello World from hello 2");
// // });
// // app.use("/hello", (req, res) => {
// //   res.send("Hello World from server main");
// // });

// // //get
// // app.get("/user", (req, res) => {
// //   res.send({ name: "lavi", password: "lavi" });
// // });
// // //post
// // app.post("/user", (req, res) => {
// //   res.send("Hello World from post");
// // });
// // //delete
// // app.delete("/user", (req, res) => {
// //   res.send("Hello World from delete");
// // });
// // //patch
// // app.patch("/user", (req, res) => {
// //   res.send("Hello World from patch");
// // });

// //explore regular expression
// //+ -->testtttt ,teswsdast
// // '?'---> test will work , tet
// ///t(es)?t --> tt ,test
// // '*t'-->teswwwwt,test,uuut (anything ending with t will work)
// // app.get("/*t", (req, res) => {
// //   res.send("Hello World from test");
// // });

// //query params
// //http://localhost:7777/userData?name=lavi&&id=222
// // app.get("/userData", (req, res) => {
// //   console.log(req.query);
// //   //{ name: 'lavi', id: '222' }
// //   res.send("Hello World from query params");
// // });

// // //dynmaic routes
// // app.get("/userData/:id/:name", (req, res) => {
// //   console.log(req.params);
// //   //   { id: '67', name: 'lavi' }
// //   res.send("Hello World from dynamic routes");
// // });

// // //anything with /test or /test/hello will match the /test
// // //match all HTTTP method API
// // app.use("/test", (req, res) => {
// //   res.send("Hello World from test");
// // });

// //route handler -- if we send res.send() - to client connection will close
// //now suppose --- we comment  res.send() then to in this case it
// //noe go to 2nd rout handler
// //req will hang
// app.use(
//   "/user",
//   (req, res) => {
//     console.log("Hello World from user");
//     res.send("Hello World from user");
//   },
//   (req, res) => {
//     console.log("Hello World from user2");
//     res.send("Hello World from user2");
//   }
// );

// //how will to go with help of next
// //
//   (req, res, next) => {
//     console.log("Hello World from user");
//     next();
//   } -- as as middlewares
// app.use(
//   "/user2",
//   (req, res, next) => {
//     console.log("Hello World from user");
//     next();
//   },
//   (req, res) => {
//     console.log("Hello World from user2");
//     res.send("Hello World from user2");
//   }
// );

// //here after send  u said next - so go to other routehandler
// //and then it will show error cannot set headers after they are sent to the client
// //because we have already sent response to client

// app.use(
//   "/user2",
//   (req, res, next) => {
//     console.log("Hello World from user");
//     res.send("Hello World from user1");
//     next();
//   },
//   (req, res) => {
//     console.log("Hello World from user2");
//     return res.send("Hello World from user2");
//   }
// );

// //in use we can add multiple route handlers
// app.use(
//   "/user2",
//   (req, res, next) => {
//     console.log("Hello World from user");
//     next();
//   },
//   (req, res) => {
//     console.log("Hello World from user2");
//     return res.send("Hello World from user2");
//   }
// );

// //error - as route not found
// app.use(
//   "/user2",
//   (req, res, next) => {
//     console.log("Hello World from user");
//     next();
//   },
//   (req, res) => {
//     console.log("Hello World from user2");
//     next();
//   }
// );

// //routes can be inside array
// app.use("/user2", [
//   (req, res, next) => {
//     console.log("Hello World from user");
//     next();
//   },
//   (req, res) => {
//     console.log("Hello World from user2");
//     res.send("Hello World from user2");
//   },
// ]);

// //app.use('/user',rh1,[rh2,rh3],rh4)

// app.get("/user", (req, res, next) => {
//   next();
// });

// app.get("/user", (req, res, next) => {
//   res.send("Hello World from user2");
// });

// app.use("/admin", adminAuth);

// app.get("/admin/getData", (req, res) => {
//   res.send("Hello World from admin get");
// });
// app.delete("/admin/deleteData", (req, res) => {
//   res.send("Hello World from admin deleteData");
// });

// app.get("/user", userAuth, (req, res) => {
//   res.send("Hello World from user");
// });

// app.get("/user/login", (req, res) => {
//   throw new Error("Something went wrong in login");
//   res.send("Hello World from user lofin");
// });
// //express will check for all routes (/user) one by one till it gets /user routes
// //and it gets the response if multiple route with (/user ) is there it will
// //check line by line if (next) then that route will act as middleware

// //error handler like thsi or use proper try catch
// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(500).send(err.message);
// });

//created a server

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("database cannot be connected");
  });
