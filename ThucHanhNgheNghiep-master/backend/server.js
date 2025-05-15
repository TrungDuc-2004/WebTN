const express = require("express");
const connectDb = require("./data/db.js");
const cors = require("cors");

const userRoutes = require("./routes/userRoute.js");
const examRoutes = require("./routes/examRoute.js");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("public/uploads"));

connectDb();

app.use("/api", userRoutes);
app.use("/api", examRoutes);

app.listen(port, () => console.log(`http://localhost:${port}`));
