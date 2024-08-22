const express = require("express");
const colors = require("colors");
const morgan = require("morgan"); // Fixed typo from "moragan" to "morgan"
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const setupAdminUser = require("./config/setupAdmin");
const logUserActivity = require('./middlewares/logger');
const authMiddleware = require("./middlewares/authMiddleware");
const loginController = require("./controllers/userCtrl");

//dotenv config
dotenv.config();

//mongodb connection
connectDB();
setupAdminUser();

//rest object
const app = express();

// Apply middlewares
app.use(express.json());
app.use(morgan("dev"));

// Define routes
app.use(authMiddleware);
app.use(logUserActivity);

// Apply authentication middleware to routes that require it
 // Apply both auth and logging middleware
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

// Port
const port = process.env.PORT || 8081;
// Listen port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});
