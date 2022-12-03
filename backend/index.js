const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");
const foodRouter = require("./routes/foodRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRouter");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/foods", foodRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log("Server running on port " + port);
});
