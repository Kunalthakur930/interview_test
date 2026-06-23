require("dotenv").config();
const PORT = process.env.PORT || 5555;
const express = require("express");
const server = express();
const cors = require("cors");
server.use(express.json());
server.use(cors());
require("./Db/Connection");
server.use("/api", require("./Routes/userRoutes"));
server.listen(PORT, () => {
  console.log(`Server running at :http://localhost:${PORT}`);
});
