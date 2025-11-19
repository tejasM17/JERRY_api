const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const passport = require("./config/passport");
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

require("./middleware/session")(app);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", require("./router/authRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "TrustiFY server is running" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
