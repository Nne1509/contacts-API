const express = require("express");

const app = express();
const dotenv = require("dotenv");
const userRouter = require("./Routes/userRoute");
const contactRouter = require("./Routes/contactRoutes");
const pool = require("./db");

dotenv.config();

const port = 5000;

//middleware
app.use(express.json());
app.use("/", userRouter);
app.use("/", contactRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
