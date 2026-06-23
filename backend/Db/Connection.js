require("dotenv").config();
const mongoose = require("mongoose");
const db = process.env.MONGO_URI;
mongoose
  .connect(db, {})
  .then(() => console.log("Mongodb connected"))
  .catch((error) => {
    console.log(error.message);
  });
