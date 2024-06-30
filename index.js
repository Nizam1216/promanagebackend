const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectToDb = require("./db");
const userRoutes = require("./routes/userroutes");
const noteRoutes = require("./routes/noteroutes");
const bodyParser = require("body-parser");
const cors = require("cors");
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 5000;
connectToDb();
app.use("/api/user", userRoutes);
app.use("/api/note", noteRoutes);
app.get("/", (req, res) => {
  res.send("<h1>Test Page</h1>");
});
app.listen(port, () => {
  console.log(`Server is listening at port http://localhost:${port}`);
});
