require("dotenv").config();

const express = require('express');
const connectDB = require("./config/db");
const newsRoute = require("./routes/newsRoute");
const adminRoute = require("./routes/adminRoute");
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));

app.use(express.json());
connectDB();

app.use('/api/news', newsRoute);
app.use("/api/admin", adminRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});