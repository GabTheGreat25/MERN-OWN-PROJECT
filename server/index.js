import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import userRouter from "./routes/user.js";

const port = 5000;
const app = express();
const MONGODB_URL =
  "mongodb+srv://gabgab:GABZ092501@tour.un8jbrt.mongodb.net/?retryWrites=true&w=majority";

app.use(morgan("dev"));
app.use(
  express.json({
    limit: "50mb",
    extend: true,
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extend: true,
  })
);
app.use(cors());

//routes for users
app.use("/api/users", userRouter); // http://localhost:5000/users/signup

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
