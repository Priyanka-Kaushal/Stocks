const express = require('express');
const mongoose = require('mongoose');
const stockRoutes = require("./src/routes/stockControllerRoutes");
const rawMaterialRoutes = require("./src/routes/rawMaterialRoutes"); 
const attendanceRoutes = require("./src/routes/attendanceRoutes")


const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/stock-management", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


app.use("/api/stock", stockRoutes);
app.use("/api/rawMaterialStock", rawMaterialRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

